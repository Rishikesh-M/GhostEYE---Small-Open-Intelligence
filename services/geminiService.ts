import { GoogleGenAI } from "@google/genai";
import { GeminiSearchResponse, SearchFilters, SearchResultItem } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

/**
 * Performs a deep search using Gemini with Google Search Grounding.
 * Uses thinking models (Gemini 2.5/3.0) for higher accuracy when deepSearch is enabled.
 */
export const searchIntelligence = async (
  query: string,
  filters: SearchFilters
): Promise<GeminiSearchResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // Model selection based on task complexity
  const modelName = filters.deepSearch ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  
  // Configure Thinking Budget for accuracy if Deep Search is on
  // 2.5 series supports Thinking. 3.0 Pro Preview also supports it per instructions.
  const thinkingBudget = filters.deepSearch ? 8192 : 0; // 0 disables it for fast search

  const prompt = `
    You are an expert Open Source Intelligence (OSINT) investigator with global reach.
    
    ### USER INPUT:
    Query: "${query}"
    Target Output Type Hint: ${filters.dataType}
    
    ### CONFIGURATION:
    - Exact Match Mode: ${filters.exactMatch}
    - Cross-Reference Mode: ${filters.crossReference}
    - Include Socials: ${filters.includeSocials}
    - Search Scope: GLOBAL / EVERYWHERE.

    ### SEARCH STRATEGY BASED ON TYPE:
    1. **Type = 'text' (Specific Content/Title)**: 
       - Search for webpages, articles, PDFs, or documents that contain this exact text, title, or are about this specific subject content.
       - Ignore broad matches. Focus on relevance to the text block provided.
    2. **Type = 'url' (Link Analysis)**:
       - Analyze the provided URL. Who owns it? What is the site's reputation? 
       - Find backlinks or discussions *about* this URL on forums, social media, or news sites.
    3. **Type = 'username' | 'email' | 'phone' | 'address'**:
       - Perform standard OSINT correlation. Link the identifier to real-world identities, social profiles, and public records.
    4. **Type = 'all'**:
       - Infer the intent. If it looks like a URL, treat as URL. If it looks like a person's name, treat as Person.

    ### YOUR MISSION:
    1. **Deconstruct**: Break the query into all potential identifiers or key phrases.
    2. **Global Search**: Search *everywhere* publicly indexed (Web, Social, News, Directories).
    3. **Correlate & Verify**: 
       - High Accuracy is paramount. 
       - If "Cross-Reference Mode" is on, you MUST find a link between the major query parts.
    4. **Aggregate**: Group findings into distinct "Entities" or "Result Blocks".

    ### OUTPUT FORMAT:
    Return a strictly valid JSON object inside a markdown code block (\`\`\`json ... \`\`\`).
    
    Structure:
    {
      "items": [
        {
          "id": "generated_uuid",
          "title": "Title of Page, Entity Name, or Domain",
          "description": "Comprehensive summary. If text search, summarize the content found. If URL, summarize the site analysis.",
          "mainData": "The specific matching text/url/username",
          "type": "${filters.dataType === 'all' ? 'inferred_type' : filters.dataType}",
          "linkedData": [
            { 
              "type": "email | phone | address | social | job | alias | website | author | date", 
              "value": "string value", 
              "confidence": "high | medium | low", 
              "source": "Platform Name" 
            }
          ]
        }
      ]
    }
    
    If no high-confidence data is found after a thorough search, return empty items. Do not invent data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: thinkingBudget > 0 ? { thinkingBudget } : undefined,
        temperature: 0.1, // Very low temperature for maximum factual accuracy
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract JSON from markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    let parsedItems: SearchResultItem[] = [];

    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.items && Array.isArray(parsed.items)) {
          parsedItems = parsed.items.map((item: any) => ({
             ...item,
             // Attach relevant sources if possible, or leave for the UI to display global sources
             sources: groundingChunks.map(g => ({ uri: g.web?.uri || '', title: g.web?.title || 'Source' })).filter(s => s.uri)
          }));
        }
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", e);
      }
    }

    return {
      items: parsedItems,
      rawText: text,
      groundingChunks: groundingChunks as any[],
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};