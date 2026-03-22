import dotenv from "dotenv";
import { tavily } from "@tavily/core";
dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const webSearch = async ({ query }) => {
    try {
        const result = await tvly.search(query, {
            max_results: 5,
        });

        // Return a string so the LLM tool can use it directly
        if (!result?.results?.length) {
            return "No search results found.";
        }

        return result.results
            .map(
                (r, i) =>
                    `[${i + 1}] ${r.title}\n${r.url}\n${r.content}`
            )
            .join("\n\n");
    } catch (error) {
        console.error("Web search failed", error);
        return "Web search failed. Please try again later.";
    }
};