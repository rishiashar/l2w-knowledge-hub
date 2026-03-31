import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { L2W_CONTEXT } from "@/lib/l2w-context";

type QuizOption = {
  id: string;
  text: string;
};

type QuizPayload = {
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  whyOptions: Record<string, string>;
};

type PlanPayload = {
  coachNote: string;
  focusAreas: string[];
  successSignal: string;
};

type FeedbackPayload = {
  well: string;
  consider: string;
  bestPractice: string;
};

function extractJsonObject(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i)?.[1];
  const source = fenced ?? text;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(source.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function section(text: string, label: string, nextLabels: string[]) {
  const pattern = new RegExp(
    `${label}:\\s*([\\s\\S]*?)(?=${nextLabels.map((item) => `${item}:`).join("|") || "$"})`,
    "i"
  );
  return text.match(pattern)?.[1]?.trim() ?? "";
}

function normalizePlan(data: Record<string, unknown> | null, challenges: string): PlanPayload {
  const coachNote =
    typeof data?.coachNote === "string" && data.coachNote.trim()
      ? data.coachNote.trim()
      : "We will target the part of this stage that feels hardest right now and build from lower-pressure practice into more confident action.";

  const focusAreas = Array.isArray(data?.focusAreas)
    ? data.focusAreas.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 3)
    : [];

  return {
    coachNote,
    focusAreas:
      focusAreas.length > 0
        ? focusAreas
        : ["build confidence", "respond with empathy", "offer a practical next step"],
    successSignal:
      typeof data?.successSignal === "string" && data.successSignal.trim()
        ? data.successSignal.trim()
        : `By the end of this path, the learner should sound clearer, calmer, and more specific when handling: ${challenges.slice(0, 120)}.`,
  };
}

function normalizeQuiz(data: Record<string, unknown> | null, category: string, stage: string): QuizPayload {
  const rawOptions = Array.isArray(data?.options) ? data.options : [];
  const options = rawOptions
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const option = item as Record<string, unknown>;
      const id = typeof option.id === "string" ? option.id : String.fromCharCode(65 + index);
      const text = typeof option.text === "string" ? option.text.trim() : "";
      if (!text) return null;
      return { id, text };
    })
    .filter((item): item is QuizOption => Boolean(item))
    .slice(0, 3);

  const safeOptions =
    options.length === 3
      ? options
      : [
          { id: "A", text: "Acknowledge the concern and ask one clarifying question before offering a next step." },
          { id: "B", text: "Move directly into program details so the learner gets all the information quickly." },
          { id: "C", text: "Tell the person what they should do next without checking their comfort level." },
        ];

  const correctOptionId =
    typeof data?.correctOptionId === "string" && safeOptions.some((item) => item.id === data.correctOptionId)
      ? data.correctOptionId
      : safeOptions[0].id;

  const rawWhyOptions =
    data?.whyOptions && typeof data.whyOptions === "object"
      ? (data.whyOptions as Record<string, unknown>)
      : {};

  const whyOptions = safeOptions.reduce<Record<string, string>>((accumulator, option) => {
    const explanation = rawWhyOptions[option.id];
    accumulator[option.id] =
      typeof explanation === "string" && explanation.trim()
        ? explanation.trim()
        : option.id === correctOptionId
          ? "This option best matches an L2W-style response because it balances empathy, clarity, and a practical next move."
          : "This option misses part of the learner's real challenge or moves too quickly past what matters.";
    return accumulator;
  }, {});

  return {
    question:
      typeof data?.question === "string" && data.question.trim()
        ? data.question.trim()
        : `For ${category} during "${stage}", which response best reflects an L2W-aligned next step?`,
    options: safeOptions,
    correctOptionId,
    explanation:
      typeof data?.explanation === "string" && data.explanation.trim()
        ? data.explanation.trim()
        : "The strongest choice acknowledges the person's reality, avoids pressure, and moves toward a realistic next step.",
    whyOptions,
  };
}

