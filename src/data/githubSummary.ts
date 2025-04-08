export interface GitHubSummaryData {
  title: string;
  version: string;
  overview: string;
  metrics: {
    contributors: number;
    merged_prs: number;
    new_issues: number;
    lines_changed: number;
  };
  changes: {
    features: string[];
    fixes: string[];
    chores: string[];
  };
  areas: Array<{
    name: string;
    files: number;
    additions: number;
    deletions: number;
  }>;
  issues_summary: string;
  questions: string[];
  top_contributors: Array<{
    name: string;
    summary: string;
    areas: string[];
  }>;
}

export const githubSummary: GitHubSummaryData = {
  "title": "elizaos Eliza (2025-03-29)",
  "version": "",
  "overview": "Development focused on package improvements (twitter plugin post generation + ran linter), new features (add monorepo command to cli), 2 bug fixes. with 5 contributors merging 4 PRs. Major work included various improvements.",
  "metrics": {
    "contributors": 5,
    "merged_prs": 4,
    "new_issues": 3,
    "lines_changed": 4171
  },
  "changes": {
    "features": [
      "add monorepo command to cli"
    ],
    "fixes": [
      "duplicate tweet (twitter error 187)",
      "twitter plugin post generation + ran linter"
    ],
    "chores": [
      "better component handling (don't fetch when not required/mounted)"
    ]
  },
  "areas": [
    {
      "name": "packages",
      "files": 49,
      "additions": 2015,
      "deletions": 1629
    },
    {
      "name": ".github",
      "files": 1,
      "additions": 14,
      "deletions": 15
    },
    {
      "name": "root",
      "files": 1,
      "additions": 251,
      "deletions": 247
    }
  ],
  "issues_summary": "working on 3 bugs including 'quickstart guide instructions inaccurate/outdated', 'Installation fails: Cannot find dependency @elizaos/plugin-sql@^0.25.'",
  "questions": [],
  "top_contributors": [
    {
      "name": "wtfsayo",
      "summary": "wtfsayo is currently working on adding a monorepo command to the CLI, fixing duplicate tweets related to Twitter errors, improving component handling to avoid unnecessary fetching, and resolving issues with the Twitter plugin post generation and running linter",
      "areas": [
        ".github",
        "bun.lock",
        "packages"
      ]
    },
    {
      "name": "sw2347",
      "summary": "sw2347 is currently addressing an issue related to inaccurate or outdated instructions in the quickstart guide",
      "areas": []
    },
    {
      "name": "frahlg",
      "summary": "frahlg is currently working on resolving an installation issue related to a missing dependency, @elizaos/plugin-sql@^0",
      "areas": []
    }
  ]
}; 