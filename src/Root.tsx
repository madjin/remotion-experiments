import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { GitHubSummaryVideo, activitySummarySchema } from "./GitHubSummary";
import { IssuesPRsStatus } from "./components/IssuesPRsStatus";
import { CodeChangesHeatmap } from "./components/CodeChangesHeatmap";
import { TopContributors } from "./components/TopContributors";
import { NewIssuesList } from "./components/NewIssuesList";
import { PullRequestFlow } from "./components/PullRequestFlow";
import { ContributorActivity } from "./components/ContributorActivity";

// Define schemas for each component
const issuesPRsStatusSchema = z.object({
  orgName: z.string(),
  issues: z.object({
    open: z.number(),
    closed: z.number(),
    total: z.number()
  }),
  pullRequests: z.object({
    open: z.number(),
    closed: z.number(),
    total: z.number()
  })
});

const codeChangesSchema = z.object({
  changes: z.array(z.object({
    path: z.string(),
    additions: z.number(),
    deletions: z.number(),
    total: z.number()
  })),
  title: z.string()
});

const topContributorsSchema = z.object({
  contributors: z.array(z.object({
    username: z.string(),
    avatarUrl: z.string(),
    contributions: z.array(z.object({
      type: z.string(),
      count: z.number()
    })),
    totalScore: z.number()
  })),
  title: z.string()
});

const newIssuesSchema = z.object({
  issues: z.array(z.object({
    title: z.string(),
    author: z.string(),
    repository: z.string(),
    createdAt: z.string(),
    labels: z.array(z.string()),
    priority: z.enum(["high", "medium", "low"])
  })),
  title: z.string()
});

// Schema for pull request flow
const pullRequestFlowSchema = z.object({
  pullRequests: z.array(z.object({
    title: z.string(),
    author: z.string(),
    repository: z.string(),
    state: z.enum(["open", "closed", "merged"]),
    createdAt: z.string()
  })),
  title: z.string()
});

// Schema for contributor activity
const contributorActivitySchema = z.object({
  contributors: z.array(z.object({
    username: z.string(),
    avatarUrl: z.string(),
    recentContributions: z.array(z.object({
      type: z.string(),
      count: z.number(),
      timestamp: z.string(),
      impact: z.object({
        linesChanged: z.number().optional(),
        filesModified: z.number().optional(),
        reviewComments: z.number().optional()
      }).optional()
    })),
    totalContributions: z.number(),
    streak: z.number(),
    contributionsByType: z.object({
      commits: z.number(),
      reviews: z.number(),
      issues: z.number(),
      pullRequests: z.number()
    }),
    impactMetrics: z.object({
      totalLinesChanged: z.number(),
      filesModified: z.number(),
      avgReviewComments: z.number(),
      mergeRate: z.number()
    })
  })),
  title: z.string()
});

// Types inferred from schemas
type IssuesPRsStatusProps = z.infer<typeof issuesPRsStatusSchema>;
type CodeChangesHeatmapProps = z.infer<typeof codeChangesSchema>;
type TopContributorsProps = z.infer<typeof topContributorsSchema>;
type NewIssuesListProps = z.infer<typeof newIssuesSchema>;

// Schema for status data
const statusDataSchema = z.object({
  open: z.number(),
  closed: z.number(),
  total: z.number()
});

// Schema for contributions
const contributionSchema = z.object({
  type: z.string(),
  count: z.number()
});

const contributorSchema = z.object({
  username: z.string(),
  avatarUrl: z.string(),
  contributions: z.array(contributionSchema),
  totalScore: z.number()
});

// Sample events data
const sampleEvents = {
  PushEvent: {
    displayName: "Code Pushes",
    count: 3,
    details: [
      {
        repository: "elizaos/core",
        author: "wtfsayo",
        branch: "main",
        createdAt: "2024-03-29T10:00:00Z",
        commits: [
          {
            message: "Add monorepo command to CLI",
            url: "https://github.com/elizaos/core/commit/123"
          }
        ]
      }
    ]
  },
  PullRequestEvent: {
    displayName: "Pull Requests",
    count: 2,
    details: [
      {
        repository: "elizaos/docs",
        author: "sw2347",
        action: "opened",
        title: "Update quickstart guide",
        createdAt: "2024-03-29T11:30:00Z",
        state: "open"
      }
    ]
  },
  IssuesEvent: {
    displayName: "Issues",
    count: 1,
    details: [
      {
        repository: "elizaos/plugin-sql",
        author: "frahlg",
        action: "opened",
        title: "Installation fails",
        createdAt: "2024-03-29T09:15:00Z",
        state: "open"
      }
    ]
  }
};

