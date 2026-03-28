import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { L2W_CONTEXT } from "@/lib/l2w-context";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "your-key-here") {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    const body = await request.json();
    const { action, category, scenario, response } = body;

    if (action === "generate") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${L2W_CONTEXT}\n\nGenerate a realistic practice scenario for a link worker in the category: ${category}. Include a specific fictional name, age, and backstory for the older adult or healthcare provider involved. Make the scenario specific and challenging but realistic. The scenario should be 3-5 sentences long. End with a clear question asking the link worker how they would handle the situation. Return ONLY the scenario text, no labels or prefixes.`,
          },
          {
            role: "user",
            content: `Generate a scenario in the category: ${category}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      const scenarioText =
        completion.choices[0]?.message?.content?.trim() ?? "";

      return NextResponse.json({ scenario: scenarioText });
    }

    if (action === "feedback") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${L2W_CONTEXT}\n\nYou are reviewing a link worker's response to a practice scenario. Give constructive feedback in exactly this format:\n\nWHAT YOU DID WELL: [1-2 specific things they did right, reference L2W practices]\n\nWHAT TO CONSIDER: [1-2 specific suggestions for improvement, be warm and constructive]\n\nL2W BEST PRACTICE: [1 specific reference to an L2W process, document, or approach that's relevant to this scenario]\n\nKeep feedback concise — no more than 150 words total. Be encouraging.`,
          },
          {
            role: "user",
            content: `Scenario: ${scenario}\n\nLink worker's response: ${response}\n\nGive feedback.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const feedbackText =
        completion.choices[0]?.message?.content?.trim() ?? "";

      return NextResponse.json({ feedback: feedbackText });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'generate' or 'feedback'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI Scenario API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
