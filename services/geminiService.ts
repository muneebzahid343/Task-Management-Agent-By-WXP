
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { GEMINI_TEXT_MODEL_NAME } from '../constants';
import { SuggestedTask } from '../types';

function parseJsonFromMarkdown(text: string): any {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn("Failed to parse JSON directly from text, might be a plain string or malformed JSON.", text, e);
    // Attempt to handle cases where the AI might not return perfect JSON but a list-like structure
    if (typeof text === 'string' && text.includes('\n') && !text.startsWith('[')) {
        // If it looks like a list of strings, try to make it a JSON array of strings
        try {
            const lines = text.split('\n').map(line => line.replace(/^- /,'').trim()).filter(line => line.length > 0);
            if (lines.length > 0) return lines; // Return as array of strings if it was a list
        } catch (parseErr) {
            // If this also fails, throw original error
             console.error("Failed to parse JSON from text after attempting list conversion:", text, parseErr);
             throw new Error("Received malformed response from AI, and fallback parsing failed.");
        }
    }
    throw new Error("Received malformed JSON response from AI.");
  }
}


export const generateText = async (apiKey: string, prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API error (generateText):', error);
    throw new Error(`AI text generation failed: ${(error as Error).message}`);
  }
};

export const summarizeTextWithGemini = async (apiKey: string, textToSummarize: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Summarize the following text concisely, focusing on the key points and actionable information:\n\nText:\n"""${textToSummarize}"""\n\nConcise Summary:`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.3, 
      }
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API error (summarizeText):', error);
    throw new Error(`AI summarization failed: ${(error as Error).message}`);
  }
};

export const breakdownProjectWithGemini = async (apiKey: string, topic: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Break down the following topic or project into a list of 5-7 key components, steps, or related ideas: "${topic}". Return these as a JSON array of strings. For example: ["Component 1", "Step 2", "Related Idea 3"].`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7, 
      }
    });

    const parsedData = parseJsonFromMarkdown(response.text);
    
    if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string')) {
      return parsedData as string[];
    } else {
      console.warn("AI did not return a valid JSON array of strings for project breakdown. Returning raw text.");
      return [response.text]; // Fallback to returning the raw text if parsing fails to produce string array
    }

  } catch (error) {
    console.error('Gemini API error (breakdownProject):', error);
    throw new Error(`AI project breakdown failed: ${(error as Error).message}`);
  }
};

export const suggestTasksFromProjectWithGemini = async (apiKey: string, projectDescription: string): Promise<SuggestedTask[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Given the project description: "${projectDescription}", generate a list of 3-5 actionable sub-tasks. For each sub-task, provide a concise 'title' and a brief 'description'. Return the tasks as a JSON array of objects, where each object has 'title' (string) and 'description' (string) keys.

Example response format:
\`\`\`json
[
  { "title": "Initial Research", "description": "Gather background information and define project scope." },
  { "title": "Outline Key Deliverables", "description": "List all major outputs expected from the project." }
]
\`\`\`

Project Description:
"${projectDescription}"

Suggested Tasks (JSON):`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      }
    });

    const parsedData = parseJsonFromMarkdown(response.text);

    if (Array.isArray(parsedData) && parsedData.every(item => typeof item.title === 'string' && typeof item.description === 'string')) {
      return parsedData as SuggestedTask[];
    } else {
      console.warn("AI did not return a valid JSON array of SuggestedTask objects. Attempting to parse from plain text or returning empty.");
      // Basic fallback: if it's a list of strings, map them to tasks with empty descriptions
      if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string')) {
        return (parsedData as string[]).map(title => ({ title, description: '' }));
      }
      return []; // Fallback to empty array if parsing fails
    }

  } catch (error) {
    console.error('Gemini API error (suggestTasksFromProject):', error);
    throw new Error(`AI task suggestion failed: ${(error as Error).message}`);
  }
};
