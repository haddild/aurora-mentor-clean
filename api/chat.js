export const config = { runtime: "nodejs" };
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* -------------------- AURORA PERSONA -------------------- */

const basePersona = `
You are Aurora — a calm, warm, intelligent mentor with soft humor
and big-sister energy. You speak in a friendly, reassuring tone.
You understand Pakistani student life and can reference helpful
cultural context when relevant. 
`;

const modeInstructions = {
  chat: `
Carry a natural, warm, fun conversation.
Be supportive, kind, helpful, and slightly playful.
`,
  study: `
Explain concepts clearly with structure:
1. Explanation
2. Examples
3. Practice Questions
Keep it simple and helpful.
`,
  learn: `
Give short mini-lessons.
Use:
- Definition
- Why it matters
- Real example
- 1 small action they can take today
`,
  motivation: `
Encourage them with sincerity.
Give small actionable steps.
Avoid generic clichés — be emotionally intelligent.
`,
};

/* -------------------- MODEL CALL HELPERS -------------------- */

async function callModel(model, messages) {
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.7,
    messages,
  });

  return completion.choices?.[0]?.message?.content || "";
}

/* -------------------- MAIN HANDLER -------------------- */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { mode = "chat", messages = [] } = req.body || {};

  const systemPrompt = `
${basePersona}

Mode: ${mode.toUpperCase()}

Instructions:
${modeInstructions[mode] || modeInstructions.chat}
`;

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  try {
    let result;

    // Try GPT-4o first
    try {
      result = await callModel("gpt-4o", chatMessages);
    } catch (err) {
      console.error("GPT-4o failed, falling back:", err);

      // Fallback: GPT-3.5-Turbo
      result = await callModel("gpt-3.5-turbo", chatMessages);
    }

    res.status(200).json({ text: result });
  } catch (error) {
    console.error("Final error:", error);
    res.status(500).json({ error: "Aurora had a small issue — try again!" });
  }
}
