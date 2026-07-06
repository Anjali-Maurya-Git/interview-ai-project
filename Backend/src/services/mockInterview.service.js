const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const questionsSchema = z.object({
    questions: z.array(z.object({
        id: z.number(),
        question: z.string(),
        type: z.enum(["technical", "behavioral", "hr"]),
    }))
});

async function generateMockQuestions({ resume, jobDescription }) {
    try {
        const prompt = `
You are an experienced interviewer. Generate 7-8 realistic interview questions for the given job.

Job Description: ${jobDescription}

Candidate Background: ${resume || "General professional with relevant experience"}

Instructions:
- Mix of Technical, Behavioral, and HR questions
- Questions should be relevant to the Job Description
- For non-technical jobs, focus more on practical skills, behavioral and situational questions
- Make questions different and natural
- Return only valid JSON
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(questionsSchema),
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("❌ generateMockQuestions Error:", error);
        throw error;
    }
}

async function evaluateAnswer({ question, answer }) {
    try {
        const prompt = `
Question: ${question}
Candidate Answer: ${answer || "No answer provided"}

You are a strict but fair interview evaluator. Analyze the answer and return **only valid JSON** with this exact structure:

{
  "score": number (0-100),
  "feedback": "detailed feedback in 2-4 lines",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "confidence": number (0-100),
  "communication": number (0-100),
  "grammar": number (0-100)
}

Give realistic scores based on answer quality.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { 
                responseMimeType: "application/json" 
            }
        });

        const result = JSON.parse(response.text);
        return result;

    } catch (error) {
        console.error("❌ evaluateAnswer Error:", error);
        throw error;
    }
}

module.exports = {
    generateMockQuestions,
    evaluateAnswer
};