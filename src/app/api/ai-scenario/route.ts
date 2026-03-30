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
            content: `${L2W_CONTEXT}\n\nGenerate a realistic practice scenario for a link worker in the category: ${category}.\n\nDIVERSITY RULES — follow these strictly:\n- Use a DIFFERENT name, age, gender, cultural background, and living situation every time. NEVER use "Margaret".\n- Vary ages between 55 and 90+. Include men, women, couples, LGBTQ+ individuals, and people from different ethnic backgrounds.\n- Draw from diverse names such as: Harold, Priya, Chen Wei, Fatima, Dorothy, James, Anita, George, Kwame, Susan, Raj, Elena, Tomoko, Winston, Amara, Patrick, Lakshmi, Youssef, Betty, etc.\n- Vary settings: urban apartment, rural farmhouse, suburban home, retirement community, living with family, living alone, recently relocated.\n- Vary challenges: mobility, language barriers, cultural hesitation, grief, caregiver burnout, technology barriers, financial concerns, mental health, chronic pain, recent hospitalization.\n\nThe scenario should be 3-5 sentences long. Include a specific fictional name, age, and backstory. Make it specific and challenging but realistic. End with a clear question asking the link worker how they would handle the situation. Return ONLY the scenario text, no labels or prefixes.`,
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
            content: `${L2W_CONTEXT}\n\nYou are reviewing a link worker's response to a practice scenario. Read their response CAREFULLY — quote their specific words and reference exactly what they said.\n\nGive constructive feedback in exactly this format:\n\nWHAT YOU DID WELL: Quote 1-2 specific phrases or ideas from the worker's response that demonstrate good practice. Explain WHY those specific things align with L2W approaches. If the response is vague or minimal, acknowledge what little they did address.\n\nWHAT TO CONSIDER: Point out specific gaps — things the scenario raised that the worker did NOT address in their response. Name the missing elements directly (e.g., "You didn't mention discussing transportation options" or "Consider asking about their comfort level before scheduling a visit"). Be warm but specific.\n\nL2W BEST PRACTICE: Reference the exact L2W process, document, or step that applies to this scenario category (e.g., "the Intake and Co-Creation process", "the 3-day first contact rule", "the Follow-Up Schedule at 3, 6, and 12 months", "the Subsidy Discussion guidelines"). Be precise, not generic.\n\nKeep feedback concise — no more than 200 words total. Be encouraging but substantive.`,
          },
          {
            role: "user",
            content: `Scenario: ${scenario}\n\nLink worker's response: ${response}\n\nGive feedback.`,
          },
        ],
        max_tokens: 700,
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
