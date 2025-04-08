import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { GitHubSummaryData } from "../data/githubSummary";

interface ChangesProps {
  changes: GitHubSummaryData["changes"];
}

export const Changes: React.FC<ChangesProps> = ({ changes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allChanges = [
    ...changes.features.map(text => ({ text, type: "Feature", color: "#238636" })),
    ...changes.fixes.map(text => ({ text, type: "Fix", color: "#F85149" })),
    ...changes.chores.map(text => ({ text, type: "Chore", color: "#58A6FF" })),
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
      }}
    >
      {allChanges.map((change, i) => {
        const delay = i * 5;

        const slideX = spring({
          frame: frame - delay,
          fps,
          from: -100,
          to: 0,
          config: { mass: 0.5, damping: 12 },
        });

        const opacity = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.5, damping: 12 },
        });

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              transform: `translateX(${slideX}px)`,
              opacity,
            }}
          >
            <div
              style={{
                backgroundColor: change.color,
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "1.2rem",
                fontWeight: "500",
                minWidth: "100px",
                textAlign: "center",
              }}
            >
              {change.type}
            </div>
            <div
              style={{
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              {change.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 