// Sample status data
const sampleStatusData = {
  issues: {
    open: 12,
    closed: 48,
    total: 60
  },
  pullRequests: {
    open: 8,
    closed: 32,
    total: 40
  }
};

// Sample code changes data
const sampleCodeChanges = {
  changes: [
    {
      path: "src/core/engine.ts",
      additions: 245,
      deletions: 123,
      total: 368
    },
    {
      path: "src/plugins/sql/index.ts",
      additions: 189,
      deletions: 45,
      total: 234
    },
    {
      path: "src/cli/commands/init.ts",
      additions: 156,
      deletions: 34,
      total: 190
    },
    {
      path: "tests/integration/sql.test.ts",
      additions: 134,
      deletions: 12,
      total: 146
    },
    {
      path: "src/types/index.ts",
      additions: 89,
      deletions: 23,
      total: 112
    },
    {
      path: "docs/api/sql-plugin.md",
      additions: 78,
      deletions: 15,
      total: 93
    },
    {
      path: "src/utils/config.ts",
      additions: 45,
      deletions: 34,
      total: 79
    },
    {
      path: "README.md",
      additions: 67,
      deletions: 8,
      total: 75
    }
  ],
  title: "Core Engine Refactor"
};

// Sample contributors data
const sampleContributors = {
  contributors: [
    {
      username: "wtfsayo",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345678",
      contributions: [
        { type: "Commits", count: 156 },
        { type: "PRs Merged", count: 42 },
        { type: "Reviews", count: 78 }
      ],
      totalScore: 276
    },
    {
      username: "sw2347",
      avatarUrl: "https://avatars.githubusercontent.com/u/23456789",
      contributions: [
        { type: "Commits", count: 98 },
        { type: "PRs Merged", count: 56 },
        { type: "Reviews", count: 92 }
      ],
      totalScore: 246
    },
    {
      username: "frahlg",
      avatarUrl: "https://avatars.githubusercontent.com/u/34567890",
      contributions: [
        { type: "Commits", count: 87 },
        { type: "PRs Merged", count: 34 },
        { type: "Reviews", count: 103 }
      ],
      totalScore: 224
    }
  ],
  title: "Q1 2024 Contributors"
};

// Sample new issues data
const sampleNewIssues = {
  issues: [
    {
      title: "SQL Plugin: Connection Pool Not Releasing Resources",
      author: "frahlg",
      repository: "elizaos/plugin-sql",
      createdAt: "2024-03-29T10:15:00Z",
      labels: ["bug", "performance", "sql-plugin"],
      priority: "high"
    },
    {
      title: "Add Support for Custom Middleware",
      author: "sw2347",
      repository: "elizaos/core",
      createdAt: "2024-03-29T09:30:00Z",
      labels: ["enhancement", "core", "middleware"],
      priority: "medium"
    },
    {
      title: "Documentation: Update CLI Commands Reference",
      author: "wtfsayo",
      repository: "elizaos/docs",
      createdAt: "2024-03-29T08:45:00Z",
      labels: ["documentation", "cli"],
      priority: "low"
    },
    {
      title: "TypeScript Types Not Exported Correctly",
      author: "frahlg",
      repository: "elizaos/core",
      createdAt: "2024-03-29T08:00:00Z",
      labels: ["bug", "typescript"],
      priority: "high"
    },
    {
      title: "Add Integration Tests for Redis Plugin",
      author: "sw2347",
      repository: "elizaos/plugin-redis",
      createdAt: "2024-03-29T07:30:00Z",
      labels: ["testing", "redis-plugin"],
      priority: "medium"
    }
  ],
  title: "Recent Issues"
};

