"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";

// ─── Welcome Modal (shown first) ─────────────────────────────────────────────

function WelcomeModal({ onTour, onSkip }: { onTour: () => void; onSkip: () => void }) {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.95);

  useEffect(() => {
    requestAnimationFrame(() => {
      setOpacity(1);
      setScale(1);
    });
  }, []);

  const features = [
    {
      title: "Organized resources",
      desc: "Guides, templates, and forms — all in one place, organized by topic.",
    },
    {
      title: "AI practice scenarios",
      desc: "Rehearse real-world situations with AI-powered feedback based on L2W best practices.",
    },
    {
      title: "Community discussion forum",
      desc: "Connect with other social prescribing staff, share insights, and ask questions in the community forum.",
    },
    {
      title: "Deadlines and tracking",
      desc: "Never miss a reporting deadline. Key dates and quick links are always visible.",
    },
    {
      title: "Search everything",
      desc: "Find any resource instantly — search across all guides, templates, forms, and tools.",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
          opacity,
          transition: "opacity 300ms ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            opacity,
            transform: `scale(${scale})`,
            transition: "opacity 300ms ease, transform 300ms ease",
          }}
          className="bg-white rounded-2xl shadow-[0_24px_64px_-16px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.08)] w-full max-w-[480px] overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header area with gradient */}
          <div className="bg-gradient-to-b from-[#E6F4F4] to-white px-5 sm:px-8 pt-6 sm:pt-8 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/80 border border-gray-200/60 flex items-center justify-center shrink-0 shadow-sm">
                <img src="/l2w-logo.svg" alt="L2W" className="h-7 w-auto" />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[#2C7A7B] uppercase">Links2Wellbeing</p>
              </div>
            </div>
            <h2 className="text-[22px] font-semibold text-[#2C1810] leading-tight">
              Welcome to the Knowledge Hub
            </h2>
            <p className="text-[14px] text-[#6B5B4E] mt-2 leading-[1.6]">
              Your central hub for social prescribing workflows, community resources, and reporting — everything you need as social prescribing staff.
            </p>
          </div>

          {/* Features list */}
          <div className="px-5 sm:px-8 py-4 sm:py-5">
            <div className="space-y-4">
              {features.map((f, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#F5F0EB] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-[#C96A2B]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#2C1810] mb-0.5">{f.title}</p>
                    <p className="text-[13px] text-[#78716C] leading-[1.5]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 sm:px-8 pb-6 sm:pb-7 pt-2 flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-[14px] text-[#78716C] hover:text-[#2C1810] transition-colors duration-150 font-medium"
            >
              Skip
            </button>
            <Button
              onClick={onTour}
              className="bg-[#C96A2B] hover:bg-[#B55D23] text-white rounded-xl px-6 h-10 text-[14px] font-medium shadow-[0_2px_8px_-2px_rgba(201,106,43,0.3)] hover:shadow-[0_4px_12px_-2px_rgba(201,106,43,0.4)] transition-all duration-200"
            >
              Take a tour
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Spotlight Tour (shown after welcome modal) ──────────────────────────────

const ALL_STEPS = [
  {
    target: "step-2",
    title: "Quick access cards",
    text: "These cards give you fast access to the most important features — getting started guides and AI-powered practice scenarios.",
    position: "below" as const,
    desktopOnly: false,
  },
  {
    target: "step-3",
    title: "Browse all topics",
    text: "All your resources are organized by topic. Expand any section to see subcategories and find exactly what you need.",
    position: "right" as const,
    desktopOnly: true,
  },
  {
    target: "step-4",
    title: "Search anything",
    text: "Can\u2019t find something? Type a keyword to search across all resources, templates, forms, and guides.",
    position: "below" as const,
    desktopOnly: false,
  },
  {
    target: "step-5",
    title: "Deadlines and quick links",
    text: "Keep track of upcoming reporting deadlines and access frequently used links — all in one place.",
    position: "left" as const,
    desktopOnly: true,
  },
];

interface SpotRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function SpotlightTour({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotRect, setSpotRect] = useState<SpotRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [tooltipOpacity, setTooltipOpacity] = useState(0);
  const prevElementRef = useRef<HTMLElement | null>(null);

  // Filter steps based on screen width — skip sidebar/right panel on mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const TUTORIAL_STEPS = useMemo(
    () => ALL_STEPS.filter((s) => !isMobile || !s.desktopOnly),
    [isMobile]
  );

  const PAD = 8;

  const calculatePositions = useCallback(() => {
    const step = TUTORIAL_STEPS[currentStep];
    if (!step) return;
    const el = document.querySelector(`[data-tutorial="${step.target}"]`) as HTMLElement | null;
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

    setTimeout(() => {
      // Re-query rect after scroll settles
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const spot: SpotRect = {
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
      };
      setSpotRect(spot);

      // Responsive tooltip width
      const tooltipW = Math.min(320, vw - 32);
      const tooltipH = 180;
      const gap = 16;
      const vh = window.innerHeight;
      let top = 0;
      let left = 0;

      // Smart positioning: check available space in each direction
      const spaceBelow = vh - (spot.top + spot.height);
      const spaceAbove = spot.top;
      const spaceRight = vw - (spot.left + spot.width);
      const spaceLeft = spot.left;

      if (vw < 768) {
        // Mobile: prefer below, fallback above, fallback overlay on bottom
        left = (vw - tooltipW) / 2;
        if (spaceBelow >= tooltipH + gap) {
          top = spot.top + spot.height + gap;
        } else if (spaceAbove >= tooltipH + gap) {
          top = spot.top - tooltipH - gap;
        } else {
          // Not enough space either way — place at bottom of viewport
          top = vh - tooltipH - 16;
        }
      } else {
        // Desktop: use preferred position, but fallback smartly
        const preferred = step.position;
        let placed = false;

        const placeBelow = () => {
          top = spot.top + spot.height + gap;
          left = spot.left + spot.width / 2 - tooltipW / 2;
        };
        const placeAbove = () => {
          top = spot.top - tooltipH - gap;
          left = spot.left + spot.width / 2 - tooltipW / 2;
        };
        const placeRight = () => {
          top = spot.top + spot.height / 2 - tooltipH / 2;
          left = spot.left + spot.width + gap;
        };
        const placeLeft = () => {
          top = spot.top + spot.height / 2 - tooltipH / 2;
          left = spot.left - tooltipW - gap;
        };

        // Try preferred position first
        if (preferred === "below" && spaceBelow >= tooltipH + gap) {
          placeBelow(); placed = true;
        } else if (preferred === "right" && spaceRight >= tooltipW + gap) {
          placeRight(); placed = true;
        } else if (preferred === "left" && spaceLeft >= tooltipW + gap) {
          placeLeft(); placed = true;
        }

        // Fallback: try all directions
        if (!placed) {
          if (spaceBelow >= tooltipH + gap) {
            placeBelow();
          } else if (spaceAbove >= tooltipH + gap) {
            placeAbove();
          } else if (spaceRight >= tooltipW + gap) {
            placeRight();
          } else if (spaceLeft >= tooltipW + gap) {
            placeLeft();
          } else {
            // Last resort: overlay at bottom-right of viewport
            top = vh - tooltipH - 24;
            left = vw - tooltipW - 24;
          }
        }
      }

      left = Math.max(16, Math.min(left, vw - tooltipW - 16));
      top = Math.max(16, Math.min(top, vh - tooltipH - 16));

      setTooltipStyle({
        position: "fixed",
        top,
        left,
        width: tooltipW,
        zIndex: 10000,
        transition: "top 400ms ease-in-out, left 400ms ease-in-out, width 400ms ease-in-out, opacity 200ms ease",
      });

      if (prevElementRef.current && prevElementRef.current !== el) {
        prevElementRef.current.style.zIndex = "";
      }
      el.style.zIndex = "9999";
      prevElementRef.current = el;

      setTooltipOpacity(1);
    }, 150);
  }, [currentStep, TUTORIAL_STEPS]);

  useEffect(() => {
    requestAnimationFrame(() => setOverlayOpacity(1));
  }, []);

  useEffect(() => {
    setTooltipOpacity(0);
    const timer = setTimeout(calculatePositions, 50);
    const handleResize = () => calculatePositions();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculatePositions]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    if (prevElementRef.current) {
      prevElementRef.current.style.zIndex = "";
    }
    ALL_STEPS.forEach((step) => {
      const el = document.querySelector(`[data-tutorial="${step.target}"]`) as HTMLElement | null;
      if (el) {
        el.style.zIndex = "";
      }
    });
    onClose();
  };

  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;
  if (!step) { handleClose(); return null; }

  const overlayStyle: React.CSSProperties = spotRect
    ? {
        position: "fixed",
        top: spotRect.top,
        left: spotRect.left,
        width: spotRect.width,
        height: spotRect.height,
        borderRadius: 12,
        boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.55)`,
        zIndex: 9998,
        pointerEvents: "none",
        transition: "top 400ms ease-in-out, left 400ms ease-in-out, width 400ms ease-in-out, height 400ms ease-in-out, opacity 300ms ease",
        opacity: overlayOpacity,
      }
    : {
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.55)",
        zIndex: 9998,
        opacity: overlayOpacity,
        transition: "opacity 300ms ease",
      };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 9997 }} />
      <div style={overlayStyle} />

      {spotRect && (
        <div
          style={{
            position: "fixed",
            top: spotRect.top,
            left: spotRect.left,
            width: spotRect.width,
            height: spotRect.height,
            borderRadius: 12,
            border: "2px solid rgba(201, 106, 43, 0.35)",
            boxShadow: "0 0 20px 4px rgba(201, 106, 43, 0.08)",
            zIndex: 9999,
            pointerEvents: "none",
            transition: "top 400ms ease-in-out, left 400ms ease-in-out, width 400ms ease-in-out, height 400ms ease-in-out",
          }}
        />
      )}

      <div
        style={{ ...tooltipStyle, opacity: tooltipOpacity, position: "fixed" }}
        className="bg-white rounded-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18),0_2px_8px_-2px_rgba(0,0,0,0.06)] relative"
      >
        <div className="p-5">
          <button
            onClick={handleClose}
            className="absolute top-3 right-4 text-[14px] text-[#A8A29E] hover:text-[#2C1810] transition-colors duration-150 leading-none"
          >
            &times;
          </button>

          <p className="text-[16px] font-semibold text-[#2C1810] mb-1.5">{step.title}</p>
          <p className="text-[14px] text-[#6B5B4E] leading-[1.6] mb-5">{step.text}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {TUTORIAL_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    i === currentStep
                      ? "bg-[#C96A2B]"
                      : i < currentStep
                      ? "bg-[#C96A2B]/40"
                      : "border border-gray-300 bg-transparent"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={handleNext}
              className="bg-[#C96A2B] hover:bg-[#B55D23] text-white rounded-lg px-5 h-9 text-[13px] font-medium shadow-sm transition-all duration-200"
            >
              {isLast ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main export: Welcome modal → Spotlight tour ─────────────────────────────

export default function SpotlightTutorial({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"welcome" | "tour">("welcome");

  if (phase === "welcome") {
    return (
      <WelcomeModal
        onTour={() => setPhase("tour")}
        onSkip={onClose}
      />
    );
  }

  return <SpotlightTour onClose={onClose} />;
}
