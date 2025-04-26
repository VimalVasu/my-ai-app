import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  console.log("💡 OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0,8), "…");
  const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return Response.json({ text: response.choices[0].message.content });
}
