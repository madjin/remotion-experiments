import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { z } from "zod";
import { Title } from "./components/Title";
import { Timeline } from "./components/Timeline";
import { ActivityFlow } from "./components/ActivityFlow";
import { DetailedActivitySummary } from "./components/DetailedActivitySummary";

// Schema for GitHub events
export const githubEventSchema = z.record(z.object({
  displayName: z.string(),
  count: z.number(),
  details: z.array(z.object({
    repository: z.string(),
    author: z.string(),
    createdAt: z.string(),
    title: z.string().optional(),
    action: z.string().optional(),
    state: z.string().optional(),
    commits: z.array(z.object({
      message: z.string(),
      url: z.string()
    })).optional()
  }))
}));

// Schema for the activity summary props
export const activitySummarySchema = z.object({
  events: githubEventSchema,
  startDate: z.date(),
  endDate: z.date(),
  orgName: z.string(),
  showTimeline: z.boolean().optional()
});

type GitHubSummaryVideoProps = z.infer<typeof activitySummarySchema>;

export const GitHubSummaryVideo: React.FC<GitHubSummaryVideoProps> = ({
  events,
  startDate,
  endDate,
  orgName,
  showTimeline = true,
}) => {
  const { width, height } = useVideoConfig();

  // Transform events into Timeline-compatible format
  const timelineEvents = Object.entries(events).reduce((acc, [type, event]) => {
    acc[type] = {
      type,
      displayName: event.displayName,
      createdAt: event.details[0]?.createdAt || new Date().toISOString(),
      details: event.details
    };
    return acc;
  }, {} as Record<string, { type: string; displayName: string; createdAt: string; details: any[] }>);

  if (!showTimeline) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#0D1117",
          fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
        }}
      >
        <Sequence from={0} durationInFrames={300}>
          <DetailedActivitySummary events={events} orgName={orgName} />
        </Sequence>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117",
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
      <Sequence from={90} durationInFrames={150}>
        <Timeline
          events={timelineEvents}
          startDate={startDate}
          endDate={endDate}
        />
      </Sequence>

      {/* Activity Flow */}
      <Sequence from={240} durationInFrames={150}>
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