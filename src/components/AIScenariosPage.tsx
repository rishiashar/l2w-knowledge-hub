"use client";

import { useEffect, useState } from "react";

type CoachPlan = {
  coachNote: string;
  focusAreas: string[];
  successSignal: string;
};

type ScenarioFeedback = {
  well: string;
  consider: string;
  bestPractice: string;
};

type QuizOption = {
  id: string;
  text: string;
};

type QuizContent = {
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  whyOptions: Record<string, string>;
};

type ScenarioContent = {
  scenario: string;
};

type StepKind = "scenario" | "quiz";

type JourneyStep = {
  id: string;
  kind: StepKind;
  eyebrow: string;
  title: string;
  objective: string;
};

type StageConfig = {
  id: string;
  stageLabel: string;
  name: string;
  difficulty: string;
  description: string;
  accent: string;
  surface: string;
  prompts: string[];
  outcomes: string[];
  journey: JourneyStep[];
};

type StepState = {
  content?: ScenarioContent | QuizContent;
  response?: string;
  feedback?: ScenarioFeedback;
  selectedOptionId?: string;
  quizSubmitted?: boolean;
  completed?: boolean;
};

type StageProgress = {
  challenges: string;
  coachPlan: CoachPlan | null;
  currentStepIndex: number;
  completedStepIds: string[];
  stepState: Record<string, StepState>;
  startedAt: string;
  updatedAt: string;
};

type ProgressMap = Record<string, StageProgress>;

const STORAGE_KEY = "l2w-ai-scenarios-progress-v2";

const STAGES: StageConfig[] = [
  {
    id: "first-contact",
    stageLabel: "Stage 1",
    name: "First Contact Calls",
    difficulty: "Foundation",
    description: "Turn the first outreach call into a warm, low-pressure next step.",
    accent: "#2C7A7B",
    surface: "linear-gradient(145deg, #ECF8F7 0%, #FFFFFF 48%, #E1F2F1 100%)",
    prompts: [
      "Older adults sound hesitant and I am not sure how to build trust quickly.",
      "I struggle to explain the program simply without sounding scripted.",
      "I am unsure how to end the first call with a realistic next step.",
    ],
    outcomes: ["Open with warmth", "Name the referral context clearly", "Invite a low-pressure next step"],
    journey: [
      { id: "quiz-1", kind: "quiz", eyebrow: "Quiz 1", title: "Opening instinct", objective: "Warm up with the best first move before you step into the live call." },
      { id: "scenario-1", kind: "scenario", eyebrow: "Scenario 1", title: "First hello", objective: "Practice the opening minute and your first trust-building move." },
      { id: "quiz-2", kind: "quiz", eyebrow: "Quiz 2", title: "Pressure check", objective: "Choose the most supportive next step when the first call feels delicate." },
      { id: "scenario-2", kind: "scenario", eyebrow: "Scenario 2", title: "Respond to hesitation", objective: "Handle reluctance without pushing the participant." },
      { id: "quiz-3", kind: "quiz", eyebrow: "Quiz 3", title: "Close-the-call choice", objective: "Pick the cleanest low-pressure close before the final practice round." },
      { id: "scenario-3", kind: "scenario", eyebrow: "Scenario 3", title: "Close with confidence", objective: "End the call with a clear, realistic, participant-centered next step." },
    ],
  },
  {
    id: "hesitant",
    stageLabel: "Stage 2",
    name: "Hesitant Participants",
    difficulty: "Core",
    description: "Build confidence with people who feel unsure, anxious, or unconvinced.",
    accent: "#D88A4B",
    surface: "linear-gradient(145deg, #FFF4EA 0%, #FFFFFF 46%, #F9E4D0 100%)",
    prompts: [
      "Participants say maybe but never commit to attending.",
      "I do not know how to respond when someone sounds anxious about joining a group.",
      "I want to be encouraging without sounding pushy.",
    ],
    outcomes: ["Validate concern", "Reduce pressure", "Offer gentler entry points"],
    journey: [
      { id: "quiz-1", kind: "quiz", eyebrow: "Quiz 1", title: "Trust test", objective: "Spot which opening response protects trust instead of adding pressure." },
      { id: "scenario-1", kind: "scenario", eyebrow: "Scenario 1", title: "Uncertain interest", objective: "Respond to someone who is curious but reluctant to attend." },
      { id: "quiz-2", kind: "quiz", eyebrow: "Quiz 2", title: "Supportive language", objective: "Pick the phrasing that feels calm, warm, and non-pushy." },
      { id: "scenario-2", kind: "scenario", eyebrow: "Scenario 2", title: "Anxiety in the moment", objective: "Support a participant who becomes visibly unsure or overwhelmed." },
      { id: "quiz-3", kind: "quiz", eyebrow: "Quiz 3", title: "Re-engagement choice", objective: "Choose the gentlest way to invite someone back after hesitation." },
      { id: "scenario-3", kind: "scenario", eyebrow: "Scenario 3", title: "Re-engagement", objective: "Invite someone back after an earlier hesitation or no-show." },
    ],
  },
  {
    id: "barriers",
    stageLabel: "Stage 3",
    name: "Overcoming Barriers",
    difficulty: "Core",
    description: "Work through transportation, affordability, language, technology, and access barriers.",
    accent: "#C05656",
    surface: "linear-gradient(145deg, #FFF1F1 0%, #FFFFFF 46%, #F8DEDE 100%)",
    prompts: [
      "I am not sure how to problem-solve transportation barriers in a practical way.",
      "Participants mention cost or language concerns and I freeze.",
      "I struggle to turn vague barriers into clear options.",
    ],
    outcomes: ["Name the barrier", "Offer realistic supports", "Co-create a next move"],
    journey: [
      { id: "quiz-1", kind: "quiz", eyebrow: "Quiz 1", title: "Barrier mapping", objective: "Choose the response that turns a vague issue into something workable." },
      { id: "scenario-1", kind: "scenario", eyebrow: "Scenario 1", title: "Surface the barrier", objective: "Figure out what is really stopping participation." },
      { id: "quiz-2", kind: "quiz", eyebrow: "Quiz 2", title: "Support strategy", objective: "Pick the best practical support before the next live scenario." },
      { id: "scenario-2", kind: "scenario", eyebrow: "Scenario 2", title: "Offer tailored supports", objective: "Recommend a realistic support plan that matches the barrier." },
      { id: "quiz-3", kind: "quiz", eyebrow: "Quiz 3", title: "Co-creation check", objective: "Choose the option that solves the barrier with the participant, not for them." },
      { id: "scenario-3", kind: "scenario", eyebrow: "Scenario 3", title: "Keep momentum", objective: "Maintain engagement after the first barrier conversation." },
    ],
  },
  {
    id: "follow-up",
    stageLabel: "Stage 4",
    name: "Follow-Up Conversations",
    difficulty: "Core",
    description: "Handle check-ins, setbacks, and meaningful progress conversations over time.",
    accent: "#285E61",
    surface: "linear-gradient(145deg, #EDF5F5 0%, #FFFFFF 46%, #DDEAEA 100%)",
    prompts: [
      "My follow-ups feel generic and I am not sure what to ask.",
      "I find it hard to talk about progress when someone did not engage as planned.",
      "I want my 3-, 6-, and 12-month check-ins to feel more useful.",
    ],
    outcomes: ["Ask reflective questions", "Spot changes over time", "Keep support plans realistic"],
    journey: [
      { id: "quiz-1", kind: "quiz", eyebrow: "Quiz 1", title: "Signal check", objective: "Identify the strongest clue that tells you whether progress or risk is changing." },
      { id: "scenario-1", kind: "scenario", eyebrow: "Scenario 1", title: "Meaningful check-in", objective: "Run a follow-up that surfaces what changed since last contact." },
      { id: "quiz-2", kind: "quiz", eyebrow: "Quiz 2", title: "Follow-up framing", objective: "Pick the question style that opens reflection instead of yes-or-no answers." },
      { id: "scenario-2", kind: "scenario", eyebrow: "Scenario 2", title: "When things stalled", objective: "Handle a follow-up where the plan did not move forward." },
      { id: "quiz-3", kind: "quiz", eyebrow: "Quiz 3", title: "Next-step clarity", objective: "Choose the cleanest way to set up the next follow-up action." },
      { id: "scenario-3", kind: "scenario", eyebrow: "Scenario 3", title: "Rebuild momentum", objective: "Create a next-step plan after a difficult or flat check-in." },
    ],
  },
  {
    id: "outreach",
    stageLabel: "Stage 5",
    name: "Outreach to Healthcare Providers",
    difficulty: "Advanced",
    description: "Explain the SALC value clearly when speaking with health teams and referral partners.",
    accent: "#8B5E3C",
    surface: "linear-gradient(145deg, #F8F0E8 0%, #FFFFFF 46%, #F1E1D2 100%)",
    prompts: [
      "I do not know how to explain our value quickly to doctors or clinical staff.",
      "I want to sound more confident when asking for referrals.",
      "I struggle to tailor outreach language for busy healthcare partners.",
    ],
    outcomes: ["Explain the offer crisply", "Match the audience", "Ask for concrete referral behavior"],
    journey: [
      { id: "quiz-1", kind: "quiz", eyebrow: "Quiz 1", title: "Referral readiness", objective: "Choose the message most likely to earn attention from a busy healthcare partner." },
      { id: "scenario-1", kind: "scenario", eyebrow: "Scenario 1", title: "Elevator pitch", objective: "Introduce L2W clearly to a busy healthcare partner." },
      { id: "quiz-2", kind: "quiz", eyebrow: "Quiz 2", title: "Audience fit", objective: "Pick the explanation that best matches what a clinical audience needs to hear." },
      { id: "scenario-2", kind: "scenario", eyebrow: "Scenario 2", title: "Clarify fit", objective: "Answer questions about who benefits and how referrals work." },
      { id: "quiz-3", kind: "quiz", eyebrow: "Quiz 3", title: "Next-step ask", objective: "Choose the outreach close that creates a concrete referral behavior." },
      { id: "scenario-3", kind: "scenario", eyebrow: "Scenario 3", title: "Secure the next step", objective: "Close the outreach conversation with a clear referral pathway." },
    ],
  },
  {
    id: "reporting",
    stageLabel: "Stage 6",
    name: "Reporting Questions",
    difficulty: "Foundation",
    description: "Build confidence with documentation, field logic, and what details matter most.",
    accent: "#5B7C5A",
    surface: "linear-gradient(145deg, #F0F7EE 0%, #FFFFFF 46%, #E2F0DE 100%)",
    prompts: [
      "I second-guess which reporting fields matter most.",
      "I am not sure how much detail to document after a call.",
      "I want to understand how reporting connects to the actual workflow.",
    ],
    outcomes: ["Capture the right details", "Connect reporting to workflow", "Avoid vague documentation"],
    journey: [
      { id: "quiz-1", kind: "quiz", eyebrow: "Quiz 1", title: "Field selection", objective: "Choose which detail belongs in the report and why." },
      { id: "scenario-1", kind: "scenario", eyebrow: "Scenario 1", title: "Document the interaction", objective: "Translate a real interaction into useful documentation choices." },
      { id: "quiz-2", kind: "quiz", eyebrow: "Quiz 2", title: "Clarity check", objective: "Pick the note that is specific enough to be useful later." },
      { id: "scenario-2", kind: "scenario", eyebrow: "Scenario 2", title: "Resolve ambiguity", objective: "Handle a reporting situation with missing or conflicting details." },
      { id: "quiz-3", kind: "quiz", eyebrow: "Quiz 3", title: "Workflow link", objective: "Choose the reporting move that best supports the wider L2W workflow." },
      { id: "scenario-3", kind: "scenario", eyebrow: "Scenario 3", title: "Report with clarity", objective: "Finish with concise, useful, practice-aligned reporting language." },
    ],
  },
];