function normalizeFeedback(text: string): FeedbackPayload {
  return {
    well:
      section(text, "WHAT YOU DID WELL", ["WHAT TO CONSIDER", "L2W BEST PRACTICE"]) ||
      "You showed a participant-centered instinct and tried to move the conversation forward respectfully.",
    consider:
      section(text, "WHAT TO CONSIDER", ["L2W BEST PRACTICE"]) ||
      "Consider naming the person's barrier more directly and offering one practical, low-pressure next step.",
    bestPractice:
      section(text, "L2W BEST PRACTICE", []) ||
      "Keep the conversation warm, realistic, and aligned with the relevant L2W workflow for this stage.",
  };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "your-key-here") {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const body = await request.json();
    const {
      action,
      category = "AI practice",
      stageLabel = "Stage",
      journeyStage = "Scenario",
      stepGoal = "",
      challenges = "",
      focusAreas = [],
      scenario = "",
      response = "",
      completedSteps = 0,
    } = body;

    const focusText = Array.isArray(focusAreas) ? focusAreas.join(", ") : "";

    if (action === "plan") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${L2W_CONTEXT}

You are creating a short adaptive coaching brief for a learner inside an AI training journey.

Return JSON only in this exact shape:
{
  "coachNote": "max 55 words",
  "focusAreas": ["short phrase", "short phrase", "short phrase"],
  "successSignal": "one sentence"
}

The coaching brief should reflect the learner's stated blockers, stay warm and specific, and focus on practical social prescribing behavior.`,
          },
          {
            role: "user",
            content: `Training category: ${category}
Stage label: ${stageLabel}
Learner blockers: ${challenges}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      });

      const planText = completion.choices[0]?.message?.content?.trim() ?? "";
      return NextResponse.json({ plan: normalizePlan(extractJsonObject(planText), challenges) });
    }

    if (action === "generate") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${L2W_CONTEXT}

Create a realistic, personalized practice scenario for a link worker.

Rules:
- Make the scenario specific to the learner's blockers and the current training step.
- Use a fresh fictional person every time. Never use Margaret.
- Vary age, background, living situation, and challenge.
- Weave in at least one of the learner's blockers in a believable way.
- Keep it 4-6 sentences.
- End with a direct question asking how the learner would respond.
- Return only the scenario text.`,
          },
          {
            role: "user",
            content: `Category: ${category}
Stage label: ${stageLabel}
Current step: ${journeyStage}
Step goal: ${stepGoal}
Learner blockers: ${challenges || "No blockers provided"}
Coach focus areas: ${focusText || "No focus areas provided"}
Completed steps so far: ${completedSteps}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.85,
      });

      const scenarioText = completion.choices[0]?.message?.content?.trim() ?? "";
      return NextResponse.json({ scenario: scenarioText });
    }

    if (action === "quiz") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${L2W_CONTEXT}

Create one short personalized checkpoint quiz for an adaptive learning journey.

Return JSON only in this exact shape:
{
  "question": "string",
  "options": [
    { "id": "A", "text": "string" },
    { "id": "B", "text": "string" },
    { "id": "C", "text": "string" }
  ],
  "correctOptionId": "A or B or C",
  "explanation": "2-3 sentences",
  "whyOptions": {
    "A": "1 sentence",
    "B": "1 sentence",
    "C": "1 sentence"
  }
}

Make only one option clearly best. The best answer should reflect L2W-aligned, participant-centered practice.`,
          },
          {
            role: "user",
            content: `Category: ${category}
Stage label: ${stageLabel}
Current step: ${journeyStage}
Step goal: ${stepGoal}
Learner blockers: ${challenges || "No blockers provided"}
Coach focus areas: ${focusText || "No focus areas provided"}
Completed steps so far: ${completedSteps}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.45,
      });

      const quizText = completion.choices[0]?.message?.content?.trim() ?? "";
      return NextResponse.json({ quiz: normalizeQuiz(extractJsonObject(quizText), category, journeyStage) });
    }

    if (action === "feedback") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${L2W_CONTEXT}

You are reviewing a learner response inside a personalized training journey.

Respond in exactly this format:

WHAT YOU DID WELL: Quote 1-2 specific phrases or moves from the learner's response and explain why they helped.

WHAT TO CONSIDER: Point out the most important missed opportunity based on the learner's blockers, the scenario, and the current step goal.

L2W BEST PRACTICE: Name the relevant L2W process, principle, or workflow that should guide the next version of the response.

Keep the whole response under 220 words. Be warm, specific, and practical.`,
          },
          {
            role: "user",
            content: `Category: ${category}
Stage label: ${stageLabel}
Current step: ${journeyStage}
Step goal: ${stepGoal}
Learner blockers: ${challenges || "No blockers provided"}
Coach focus areas: ${focusText || "No focus areas provided"}

Scenario:
${scenario}

Learner response:
${response}`,
          },
        ],
        max_tokens: 700,
        temperature: 0.35,
      });

      const feedbackText = completion.choices[0]?.message?.content?.trim() ?? "";
      return NextResponse.json({
        feedback: normalizeFeedback(feedbackText),
        rawFeedback: feedbackText,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("AI Scenario API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
