import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Title } from "./components/Title";
import { Timeline } from "./components/Timeline";
import { ActivityFlow } from "./components/ActivityFlow";

interface GitHubActivitySummaryProps {
  events: Record<string, {
    displayName: string;
    count: number;
    details: Array<{
      repository: string;
      author: string;
      createdAt: string;
      [key: string]: any;
    }>;
  }>;
  startDate: Date;
  endDate: Date;
  orgName: string;
}

export const GitHubActivitySummary: React.FC<GitHubActivitySummaryProps> = ({
  events,
  startDate,
  endDate,
  orgName,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117", // GitHub dark theme
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Title Section */}
      <Sequence from={0} durationInFrames={90}>
        <Title
          title={`${orgName} Activity`}
          subtitle={`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
        />
      </Sequence>

      {/* Timeline View */}
      <Sequence from={90} durationInFrames={180}>
        <Timeline
          events={events}
          startDate={startDate}
          endDate={endDate}
        />
      </Sequence>

      {/* Activity Flow */}
      <Sequence from={270} durationInFrames={180}>
        <ActivityFlow events={events} />
      </Sequence>

      {/* Stats Overlay */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "20px",
          backgroundColor: "rgba(13, 17, 23, 0.8)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ color: "#58A6FF", fontSize: "1.2rem", marginBottom: "10px" }}>
          Activity Summary
        </div>
        {Object.entries(events).map(([type, event]) => (
          <div
            key={type}
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "white",
              fontSize: "0.9rem",
              marginBottom: "5px",
            }}
          >
            <span>{event.displayName}:</span>
            <span style={{ marginLeft: "20px", color: "#58A6FF" }}>
              {event.details.length}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}; 