function formatPercent(stage: StageConfig, progress?: StageProgress) {
  if (!progress) return 0;
  return Math.round((progress.completedStepIds.length / stage.journey.length) * 100);
}

function countSteps(stage: StageConfig, kind: StepKind) {
  return stage.journey.filter((step) => step.kind === kind).length;
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function isQuizContent(content: StepState["content"]): content is QuizContent {
  return Boolean(content && "question" in content);
}

function isScenarioContent(content: StepState["content"]): content is ScenarioContent {
  return Boolean(content && "scenario" in content);
}

function StepBadge({
  label,
  tone,
}: {
  label: string;
  tone: string;
}) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={{ backgroundColor: `${tone}15`, color: tone }}
    >
      {label}
    </span>
  );
}

function AIStarsMark({
  className,
  tone = "currentColor",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg
      viewBox="-5 -10 110 110"
      aria-hidden="true"
      className={className}
      fill={tone}
    >
      <path d="m59.5 46s-0.30078-2.8281-1.4883-4.0117c-1.1914-1.1797-4.0117-1.4883-4.0117-1.4883s2.8281-0.30078 4.0117-1.4883c1.1797-1.1914 1.4883-4.0117 1.4883-4.0117s0.30078 2.8281 1.4883 4.0117c1.1797 1.1797 4.0117 1.4883 4.0117 1.4883s-2.8281 0.30078-4.0117 1.4883c-1.1797 1.1797-1.4883 4.0117-1.4883 4.0117zm-13.25-3.5s-0.62109 5.7891-3.0391 8.2109c-2.4219 2.4219-8.2109 3.0391-8.2109 3.0391s5.7891 0.62109 8.2109 3.0391c2.4219 2.4219 3.0391 8.2109 3.0391 8.2109s0.62109-5.7891 3.0391-8.2109c2.4219-2.4219 8.2109-3.0391 8.2109-3.0391s-5.7891-0.62109-8.2109-3.0391c-2.4219-2.4219-3.0391-8.2109-3.0391-8.2109zm14.5 17.5c-0.69141 0-1.25 0.55859-1.25 1.25s0.55859 1.25 1.25 1.25 1.25-0.55859 1.25-1.25-0.55859-1.25-1.25-1.25zm-22-19c0.69141 0 1.25-0.55859 1.25-1.25s-0.55859-1.25-1.25-1.25-1.25 0.55859-1.25 1.25 0.55859 1.25 1.25 1.25z" />
    </svg>
  );
}