// Sample pull requests data
const samplePullRequests: z.infer<typeof pullRequestFlowSchema> = {
  pullRequests: [
    {
      title: "Add new visualization components",
      author: "wtfsayo",
      repository: "elizaos/core",
      state: "open" as const,
      createdAt: "2024-03-29T10:00:00Z"
    },
    {
      title: "Fix SQL plugin connection issues",
      author: "frahlg",
      repository: "elizaos/plugin-sql",
      state: "merged" as const,
      createdAt: "2024-03-29T09:30:00Z"
    },
    {
      title: "Update documentation for v2",
      author: "sw2347",
      repository: "elizaos/docs",
      state: "closed" as const,
      createdAt: "2024-03-29T09:00:00Z"
    },
    {
      title: "Implement Redis caching",
      author: "wtfsayo",
      repository: "elizaos/plugin-redis",
      state: "open" as const,
      createdAt: "2024-03-29T08:30:00Z"
    },
    {
      title: "Add test coverage reports",
      author: "frahlg",
      repository: "elizaos/core",
      state: "merged" as const,
      createdAt: "2024-03-29T08:00:00Z"
    }
  ],
  title: "Pull Request Activity"
};

// Sample contributor activity data
const sampleContributorActivity = {
  contributors: [
    {
      username: "wtfsayo",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345678",
      recentContributions: [
        { 
          type: "commit", 
          count: 8, 
          timestamp: "2024-03-29",
          impact: {
            linesChanged: 156,
            filesModified: 12
          }
        },
        { 
          type: "commit", 
          count: 5, 
          timestamp: "2024-03-28",
          impact: {
            linesChanged: 89,
            filesModified: 7
          }
        },
        { 
          type: "commit", 
          count: 12, 
          timestamp: "2024-03-27",
          impact: {
            linesChanged: 234,
            filesModified: 18
          }
        },
        { 
          type: "commit", 
          count: 3, 
          timestamp: "2024-03-26",
          impact: {
            linesChanged: 45,
            filesModified: 4
          }
        },
        { 
          type: "commit", 
          count: 7, 
          timestamp: "2024-03-25",
          impact: {
            linesChanged: 123,
            filesModified: 9
          }
        }
      ],
      totalContributions: 276,
      streak: 15,
      contributionsByType: {
        commits: 156,
        reviews: 42,
        issues: 28,
        pullRequests: 50
      },
      impactMetrics: {
        totalLinesChanged: 12456,
        filesModified: 234,
        avgReviewComments: 4.2,
        mergeRate: 0.92
      }
    },
    {
      username: "sw2347",
      avatarUrl: "https://avatars.githubusercontent.com/u/23456789",
      recentContributions: [
        { 
          type: "commit", 
          count: 4, 
          timestamp: "2024-03-29",
          impact: {
            linesChanged: 78,
            filesModified: 6
          }
        },
        { 
          type: "commit", 
          count: 6, 
          timestamp: "2024-03-28",
          impact: {
            linesChanged: 112,
            filesModified: 8
          }
        },
        { 
          type: "commit", 
          count: 9, 
          timestamp: "2024-03-27",
          impact: {
            linesChanged: 167,
            filesModified: 13
          }
        },
        { 
          type: "commit", 
          count: 2, 
          timestamp: "2024-03-26",
          impact: {
            linesChanged: 34,
            filesModified: 3
          }
        },
        { 
          type: "commit", 
          count: 5, 
          timestamp: "2024-03-25",
          impact: {
            linesChanged: 89,
            filesModified: 7
          }
        }
      ],
      totalContributions: 246,
      streak: 12,
      contributionsByType: {
        commits: 98,
        reviews: 92,
        issues: 24,
        pullRequests: 32
      },
      impactMetrics: {
        totalLinesChanged: 8934,
        filesModified: 178,
        avgReviewComments: 5.1,
        mergeRate: 0.88
      }
    },
    {
      username: "frahlg",
      avatarUrl: "https://avatars.githubusercontent.com/u/34567890",
      recentContributions: [
        { 
          type: "commit", 
          count: 6, 
          timestamp: "2024-03-29",
          impact: {
            linesChanged: 134,
            filesModified: 11
          }
        },
        { 
          type: "commit", 
          count: 3, 
          timestamp: "2024-03-28",
          impact: {
            linesChanged: 56,
            filesModified: 5
          }
        },
        { 
          type: "commit", 
          count: 7, 
          timestamp: "2024-03-27",
          impact: {
            linesChanged: 145,
            filesModified: 12
          }
        },
        { 
          type: "commit", 
          count: 4, 
          timestamp: "2024-03-26",
          impact: {
            linesChanged: 78,
            filesModified: 6
          }
        },
        { 
          type: "commit", 
          count: 8, 
          timestamp: "2024-03-25",
          impact: {
            linesChanged: 167,
            filesModified: 14
          }
        }
      ],
      totalContributions: 224,
      streak: 10,
      contributionsByType: {
        commits: 87,
        reviews: 103,
        issues: 18,
        pullRequests: 16
      },
      impactMetrics: {
        totalLinesChanged: 7645,
        filesModified: 156,
        avgReviewComments: 6.3,
        mergeRate: 0.85
      }
    }
  ],
  title: "Contributor Activity"
};

