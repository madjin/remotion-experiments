import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface Contribution {
  type: string;
  count: number;
}

interface Contributor {
  username: string;
  avatarUrl: string;
  contributions: Contribution[];
  totalScore: number;
}

interface TopContributorsProps {
  contributors: Contributor[];
  title: string;
}

export const TopContributors: React.FC<TopContributorsProps> = ({
  contributors,
  title,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Sort contributors by total score
  const sortedContributors = [...contributors]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3);

  // Animation springs
  const titleOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  // Podium heights
  const podiumHeights = {
    first: 200,
    second: 150,
    third: 100,
  };

  // Medal colors
  const medalColors = {
    first: "#FFD700",    // Gold
    second: "#C0C0C0",   // Silver
    third: "#CD7F32",    // Bronze
  };

  // Calculate positions for rule of thirds
  const thirds = width / 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
        color: "white",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>{title}</h1>
        <h2 style={{ fontSize: "1.8rem", color: "#58A6FF", marginTop: "0.5rem" }}>
          Top Contributors
        </h2>
      </div>

      {/* Podium Container */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: 0,
          right: 0,
          height: "60%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        {sortedContributors.map((contributor, index) => {
          const position = index === 1 ? 0 : index === 0 ? 1 : 2;
          const delay = position * 10;
          
          const podiumProgress = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: { damping: 12 },
          });

          const contentOpacity = spring({
            frame: frame - 30 - delay,
            fps,
            from: 0,
            to: 1,
            config: { damping: 10 },
          });

          const height = index === 0 ? podiumHeights.first :
                        index === 1 ? podiumHeights.second :
                        podiumHeights.third;

          const medalColor = index === 0 ? medalColors.first :
                           index === 1 ? medalColors.second :
                           medalColors.third;

          return (
            <div
              key={contributor.username}
              style={{
                position: "absolute",
                left: `${(position * thirds) + (thirds / 2) - 100}px`,
                bottom: 0,
                width: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Avatar and Medal */}
              <div
                style={{
                  position: "relative",
                  marginBottom: 20,
                  opacity: contentOpacity,
                }}
              >
                <img
                  src={contributor.avatarUrl}
                  alt={contributor.username}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: `4px solid ${medalColor}`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -10,
                    right: -10,
                    width: 30,
                    height: 30,
                    backgroundColor: medalColor,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#0D1117",
                  }}
                >
                  {index + 1}
                </div>
              </div>

              {/* Username */}
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginBottom: 10,
                  opacity: contentOpacity,
                }}
              >
                {contributor.username}
              </div>

              {/* Contributions */}
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#8B949E",
                  textAlign: "center",
                  opacity: contentOpacity,
                }}
              >
                {contributor.contributions.map((contribution) => (
                  <div key={contribution.type}>
                    {contribution.count} {contribution.type}
                  </div>
                ))}
                <div style={{ color: medalColor, marginTop: 5 }}>
                  {contributor.totalScore} points
                </div>
              </div>

              {/* Podium */}
              <div
                style={{
                  width: 120,
                  height: height * podiumProgress,
                  backgroundColor: "#30363D",
                  borderRadius: "8px 8px 0 0",
                  marginTop: 20,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    background: `linear-gradient(180deg, ${medalColor}20 0%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}; 