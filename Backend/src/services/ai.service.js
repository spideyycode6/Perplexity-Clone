import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { webSearch } from "./webSearch.service.js";
import * as z from "zod";

// ─── Lazy-loaded models ───────────────────────────────────
let geminiModel = null;
let mistralModel = null;

const getGeminiModel = () => {
    if (!geminiModel) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in your .env file");
        }
        geminiModel = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            apiKey: process.env.GEMINI_API_KEY,
            maxRetries: 0,
        });
    }
    return geminiModel;
};

const getMistralModel = () => {
    if (!mistralModel) {
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error("MISTRAL_API_KEY is not set in your .env file");
        }
        mistralModel = new ChatMistralAI({
            model: "mistral-small-latest",
            apiKey: process.env.MISTRAL_API_KEY,
        });
    }
    return mistralModel;
};

// ─── Tool definition ──────────────────────────────────────
const searchWebTool = tool(
    async ({ query }) => {
        const result = await webSearch({ query });
        // Tools MUST return a string — LLMs can't read raw objects
        return typeof result === "string" ? result : JSON.stringify(result);
    },
    {
        name: "web_search",
        description:
            "Use this tool to search the internet for the latest information on any topic.",
        schema: z.object({
            query: z
                .string()
                .describe("The search query to look up on the internet."),
        }),
    }
);

// ─── Agent factories (fresh per call to handle rate-limit recovery) ──
const getGeminiAgent = () =>
    createReactAgent({ llm: getGeminiModel(), tools: [searchWebTool] });

const getMistralAgent = () =>
    createReactAgent({ llm: getMistralModel(), tools: [searchWebTool] });

// ─── Helpers ──────────────────────────────────────────────
function formatMessages(messages) {
    return messages
        .filter((msg) => msg.content && msg.content.trim())
        .map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            }
            return new AIMessage(msg.content);
        });
}

async function invokeAgentWithTimeout(agent, messages, timeoutMs = 30000) {
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
            () =>
                reject(
                    new Error(
                        `AI model timed out after ${timeoutMs / 1000}s`
                    )
                ),
            timeoutMs
        )
    );

    const response = await Promise.race([
        agent.invoke({ messages }),   // agent expects { messages: [...] }
        timeoutPromise,
    ]);

    // The last message in the response is the AI's final answer
    const agentMessages = response.messages;
    const lastMessage = agentMessages[agentMessages.length - 1];
    
    // Content can be a string or an array of parts (Gemini format)
    const content = lastMessage.content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .filter(p => p.type === "text")
            .map(p => p.text)
            .join("");
    }
    return String(content);
}

// ─── Public API ───────────────────────────────────────────
export async function generateResponse(messages) {
    const formattedMessages = formatMessages(messages);

    if (formattedMessages.length === 0) {
        return "I didn't receive any message. Could you try again?";
    }

    // ✅ ADD THIS — Instruct the agent to use web search
    const systemPrompt = new SystemMessage(
        `You are a helpful AI assistant with access to a web search tool.

IMPORTANT RULES:
- For ANY question about recent events, news, sports results, 
  current affairs, scores, winners, rankings, or anything that 
  may have happened after your training cutoff — you MUST use 
  the web_search tool BEFORE answering.
- NEVER guess or rely on your training data for time-sensitive 
  information.
- If the user asks "who won", "latest", "current", "2024", 
  "2025", or similar — ALWAYS search first.
- After searching, base your answer ONLY on the search results.`
    );

    const messagesWithSystem = [systemPrompt, ...formattedMessages];

    // Try Gemini agent first
    try {
        return await invokeAgentWithTimeout(
            getGeminiAgent(),
            messagesWithSystem,
            60000
        );
    } catch (geminiError) {
        console.warn(
            "Gemini failed:",
            geminiError.message,
            "— falling back to Mistral"
        );
    }

    // Fallback: Mistral agent
    try {
        return await invokeAgentWithTimeout(
            getMistralAgent(),
            messagesWithSystem,
            60000
        );
    } catch (mistralError) {
        console.error("Mistral also failed:", mistralError.message);
        throw new Error("All AI models failed. Please try again later.");
    }
}

export async function chatMessageTitle(message) {
    const response = await getMistralModel().invoke([
        new SystemMessage(
            `Generate a 3–5 word title for this chat message. ` +
            `Focus on the main topic, question, or action. ` +
            `Match the tone and keep it clear and direct. ` +
            `Message: ${message}`
        ),
    ]);
    return response.content;
}