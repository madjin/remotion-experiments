import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TitleProps {
  title: string;
  subtitle?: string;
}

export const Title: React.FC<TitleProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = title.split(" ");
  const subtitleWords = subtitle?.split(" ") || [];

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        textAlign: "center",
      }}
    >
      {/* Main title */}
      <div style={{ marginBottom: subtitle ? "2rem" : 0 }}>
        {words.map((word, i) => {
          const delay = i * 5;

          const opacity = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: { mass: 0.5, damping: 10 },
          });

          const y = spring({
            frame: frame - delay,
            fps,
            from: -50,
            to: 0,
            config: { mass: 0.5, damping: 10 },
          });

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity,
                color: "white",
                fontSize: "4rem",
                fontWeight: "bold",
                margin: "0 10px",
                transform: `translateY(${y}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div>
          {subtitleWords.map((word, i) => {
            const delay = i * 5 + words.length * 5;

            const opacity = spring({
              frame: frame - delay,
              fps,
              from: 0,
              to: 1,
              config: { mass: 0.5, damping: 10 },
            });

            const y = spring({
              frame: frame - delay,
              fps,
              from: 30,
              to: 0,
              config: { mass: 0.5, damping: 10 },
            });

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity,
                  color: "#8B949E",
                  fontSize: "2rem",
                  margin: "0 5px",
                  transform: `translateY(${y}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}; 