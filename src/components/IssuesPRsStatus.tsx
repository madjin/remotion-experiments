import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface StatusData {
  open: number;
  closed: number;
  total: number;
}

interface IssuesPRsStatusProps {
  issues: StatusData;
  pullRequests: StatusData;
  orgName: string;
}

export const IssuesPRsStatus: React.FC<IssuesPRsStatusProps> = ({
  issues,
  pullRequests,
  orgName,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Animation springs
  const titleOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  const barProgress = spring({
    frame: frame - 30,
    fps,
    from: 0,
    to: 1,
    config: { damping: 15 },
  });

  const statsOpacity = spring({
    frame: frame - 60,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  // Calculate bar widths
  const maxBarWidth = width * 0.6;
  const issuesOpenWidth = (issues.open / issues.total) * maxBarWidth * barProgress;
  const issuesClosedWidth = (issues.closed / issues.total) * maxBarWidth * barProgress;
  const prsOpenWidth = (pullRequests.open / pullRequests.total) * maxBarWidth * barProgress;
  const prsClosedWidth = (pullRequests.closed / pullRequests.total) * maxBarWidth * barProgress;

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
          top: "10%",
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>{orgName}</h1>
        <h2 style={{ fontSize: "1.8rem", color: "#58A6FF", marginTop: "0.5rem" }}>
          Issues & Pull Requests Status
        </h2>
      </div>

      {/* Status Bars Container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: maxBarWidth + 200,
        }}
      >
        {/* Issues Bar */}
        <div style={{ marginBottom: 60 }}>
          <h3 style={{ marginBottom: 20 }}>Issues</h3>
          <div style={{ display: "flex", alignItems: "center", height: 40 }}>
            {/* Open Issues */}
            <div
              style={{
                width: issuesOpenWidth,
                height: "100%",
                backgroundColor: "#F85149",
                borderRadius: "4px 0 0 4px",
                transition: "width 0.3s ease",
              }}
            />
            {/* Closed Issues */}
            <div
              style={{
                width: issuesClosedWidth,
                height: "100%",
                backgroundColor: "#2EA043",
                borderRadius: "0 4px 4px 0",
                transition: "width 0.3s ease",
              }}
            />
            {/* Stats */}
            <div
              style={{
                marginLeft: 20,
                opacity: statsOpacity,
                display: "flex",
                gap: 20,
              }}
            >
              <span style={{ color: "#F85149" }}>
                {issues.open} Open
              </span>
              <span style={{ color: "#2EA043" }}>
                {issues.closed} Closed
              </span>
            </div>
          </div>
        </div>

        {/* Pull Requests Bar */}
        <div>
          <h3 style={{ marginBottom: 20 }}>Pull Requests</h3>
          <div style={{ display: "flex", alignItems: "center", height: 40 }}>
            {/* Open PRs */}
            <div
              style={{
                width: prsOpenWidth,
                height: "100%",
                backgroundColor: "#F85149",
                borderRadius: "4px 0 0 4px",
                transition: "width 0.3s ease",
              }}
            />
            {/* Closed PRs */}
            <div
              style={{
                width: prsClosedWidth,
                height: "100%",
                backgroundColor: "#2EA043",
                borderRadius: "0 4px 4px 0",
                transition: "width 0.3s ease",
              }}
            />
            {/* Stats */}
            <div
              style={{
                marginLeft: 20,
                opacity: statsOpacity,
                display: "flex",
                gap: 20,
              }}
            >
              <span style={{ color: "#F85149" }}>
                {pullRequests.open} Open
              </span>
              <span style={{ color: "#2EA043" }}>
                {pullRequests.closed} Closed
              </span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}; 