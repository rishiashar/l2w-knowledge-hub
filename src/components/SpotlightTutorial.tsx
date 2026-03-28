"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

const TUTORIAL_STEPS = [
  {
    target: "step-1",
    title: "Your personalized hub",
    text: "The Knowledge Hub greets you by name and adapts to the time of day. This is your central starting point.",
    position: "below" as const,
  },
  {
    target: "step-2",
    title: "Quick access cards",
    text: "These cards give you fast access to the most important features — getting started guides and AI-powered practice scenarios.",
    position: "below" as const,
  },
  {
    target: "step-3",
    title: "Browse all topics",
    text: "All your resources are organized by topic. Expand any section to see subcategories and find exactly what you need.",
    position: "right" as const,
  },
  {
    target: "step-4",
    title: "Search anything",
    text: "Can\u2019t find something? Type a keyword to search across all resources, templates, guides, and workflows.",
    position: "below" as const,
  },
  {
    target: "step-5",
    title: "Deadlines and quick links",
    text: "Keep track of upcoming reporting deadlines and access frequently used links — all in one place.",
    position: "left" as const,
  },
  {
    target: "step-6",
    title: "Recommended for you",
    text: "Resources picked for you based on what\u2019s popular and recently updated. Bookmark anything to save it for later.",
    position: "above" as const,
  },
];

interface SpotRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function SpotlightTutorial({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotRect, setSpotRect] = useState<SpotRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [tooltipOpacity, setTooltipOpacity] = useState(0);
  const prevElementRef = useRef<HTMLElement | null>(null);

  const PAD = 8;

  const calculatePositions = useCallback(() => {
    const step = TUTORIAL_STEPS[currentStep];
    const el = document.querySelector(`[data-tutorial="${step.target}"]`) as HTMLElement | null;
    if (!el) return;

    // Scroll into view if needed
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

    // Wait for scroll to finish
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const spot: SpotRect = {
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
      };
      setSpotRect(spot);

      // Calculate tooltip position
      const tooltipW = 320;
      const tooltipH = 180;
      const gap = 16;
      let top = 0;
      let left = 0;

      switch (step.position) {
        case "below":
          top = spot.top + spot.height + gap;
          left = spot.left + spot.width / 2 - tooltipW / 2;
          break;
        case "above":
          top = spot.top - tooltipH - gap;
          left = spot.left + spot.width / 2 - tooltipW / 2;
          break;
        case "right":
          top = spot.top + spot.height / 2 - tooltipH / 2;
          left = spot.left + spot.width + gap;
          break;
        case "left":
          top = spot.top + spot.height / 2 - tooltipH / 2;
          left = spot.left - tooltipW - gap;
          break;
      }

      // Clamp to viewport
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipW - 16));
      top = Math.max(16, Math.min(top, window.innerHeight - tooltipH - 16));

      setTooltipStyle({
        position: "fixed",
        top,
        left,
        width: tooltipW,
        zIndex: 10000,
        transition: "top 400ms ease-in-out, left 400ms ease-in-out, opacity 200ms ease",
      });

      // Elevate element above overlay
      el.style.position = "relative";
      el.style.zIndex = "9999";

      // Reset previous element
      if (prevElementRef.current && prevElementRef.current !== el) {
        prevElementRef.current.style.zIndex = "";
        prevElementRef.current.style.position = "";
      }
      prevElementRef.current = el;

      setTooltipOpacity(1);
    }, 150);
  }, [currentStep]);

  // Fade in overlay on mount
  useEffect(() => {
    requestAnimationFrame(() => setOverlayOpacity(1));
  }, []);

  // Recalculate on step change and resize
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
    // Reset all z-indexes
    if (prevElementRef.current) {
      prevElementRef.current.style.zIndex = "";
      prevElementRef.current.style.position = "";
    }
    TUTORIAL_STEPS.forEach((step) => {
      const el = document.querySelector(`[data-tutorial="${step.target}"]`) as HTMLElement | null;
      if (el) {
        el.style.zIndex = "";
        el.style.position = "";
      }
    });
    onClose();
  };

  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  // Build the overlay mask — a large box-shadow that covers everything except the spotlight
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
      {/* Click-blocking overlay behind spotlight */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9997,
        }}
      />

      {/* Spotlight cutout with box-shadow overlay */}
      <div style={overlayStyle} />

      {/* Spotlight glow border */}
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

      {/* Tooltip card */}
      <div
        style={{ ...tooltipStyle, opacity: tooltipOpacity }}
        className="bg-white rounded-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18),0_2px_8px_-2px_rgba(0,0,0,0.06)]"
      >
        <div className="p-5">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-4 text-[14px] text-[#A8A29E] hover:text-[#2C1810] transition-colors duration-150 leading-none"
          >
            &times;
          </button>

          <p className="text-[16px] font-semibold text-[#2C1810] mb-1.5">{step.title}</p>
          <p className="text-[14px] text-[#6B5B4E] leading-[1.6] mb-5">{step.text}</p>

          {/* Bottom row: dots + button */}
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