// Get dates for the last 3 days
const endDate = new Date();
const startDate = new Date();
startDate.setDate(endDate.getDate() - 3);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* GitHub Activity Summary Video */}
      <Composition
        id="GitHubActivity"
        component={GitHubSummaryVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        schema={activitySummarySchema}
        defaultProps={{
          events: sampleEvents,
          startDate,
          endDate,
          orgName: "elizaos",
          showTimeline: true
        }}
      />

      {/* Detailed Activity Summary Only */}
      <Composition
        id="DetailedActivity"
        component={GitHubSummaryVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={activitySummarySchema}
        defaultProps={{
          events: sampleEvents,
          startDate,
          endDate,
          orgName: "elizaos",
          showTimeline: false
        }}
      />

      {/* Issues and PRs Status */}
      <Composition<typeof issuesPRsStatusSchema, IssuesPRsStatusProps>
        id="IssuesPRsStatus"
        component={IssuesPRsStatus}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        schema={issuesPRsStatusSchema}
        defaultProps={{
          orgName: "elizaos",
          issues: {
            open: 10,
            closed: 25,
            total: 35
          },
          pullRequests: {
            open: 5,
            closed: 15,
            total: 20
          }
        }}
      />

      {/* Code Changes Impact */}
      <Composition<typeof codeChangesSchema, CodeChangesHeatmapProps>
        id="CodeChanges"
        component={CodeChangesHeatmap}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        schema={codeChangesSchema}
        defaultProps={{
          changes: sampleCodeChanges.changes,
          title: "Code Changes Impact"
        }}
      />

      {/* Top Contributors */}
      <Composition<typeof topContributorsSchema, TopContributorsProps>
        id="TopContributors"
        component={TopContributors}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={topContributorsSchema}
        defaultProps={{
          contributors: sampleContributors.contributors,
          title: "Top Contributors"
        }}
      />

      {/* New Issues List */}
      <Composition<typeof newIssuesSchema, NewIssuesListProps>
        id="NewIssues"
        component={NewIssuesList}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        schema={newIssuesSchema}
        defaultProps={{
          issues: sampleNewIssues.issues.map(issue => ({
            ...issue,
            priority: issue.priority as "high" | "medium" | "low"
          })),
          title: "New Issues"
        }}
      />

      {/* Pull Request Flow */}
      <Composition<typeof pullRequestFlowSchema, z.infer<typeof pullRequestFlowSchema>>
        id="PullRequestFlow"
        component={PullRequestFlow}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={pullRequestFlowSchema}
        defaultProps={samplePullRequests}
      />

      {/* Contributor Activity */}
      <Composition<typeof contributorActivitySchema, z.infer<typeof contributorActivitySchema>>
        id="ContributorActivity"
        component={ContributorActivity}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        schema={contributorActivitySchema}
        defaultProps={sampleContributorActivity}
      />
    </>
  );
}; 