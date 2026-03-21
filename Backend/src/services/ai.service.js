import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

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
            maxRetries: 0, // Don't retry on rate limit — fail fast
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

function formatMessages(messages) {
    return messages
        .filter(msg => msg.content && msg.content.trim())
        .map(msg => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            } else {
                return new AIMessage(msg.content);
            }
        });
}

async function invokeWithTimeout(model, messages, timeoutMs = 30000) {
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`AI model timed out after ${timeoutMs / 1000}s`)), timeoutMs)
    );
    const response = await Promise.race([
        model.invoke(messages),
        timeoutPromise
    ]);
    return response.content;
}

export async function generateResponse(messages) {
    const formattedMessages = formatMessages(messages);

    if (formattedMessages.length === 0) {
        return "I didn't receive any message. Could you try again?";
    }

    // Try Gemini first, fall back to Mistral
    try {
        const result = await invokeWithTimeout(getGeminiModel(), formattedMessages, 30000);
        return result;
    } catch (geminiError) {
        console.warn("Gemini failed:", geminiError.message, "— falling back to Mistral");
    }

    // Fallback: Mistral
    try {
        const result = await invokeWithTimeout(getMistralModel(), formattedMessages, 30000);
        return result;
    } catch (mistralError) {
        console.error("Mistral also failed:", mistralError.message);
        throw new Error("All AI models failed. Please try again later.");
    }
}

export async function chatMessageTitle(message) {
    const response = await getMistralModel().invoke([
        new SystemMessage(`Generate a 3–5 word title for this chat message. Focus on the main topic, question, or action. Match the tone (urgent, casual, etc.) and keep it clear and direct. Ignore minor details. Message: ${message}`)
    ]);
    return response.content;
}