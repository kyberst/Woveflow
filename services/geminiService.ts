import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real app, strict error handling for missing keys is needed.
// For this environment, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIContent = async (prompt: string, currentContent?: string): Promise<string> => {
  try {
    const fullPrompt = `
      You are an expert web developer and copywriter.
      Task: Generate or improve HTML content based on the user's request.
      
      User Request: ${prompt}
      
      ${currentContent ? `Current Context HTML: ${currentContent}` : ''}
      
      Rules:
      1. Return ONLY valid HTML.
      2. Do not include markdown backticks like \`\`\`html.
      3. Use Tailwind CSS classes for styling.
      4. Ensure the HTML is responsive.
      5. Do not include <html>, <head>, or <body> tags, just the inner content elements.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    let text = response.text || '';
    
    // Cleanup markdown if present despite instructions
    text = text.replace(/```html/g, '').replace(/```/g, '').trim();
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please check API Key configuration.");
  }
};