export default function AIScenariosPage({ goHome }: { goHome: () => void }) {
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [progressByStage, setProgressByStage] = useState<ProgressMap>({});
  const [draftChallenges, setDraftChallenges] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isBuildingPlan, setIsBuildingPlan] = useState(false);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [isSubmittingScenario, setIsSubmittingScenario] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProgressByStage(JSON.parse(raw) as ProgressMap);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progressByStage));
  }, [progressByStage, hydrated]);

  useEffect(() => {
    if (!selectedStageId) return;
    setDraftChallenges(progressByStage[selectedStageId]?.challenges ?? "");
    setUiError(null);
    setStepError(null);
  }, [selectedStageId, progressByStage]);

  const selectedStage = STAGES.find((stage) => stage.id === selectedStageId) ?? null;
  const selectedProgress = selectedStage ? progressByStage[selectedStage.id] : undefined;
  const stageComplete = Boolean(selectedStage && selectedProgress && selectedProgress.currentStepIndex >= selectedStage.journey.length);
  const activeStep = selectedStage && selectedProgress && !stageComplete
    ? selectedStage.journey[selectedProgress.currentStepIndex]
    : null;
  const activeStepState = activeStep && selectedProgress ? selectedProgress.stepState[activeStep.id] ?? {} : undefined;
  const activeScenarioContent = activeStepState?.content && isScenarioContent(activeStepState.content) ? activeStepState.content : null;
  const activeQuizContent = activeStepState?.content && isQuizContent(activeStepState.content) ? activeStepState.content : null;
  const activeScenarioState = activeScenarioContent && activeStepState ? activeStepState : null;
  const activeQuizState = activeQuizContent && activeStepState ? activeStepState : null;
  const totalCompleted = Object.values(progressByStage).reduce((sum, stage) => sum + stage.completedStepIds.length, 0);
  const totalStarted = Object.keys(progressByStage).length;
  const selectedQuizCount = selectedStage ? countSteps(selectedStage, "quiz") : 0;
  const selectedScenarioCount = selectedStage ? countSteps(selectedStage, "scenario") : 0;
  const hasDraftChallenges = draftChallenges.trim().length > 0;

  function updateStageProgress(stageId: string, updater: (current: StageProgress | undefined) => StageProgress) {
    setProgressByStage((current) => {
      const next = updater(current[stageId]);
      return {
        ...current,
        [stageId]: {
          ...next,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  async function fetchJson(body: Record<string, unknown>) {
    const response = await fetch("/api/ai-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.error === "API key not configured") {
        setApiUnavailable(true);
      }
      throw new Error(data.error || "Request failed");
    }
    return data;
  }

  async function ensureStepContent(stage: StageConfig, progress: StageProgress, stepIndex: number) {
    const step = stage.journey[stepIndex];
    if (!step || progress.stepState[step.id]?.content) return;

    setIsLoadingStep(true);
    setStepError(null);

    try {
      const payload =
        step.kind === "scenario"
          ? {
              action: "generate",
              category: stage.name,
              stageLabel: stage.stageLabel,
              journeyStage: step.title,
              stepGoal: step.objective,
              focusAreas: progress.coachPlan?.focusAreas ?? [],
              challenges: progress.challenges,
              completedSteps: progress.completedStepIds.length,
            }
          : {
              action: "quiz",
              category: stage.name,
              stageLabel: stage.stageLabel,
              journeyStage: step.title,
              stepGoal: step.objective,
              focusAreas: progress.coachPlan?.focusAreas ?? [],
              challenges: progress.challenges,
              completedSteps: progress.completedStepIds.length,
            };

      const data = await fetchJson(payload);
      const content =
        step.kind === "scenario"
          ? ({ scenario: data.scenario } satisfies ScenarioContent)
          : ({
              question: data.quiz.question,
              options: data.quiz.options,
              correctOptionId: data.quiz.correctOptionId,
              explanation: data.quiz.explanation,
              whyOptions: data.quiz.whyOptions,
            } satisfies QuizContent);

      updateStageProgress(stage.id, (current) => {
        const base = current ?? progress;
        const currentStepState = base.stepState[step.id] ?? {};
        return {
          ...base,
          stepState: {
            ...base.stepState,
            [step.id]: {
              ...currentStepState,
              content,
            },
          },
        };
      });
    } catch {
      setStepError("Could not load this training step yet. Try again.");
    } finally {
      setIsLoadingStep(false);
    }
  }

  async function handleStartJourney() {
    if (!selectedStage) return;
    if (draftChallenges.trim().length < 20) {
      setUiError("Write a bit more detail so the training can adapt to your real blockers.");
      return;
    }

    setIsBuildingPlan(true);
    setUiError(null);
    setStepError(null);

    try {
      const data = await fetchJson({
        action: "plan",
        category: selectedStage.name,
        stageLabel: selectedStage.stageLabel,
        challenges: draftChallenges.trim(),
      });

      const nextProgress: StageProgress = {
        challenges: draftChallenges.trim(),
        coachPlan: data.plan,
        currentStepIndex: 0,
        completedStepIds: [],
        stepState: {},
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProgressByStage((current) => ({
        ...current,
        [selectedStage.id]: nextProgress,
      }));

      await ensureStepContent(selectedStage, nextProgress, 0);
    } catch {
      if (!apiUnavailable) {
        setUiError("The adaptive path could not be created just yet. Try again.");
      }
    } finally {
      setIsBuildingPlan(false);
    }
  }

  function updateScenarioResponse(value: string) {
    if (!selectedStage || !selectedProgress || !activeStep) return;
    updateStageProgress(selectedStage.id, (current) => {
      const base = current ?? selectedProgress;
      const prior = base.stepState[activeStep.id] ?? {};
      return {
        ...base,
        stepState: {
          ...base.stepState,
          [activeStep.id]: {
            ...prior,
            response: value,
          },
        },
      };
    });
  }

  async function handleSubmitScenario() {
    if (!selectedStage || !selectedProgress || !activeStep || !activeStepState?.response || !isScenarioContent(activeStepState.content)) {
      return;
    }
    if (activeStepState.response.trim().length < 25) {
      setStepError("Add a little more detail so the feedback can coach your response.");
      return;
    }

    setIsSubmittingScenario(true);
    setStepError(null);

    try {
      const data = await fetchJson({
        action: "feedback",
        category: selectedStage.name,
        stageLabel: selectedStage.stageLabel,
        journeyStage: activeStep.title,
        stepGoal: activeStep.objective,
        focusAreas: selectedProgress.coachPlan?.focusAreas ?? [],
        challenges: selectedProgress.challenges,
        scenario: activeStepState.content.scenario,
        response: activeStepState.response,
      });

      updateStageProgress(selectedStage.id, (current) => {
        if (!current) return selectedProgress;
        const prior = current.stepState[activeStep.id] ?? {};
        return {
          ...current,
          completedStepIds: unique([...current.completedStepIds, activeStep.id]),
          stepState: {
            ...current.stepState,
            [activeStep.id]: {
              ...prior,
              feedback: data.feedback as ScenarioFeedback,
              completed: true,
            },
          },
        };
      });
    } catch {
      if (!apiUnavailable) {
        setStepError("Feedback could not be generated for this response. Try again.");
      }
    } finally {
      setIsSubmittingScenario(false);
    }
  }

  async function moveToNextStep() {
    if (!selectedStage || !selectedProgress) return;

    const nextIndex = selectedProgress.currentStepIndex + 1;
    const nextProgress: StageProgress = {
      ...selectedProgress,
      currentStepIndex: nextIndex,
      updatedAt: new Date().toISOString(),
    };

    setProgressByStage((current) => ({
      ...current,
      [selectedStage.id]: nextProgress,
    }));

    if (nextIndex < selectedStage.journey.length) {
      await ensureStepContent(selectedStage, nextProgress, nextIndex);
    }
  }

  function chooseQuizOption(optionId: string) {
    if (!selectedStage || !selectedProgress || !activeStep || activeStepState?.quizSubmitted) return;
    updateStageProgress(selectedStage.id, (current) => {
      const base = current ?? selectedProgress;
      const prior = base.stepState[activeStep.id] ?? {};
      return {
        ...base,
        stepState: {
          ...base.stepState,
          [activeStep.id]: {
            ...prior,
            selectedOptionId: optionId,
          },
        },
      };
    });
  }

  function submitQuiz() {
    if (!selectedStage || !selectedProgress || !activeStep || !activeStepState?.selectedOptionId) return;
    updateStageProgress(selectedStage.id, (current) => {
      const base = current ?? selectedProgress;
      const prior = base.stepState[activeStep.id] ?? {};
      return {
        ...base,
        completedStepIds: unique([...base.completedStepIds, activeStep.id]),
        stepState: {
          ...base.stepState,
          [activeStep.id]: {
            ...prior,
            quizSubmitted: true,
            completed: true,
          },
        },
      };
    });
  }

  function restartStage() {
    if (!selectedStage) return;
    setProgressByStage((current) => {
      const next = { ...current };
      delete next[selectedStage.id];
      return next;
    });
    setDraftChallenges("");
    setUiError(null);
    setStepError(null);
  }

  async function copyProgressSummary() {
    if (!selectedStage || !selectedProgress) return;

    const lines = [
      `${selectedStage.stageLabel}: ${selectedStage.name}`,
      "",
      "MY CHALLENGES:",
      selectedProgress.challenges,
      "",
      "FOCUS AREAS:",
      ...(selectedProgress.coachPlan?.focusAreas ?? []),
      "",
      `PROGRESS: ${selectedProgress.completedStepIds.length}/${selectedStage.journey.length}`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setShowCopied(true);
      window.setTimeout(() => setShowCopied(false), 1500);
    } catch {
      setShowCopied(false);
    }
  }

  if (apiUnavailable) {
    return (
      <div className="animate-fade-up">
        <button
          onClick={goHome}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-[#78716C] transition hover:bg-white hover:text-[#1C1917]"
        >
          <span aria-hidden="true">{"<"}</span>
          Home
        </button>
        <div className="rounded-[28px] border border-[#E7E5E4] bg-white px-8 py-16 text-center shadow-[0_20px_50px_-35px_rgba(28,25,23,0.4)]">
          <p className="text-sm text-[#78716C]">AI Scenarios is not available. Contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <button
        onClick={selectedStage ? () => setSelectedStageId(null) : goHome}
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-[#78716C] transition hover:bg-white hover:text-[#1C1917]"
      >
        <span aria-hidden="true">{"<"}</span>
        {selectedStage ? "All stages" : "Home"}
      </button>

      {!selectedStage && (
        <div className="space-y-8">
          <section className="relative overflow-hidden rounded-[36px] border border-[#F3EEE7] bg-[radial-gradient(circle_at_top_left,#fffdf8_0%,#f8fbfb_36%,#fff8f1_72%,#fbf5ee_100%)] px-5 py-6 shadow-[0_38px_90px_-50px_rgba(67,42,22,0.28)] sm:px-6 sm:py-7 lg:px-9 lg:py-8 xl:px-10 xl:py-9">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#2C7A7B]/12 blur-3xl" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#D88A4B]/12 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-[#C05656]/8 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,410px)] lg:items-center xl:gap-10">
              <div className="max-w-[620px]">
                <div className="flex flex-wrap items-center gap-3">
                  <StepBadge label="Adaptive practice studio" tone="#2C7A7B" />
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/82 px-4 py-2 shadow-[0_18px_40px_-30px_rgba(44,122,123,0.3)]">
                    <AIStarsMark className="h-5 w-5" tone="#1E6D6D" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A6D62]">
                      AI-personalized training
                    </p>
                  </div>
                </div>
                <h1 className="mt-5 max-w-[16ch] text-[22px] font-medium tracking-tight text-[#1C1917] md:text-2xl">
                  Practice the exact stage you are stuck in.
                </h1>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[#57534E]">
                  Pick the stage you are in, tell the AI what keeps going wrong, and get a premium training run built around the exact conversation you need to rehearse.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-[#6B6057]">
                  <span className="font-medium text-[#1C1917]">{totalStarted} stages started</span>
                  <span className="h-1 w-1 rounded-full bg-[#CFC6BD]" />
                  <span>{totalCompleted} completed moments</span>
                </div>
              </div>

              <div className="w-full rounded-[32px] border border-white/80 bg-[rgba(255,255,255,0.76)] p-5 backdrop-blur sm:p-6 lg:ml-auto lg:max-w-[410px]">
                <div className="flex items-start gap-3 sm:items-center">
                  <div className="rounded-full bg-[#1E6D6D]/10 p-3">
                    <AIStarsMark className="h-8 w-8" tone="#1E6D6D" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A8998E]">AI training flow</p>
                    <p className="mt-1 text-sm leading-6 text-[#57534E]">A cleaner way to explain what actually happens once someone opens this page.</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    { step: "01", title: "Choose your stage", body: "Start where the work feels hard right now, from first calls to reporting." },
                    { step: "02", title: "Tell AI what is blocking you", body: "The platform uses that blocker to shape the practice path around your real weak spots." },
                    { step: "03", title: "Work through the run", body: "Move through the guided training path and sharpen how you respond in that stage." },
                  ].map((item, index) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex w-9 shrink-0 flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white text-[11px] font-semibold text-[#6F655D]">
                          {item.step}
                        </div>
                        {index < 2 && <div className="mt-2 h-full w-px bg-[#E8E1D9]" />}
                      </div>
                      <div className="pt-1">
                        <p className="text-base font-medium tracking-tight text-[#1C1917]">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[#57534E]">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {STAGES.map((stage) => {
              const stageProgress = progressByStage[stage.id];
              const percent = formatPercent(stage, stageProgress);
              const started = Boolean(stageProgress);
              const quizCount = countSteps(stage, "quiz");
              const scenarioCount = countSteps(stage, "scenario");

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className="group relative overflow-hidden rounded-[30px] border border-white/80 p-[1px] text-left transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-36px_rgba(28,25,23,0.45)]"
                  style={{ background: stage.surface }}
                >
                  <span
                    className="absolute inset-x-8 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${stage.accent}80 50%, transparent 100%)` }}
                  />
                  <div className="h-full rounded-[29px] bg-white/82 px-6 py-6 backdrop-blur">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <StepBadge label={stage.stageLabel} tone={stage.accent} />
                        <h2 className="mt-4 text-[20px] font-medium tracking-tight text-[#1C1917] md:text-[22px]">{stage.name}</h2>
                      </div>
                      <div
                        className="rounded-full px-3 py-1 text-[11px] font-semibold"
                        style={{ backgroundColor: `${stage.accent}14`, color: stage.accent }}
                      >
                        {stage.difficulty}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[#57534E]">{stage.description}</p>

                    <div className="mt-5 space-y-2">
                      {stage.outcomes.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-[#44403C]">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stage.accent }} />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-[#EFEAE5] pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">
                            {started ? "AI run in progress" : "AI-tailored after intake"}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#57534E]">
                            {started
                              ? `${stageProgress?.completedStepIds.length}/${stage.journey.length} steps complete.`
                              : `${quizCount} quiz reads and ${scenarioCount} live AI scenarios, shaped after the learner names their blocker.`}
                          </p>
                        </div>
                        {started && (
                          <div className="min-w-[84px] text-right">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Current run</p>
                            <p className="mt-1 text-base font-semibold text-[#1C1917]">{percent}%</p>
                          </div>
                        )}
                      </div>
                      {started && (
                        <div className="mt-3 h-1.5 rounded-full bg-[#F0EEEC]">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${percent}%`,
                              background: `linear-gradient(90deg, ${stage.accent} 0%, ${stage.accent}AA 100%)`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1C1917]">{started ? "Resume AI run" : "Start AI run"}</span>
                      <span className="text-xl text-[#A8998E] transition group-hover:translate-x-1">&gt;</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </section>
        </div>
      )}

      {selectedStage && (
        <div className={selectedProgress ? "flex flex-col gap-5 xl:min-h-[calc(100vh-7.5rem)]" : "space-y-5"}>
          {!selectedProgress && (
            <section
              className="relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-[#E8E2DC] bg-white shadow-[0_20px_55px_-42px_rgba(28,25,23,0.18)]"
              style={{
                backgroundImage: `radial-gradient(circle at top right, ${selectedStage.accent}10 0%, transparent 28%), linear-gradient(180deg, #FFFDFB 0%, #FFFFFF 100%)`,
              }}
            >
              <div className="absolute right-8 top-8 opacity-[0.08]">
                <AIStarsMark className="h-10 w-10" tone={selectedStage.accent} />
              </div>
              <div className="px-6 py-6 md:px-7 md:py-7">
                <div className="flex flex-col gap-5 border-b border-[#F0ECE7] pb-6 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-[660px]">
                    <StepBadge label={`${selectedStage.stageLabel} journey`} tone={selectedStage.accent} />
                    <h1 className="mt-4 text-[22px] font-medium tracking-tight text-[#1C1917] md:text-2xl">
                      {selectedStage.name}
                    </h1>
                    <p className="mt-3 text-[15px] leading-8 text-[#57534E]">{selectedStage.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={{ backgroundColor: `${selectedStage.accent}15`, color: selectedStage.accent }}
                    >
                      {selectedStage.difficulty}
                    </span>
                    <span className="rounded-full border border-[#EEE7DF] bg-[#FCFAF7] px-3 py-1 text-[12px] font-medium text-[#57534E]">
                      {selectedStage.journey.length} AI-guided moments
                    </span>
                    <span className="rounded-full border border-[#EEE7DF] bg-[#FCFAF7] px-3 py-1 text-[12px] font-medium text-[#57534E]">
                      Tailored after intake
                    </span>
                  </div>
                </div>

                <div className={`pt-6 ${hasDraftChallenges ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
                  <div>
                    <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EFEAE5] bg-[#FAF8F5]">
                      <AIStarsMark className="h-5 w-5" tone={selectedStage.accent} />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Training intake</p>
                        <p className="mt-1 text-sm leading-6 text-[#6A6058]">
                          Describe what is breaking down in this stage. The sharper the note, the better the training run feels.
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={draftChallenges}
                      onChange={(event) => setDraftChallenges(event.target.value)}
                      placeholder="Example: People often say transportation is hard, but I am not sure how to surface the real blocker, suggest realistic supports, and keep the conversation moving without sounding pushy."
                      rows={hasDraftChallenges ? 9 : 13}
                      className={`mt-6 w-full rounded-[28px] border border-[#E7E5E4] bg-[#FFFEFC] px-5 py-5 text-[15px] leading-8 text-[#1C1917] outline-none transition focus:border-transparent focus:shadow-[0_0_0_2px_rgba(44,122,123,0.14)] ${!hasDraftChallenges ? "min-h-[340px]" : "min-h-[260px]"}`}
                    />

                    <div className="mt-5 flex flex-wrap gap-2">
                      {selectedStage.prompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setDraftChallenges((current) => (current ? `${current} ${prompt}` : prompt))}
                          className="rounded-full border border-[#E7E5E4] bg-white px-3 py-1.5 text-[12px] text-[#57534E] transition hover:border-[#D6D3D1] hover:bg-[#FAF8F5]"
                        >
                          + {prompt}
                        </button>
                      ))}
                    </div>

                    {uiError && <p className="mt-4 text-sm text-[#B45309]">{uiError}</p>}

                    <div className="mt-6 flex flex-col gap-4 border-t border-[#F0ECE7] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">What happens next</p>
                        <p className="mt-2 text-sm leading-6 text-[#6A6058]">
                          {hasDraftChallenges
                            ? "AI is ready to turn this note into 3 warm-up cues and 3 live rehearsals."
                            : "Start with the real blocker. The adaptive preview appears after the learner begins typing."}
                        </p>
                      </div>

                      <button
                        onClick={handleStartJourney}
                        disabled={isBuildingPlan}
                        className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ backgroundColor: selectedStage.accent }}
                      >
                        {isBuildingPlan ? "Building your path..." : "Build my personalized path"}
                      </button>
                    </div>
                  </div>

                  {hasDraftChallenges && (
                    <aside className="space-y-3 border-t border-[#F0ECE7] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                      <div className="rounded-[24px] border border-[#ECE7E2] bg-[#FFFCF8] px-4 py-4">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#A8998E]">Your note</p>
                        <p className="mt-2 text-sm leading-7 text-[#1C1917]">{truncateText(draftChallenges, 180)}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-[22px] border border-[#ECE7E2] bg-white px-4 py-4">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-[#A8998E]">Warm-up cues</p>
                          <p className="mt-2 text-base font-medium tracking-tight text-[#1C1917]">{selectedQuizCount} quick decisions first</p>
                          <p className="mt-2 text-sm leading-6 text-[#57534E]">The run opens with short AI cues so the learner sharpens instinct before live practice.</p>
                        </div>

                        <div className="rounded-[22px] border border-[#ECE7E2] bg-white px-4 py-4">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-[#A8998E]">Live rehearsals</p>
                          <p className="mt-2 text-base font-medium tracking-tight text-[#1C1917]">{selectedScenarioCount} scenarios built from this blocker</p>
                          <p className="mt-2 text-sm leading-6 text-[#57534E]">The practice rounds will push on outcomes like {selectedStage.outcomes.slice(0, 2).join(" and ").toLowerCase()}.</p>
                        </div>

                        <div className="rounded-[22px] border border-[#ECE7E2] bg-white px-4 py-4">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-[#A8998E]">Memory</p>
                          <p className="mt-2 text-base font-medium tracking-tight text-[#1C1917]">Progress stays saved</p>
                          <p className="mt-2 text-sm leading-6 text-[#57534E]">The learner can leave and return later without losing the personalized run.</p>
                        </div>
                      </div>
                    </aside>
                  )}
                </div>
              </div>
            </section>
          )}

          {selectedProgress && (
            <section
              className="relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-[#E8E2DC] bg-white shadow-[0_20px_55px_-42px_rgba(28,25,23,0.18)]"
              style={{
                backgroundImage: `radial-gradient(circle at top right, ${selectedStage.accent}10 0%, transparent 30%), linear-gradient(180deg, #FFFDFB 0%, #FFFFFF 100%)`,
              }}
            >
              <div className="absolute right-8 top-8 opacity-[0.08]">
                <AIStarsMark className="h-10 w-10" tone={selectedStage.accent} />
              </div>
              <div className="px-6 py-6 md:px-7">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                  <div>
                    <StepBadge label={`${selectedStage.stageLabel} journey`} tone={selectedStage.accent} />
                    <h1 className="mt-4 text-[22px] font-medium tracking-tight text-[#1C1917] md:text-2xl">
                      {selectedStage.name}
                    </h1>
                    <p className="mt-3 max-w-[56ch] text-[15px] leading-8 text-[#57534E]">{selectedStage.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-semibold"
                        style={{ backgroundColor: `${selectedStage.accent}15`, color: selectedStage.accent }}
                      >
                        {selectedStage.difficulty}
                      </span>
                      <span className="rounded-full border border-[#EEE7DF] bg-[#FCFAF7] px-3 py-1 text-[12px] font-medium text-[#57534E]">
                        {selectedStage.journey.length} AI-guided moments
                      </span>
                      <span className="rounded-full border border-[#EEE7DF] bg-[#FCFAF7] px-3 py-1 text-[12px] font-medium text-[#57534E]">
                        {selectedProgress.completedStepIds.length}/{selectedStage.journey.length} complete
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-[#ECE7E2] bg-[#FFFCF8] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EFEAE5] bg-white">
                          <AIStarsMark className="h-5 w-5" tone={selectedStage.accent} />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Run brief</p>
                          <p className="mt-2 text-sm leading-7 text-[#1C1917]">
                            {selectedProgress?.coachPlan?.coachNote
                              ? truncateText(selectedProgress.coachPlan.coachNote, 190)
                              : "AI keeps this run anchored to the blocker the learner wrote at the start."}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={copyProgressSummary}
                        className="text-[11px] font-medium text-[#78716C] transition hover:text-[#1C1917]"
                      >
                        {showCopied ? "Copied" : "Copy summary"}
                      </button>
                    </div>

                    <div className="mt-4 border-t border-[#EEE7DF] pt-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#A8998E]">Your blocker</p>
                      <p className="mt-2 text-sm leading-7 text-[#1C1917]">{truncateText(selectedProgress.challenges, 190)}</p>
                    </div>

                    {selectedProgress.coachPlan && (
                      <>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {selectedProgress.coachPlan.focusAreas.map((area) => (
                            <span
                              key={area}
                              className="rounded-full px-3 py-1 text-[12px] font-medium"
                              style={{ backgroundColor: `${selectedStage.accent}12`, color: selectedStage.accent }}
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                        <p className="mt-4 text-sm leading-6 text-[#6A6058]">
                          {truncateText(selectedProgress.coachPlan.successSignal, 150)}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-[#F0ECE7] pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Training flow</p>
                      <p className="mt-2 text-sm text-[#6A6058]">Follow the run from left to right. The current moment stays highlighted.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#A8998E]">Progress</p>
                      <p className="mt-1 text-base font-semibold text-[#1C1917]">{formatPercent(selectedStage, selectedProgress)}%</p>
                    </div>
                  </div>

                  <div className="mt-4 h-1.5 rounded-full bg-[#F0EEEC]">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${formatPercent(selectedStage, selectedProgress)}%`,
                        background: `linear-gradient(90deg, ${selectedStage.accent} 0%, ${selectedStage.accent}AA 100%)`,
                      }}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {selectedStage.journey.map((step, index) => {
                      const stepState = selectedProgress.stepState[step.id];
                      const done = selectedProgress.completedStepIds.includes(step.id);
                      const current = index === selectedProgress.currentStepIndex && !stageComplete;
                      const statusLabel = done ? "Completed" : current ? "Now" : "Next";

                      return (
                        <div
                          key={step.id}
                          className="min-h-[126px] rounded-[20px] border px-4 py-4"
                          style={{
                            borderColor: current ? `${selectedStage.accent}55` : "#ECE7E2",
                            backgroundColor: current ? "#FFFCF8" : done ? "#FBFCFA" : "#FFFEFD",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold"
                              style={{
                                backgroundColor: done ? selectedStage.accent : current ? `${selectedStage.accent}18` : "#F5F5F4",
                                color: done ? "white" : current ? selectedStage.accent : "#78716C",
                              }}
                            >
                              {done ? (
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 16 16"
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                >
                                  <path
                                    d="M3.5 8.25 6.5 11.25 12.5 5.25"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : index + 1}
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#A8998E]">
                              {step.kind === "quiz" ? "Cue" : "Scenario"}
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-medium leading-5 tracking-tight text-[#1C1917]">{step.title}</p>
                          <p className="mt-2 text-[12px] font-medium" style={{ color: current || done ? selectedStage.accent : "#8B7E74" }}>
                            {stepState?.completed ? "Completed" : statusLabel}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {selectedProgress && (
            <>
            <section className="mx-auto grid w-full max-w-[1180px] gap-5 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1.2fr)_360px]">
              <div className={stageComplete ? "space-y-6" : "space-y-5 xl:flex xl:min-h-0 xl:flex-col"}>
                {stageComplete && (
                  <div className="rounded-[28px] border border-[#ECE7E2] bg-white px-6 py-7 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.18)]">
                    <StepBadge label="Stage complete" tone={selectedStage.accent} />
                    <h2 className="mt-4 text-[20px] font-medium tracking-tight text-[#1C1917] md:text-[22px]">This personalized track is done.</h2>
                    <p className="mt-3 max-w-[58ch] text-sm leading-7 text-[#57534E]">
                      You have moved through every quiz and live scenario in this stage. You can restart with new blockers, or jump into another stage next.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={restartStage}
                        className="rounded-2xl px-5 py-3 text-sm font-semibold text-white"
                        style={{ backgroundColor: selectedStage.accent }}
                      >
                        Restart this stage
                      </button>
                      <button
                        onClick={() => setSelectedStageId(null)}
                        className="rounded-2xl border border-[#E7E5E4] bg-white px-5 py-3 text-sm font-semibold text-[#57534E]"
                      >
                        Choose another stage
                      </button>
                    </div>
                  </div>
                )}

                {!stageComplete && activeStep && (
                  <div
                    className="relative overflow-hidden rounded-[30px] border border-[#ECE7E2] bg-white px-5 py-5 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.18)] xl:flex xl:h-full xl:min-h-0 xl:flex-col"
                    style={{
                      backgroundImage: `radial-gradient(circle at top right, ${selectedStage.accent}08 0%, transparent 32%), linear-gradient(180deg, #FFFDFB 0%, #FFFFFF 100%)`,
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EEE7DF] pb-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full border border-[#EFEAE5] bg-[#FAF8F5] p-2.5">
                          <AIStarsMark className="h-4 w-4" tone={selectedStage.accent} />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Practice studio</p>
                          <div className="mt-2">
                            <StepBadge label={activeStep.eyebrow} tone={selectedStage.accent} />
                          </div>
                          <h2 className="mt-3 text-[20px] font-medium tracking-tight text-[#1C1917] md:text-[22px]">{activeStep.title}</h2>
                          <p className="mt-2 max-w-[60ch] text-sm leading-6 text-[#57534E]">{activeStep.objective}</p>
                        </div>
                      </div>
                      <div className="min-w-[120px] text-right">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#A8998E]">Step</p>
                        <p className="mt-1 text-lg font-semibold text-[#1C1917]">
                          {selectedProgress.currentStepIndex + 1}/{selectedStage.journey.length}
                        </p>
                        <p className="mt-1 text-sm text-[#6B6057]">In run</p>
                      </div>
                    </div>

                    <div className="xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-1">
                    {isLoadingStep && (
                      <div className="mt-6 space-y-3">
                        {[100, 86, 70, 92, 64].map((width, index) => (
                          <div
                            key={width}
                            className="h-4 animate-pulse rounded-full"
                            style={{
                              width: `${width}%`,
                              backgroundColor: `${selectedStage.accent}12`,
                              animationDelay: `${index * 70}ms`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {!isLoadingStep && stepError && (
                      <div className="mt-6 rounded-2xl border border-[#F6E2C3] bg-[#FFF8ED] px-4 py-4">
                        <p className="text-sm text-[#92400E]">{stepError}</p>
                        <button
                          onClick={() => ensureStepContent(selectedStage, selectedProgress, selectedProgress.currentStepIndex)}
                          className="mt-2 text-sm font-semibold"
                          style={{ color: selectedStage.accent }}
                        >
                          Try again
                        </button>
                      </div>
                    )}

                    {!isLoadingStep && !stepError && activeScenarioContent && activeScenarioState && (
                      <div className="mt-6 space-y-5">
                        <div className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
                          <div className="rounded-[24px] border border-[#ECE7E2] bg-[#FFFCF8] px-5 py-5">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Scenario</p>
                            <p className="mt-4 text-[15px] leading-8 text-[#1C1917]">{activeScenarioContent.scenario}</p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Your response</p>
                            <textarea
                              value={activeScenarioState.response ?? ""}
                              onChange={(event) => updateScenarioResponse(event.target.value)}
                              readOnly={Boolean(activeScenarioState.feedback)}
                              rows={5}
                              placeholder="Type what you would say or do here..."
                              className="mt-3 w-full rounded-[24px] border border-[#E7E5E4] bg-[#FFFEFC] px-5 py-4 text-[15px] leading-7 text-[#1C1917] outline-none transition focus:border-transparent focus:shadow-[0_0_0_2px_rgba(44,122,123,0.14)] xl:h-[232px]"
                            />
                            {!activeScenarioState.feedback && (
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                <button
                                  onClick={handleSubmitScenario}
                                  disabled={isSubmittingScenario}
                                  className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                                  style={{ backgroundColor: selectedStage.accent }}
                                >
                                  {isSubmittingScenario ? "Analyzing response..." : "Get personalized feedback"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {activeScenarioState.feedback && (
                          <div className="space-y-4">
                            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                              <div className="rounded-[24px] border border-[#E3F0EC] bg-[#F4FBF8] px-5 py-5">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-[#2C7A7B]">What landed well</p>
                                <p className="mt-3 text-sm leading-7 text-[#1C1917]">{activeScenarioState.feedback.well}</p>
                              </div>
                              <div className="rounded-[24px] border border-[#F4E8D7] bg-[#FFF7ED] px-5 py-5">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-[#B45309]">What to sharpen</p>
                                <p className="mt-3 text-sm leading-7 text-[#1C1917]">{activeScenarioState.feedback.consider}</p>
                              </div>
                            </div>
                            <div className="rounded-[24px] border border-[#E7E5E4] bg-[#FAFAF9] px-5 py-5">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-[#57534E]">L2W best practice</p>
                              <p className="mt-3 text-sm leading-7 text-[#1C1917]">{activeScenarioState.feedback.bestPractice}</p>
                            </div>
                            <button
                              onClick={moveToNextStep}
                              className="rounded-2xl px-5 py-3 text-sm font-semibold text-white"
                              style={{ backgroundColor: selectedStage.accent }}
                            >
                              Continue to next step
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {!isLoadingStep && !stepError && activeQuizContent && activeQuizState && (
                      <div className="mt-6 space-y-5">
                        <div className="rounded-[26px] border border-[#ECE7E2] bg-[#FFFCF8] px-5 py-5">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Checkpoint</p>
                          <p className="mt-4 text-base font-medium leading-7 tracking-tight text-[#1C1917]">{activeQuizContent.question}</p>
                        </div>

                        <div className="space-y-3">
                          {activeQuizContent.options.map((option) => {
                            const selected = activeQuizState.selectedOptionId === option.id;
                            const submitted = Boolean(activeQuizState.quizSubmitted);
                            const correct = activeQuizContent.correctOptionId === option.id;

                            let border = "#E7E5E4";
                            let background = "#FFFEFD";
                            let text = "#1C1917";

                            if (submitted && correct) {
                              border = "#9BD4C2";
                              background = "#F4FBF8";
                              text = "#14532D";
                            } else if (submitted && selected && !correct) {
                              border = "#F1C9A6";
                              background = "#FFF7ED";
                              text = "#9A3412";
                            } else if (selected) {
                              border = selectedStage.accent;
                              background = `${selectedStage.accent}0D`;
                            }

                            const optionNote = activeQuizContent.whyOptions?.[option.id];
                            const toneColor = submitted && correct
                              ? "#2C7A7B"
                              : submitted && selected && !correct
                                ? "#B45309"
                                : selected
                                  ? selectedStage.accent
                                  : "#78716C";

                            const stateLabel = submitted
                              ? correct
                                ? "Best move"
                                : selected
                                  ? "Your pick"
                                  : "Alternative"
                              : selected
                                ? "Selected option"
                                : "Option";

                            return (
                              <button
                                key={option.id}
                                onClick={() => chooseQuizOption(option.id)}
                                disabled={submitted}
                                className="block w-full rounded-[22px] border px-5 py-4 text-left transition disabled:cursor-default"
                                style={{ borderColor: border, backgroundColor: background, color: text }}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold"
                                      style={{
                                        backgroundColor: submitted || selected ? `${toneColor}14` : "#F5F5F4",
                                        color: toneColor,
                                      }}
                                    >
                                      {option.id}
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8998E]">Answer choice</p>
                                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: toneColor }}>
                                        {stateLabel}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <p className="text-base leading-8 text-[#1C1917]">{option.text}</p>
                                </div>

                                {submitted && optionNote && (
                                  <div className="mt-4 border-t border-[rgba(120,113,108,0.16)] pt-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8998E]">AI read on this choice</p>
                                    <p className="mt-2 text-sm leading-6 text-[#57534E]">{optionNote}</p>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {!activeQuizState.quizSubmitted && (
                          <button
                            onClick={submitQuiz}
                            disabled={!activeQuizState.selectedOptionId}
                            className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ backgroundColor: selectedStage.accent }}
                          >
                            Check answer
                          </button>
                        )}

                        {activeQuizState.quizSubmitted && (
                          <div className="space-y-4">
                            <div className="rounded-[24px] border border-[#E7E5E4] bg-[#FAFAF9] px-5 py-5">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-[#57534E]">Why this is the best move</p>
                              <p className="mt-3 text-sm leading-7 text-[#1C1917]">{activeQuizContent.explanation}</p>
                            </div>
                            <button
                              onClick={moveToNextStep}
                              className="rounded-2xl px-5 py-3 text-sm font-semibold text-white"
                              style={{ backgroundColor: selectedStage.accent }}
                            >
                              Continue to next step
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </div>

              <aside className="space-y-5 xl:h-full xl:self-stretch">
                <div
                  className="relative overflow-hidden rounded-[30px] border border-[#ECE7E2] bg-white px-5 py-5 shadow-[0_20px_50px_-42px_rgba(28,25,23,0.18)] xl:flex xl:h-full xl:flex-col"
                  style={{
                    backgroundImage: `radial-gradient(circle at top right, ${selectedStage.accent}08 0%, transparent 34%), linear-gradient(180deg, #FFFDFB 0%, #FFFFFF 100%)`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full border border-[#EFEAE5] bg-[#FAF8F5] p-3">
                      <AIStarsMark className="h-7 w-7" tone={selectedStage.accent} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Coach notes</p>
                      {selectedProgress.coachPlan ? (
                        <p className="mt-2 text-sm leading-7 text-[#1C1917]">{truncateText(selectedProgress.coachPlan.coachNote, 220)}</p>
                      ) : (
                        <p className="mt-2 text-sm leading-7 text-[#1C1917]">
                          AI keeps this stage anchored to the blocker you wrote and adjusts the training prompts as you move.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#EEE7DF] pt-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Blocker you wrote</p>
                    <p className="mt-3 text-sm leading-7 text-[#1C1917]">{truncateText(selectedProgress.challenges, 190)}</p>
                  </div>

                  {selectedProgress.coachPlan && (
                    <div className="mt-5 border-t border-[#EEE7DF] pt-4 xl:min-h-0 xl:flex-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#A8998E]">Focus areas</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedProgress.coachPlan.focusAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full px-3 py-1 text-[12px] font-medium"
                            style={{ backgroundColor: `${selectedStage.accent}12`, color: selectedStage.accent }}
                          >
                            {area}
                          </span>
                        ))}
                      </div>

                      <p className="mt-4 text-sm leading-6 text-[#6A6058]">{truncateText(selectedProgress.coachPlan.successSignal, 140)}</p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3 border-t border-[#EEE7DF] pt-4">
                    <button
                      onClick={restartStage}
                      className="rounded-2xl border border-[#E7E5E4] bg-white px-4 py-2.5 text-sm font-semibold text-[#57534E]"
                    >
                      Restart stage
                    </button>
                    <button
                      onClick={() => setSelectedStageId(null)}
                      className="rounded-2xl border border-[#E7E5E4] bg-white px-4 py-2.5 text-sm font-semibold text-[#57534E]"
                    >
                      Switch stage
                    </button>
                  </div>
                </div>
              </aside>
            </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
