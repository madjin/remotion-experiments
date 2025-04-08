# GitHub Summary Video Generator

A Remotion template that creates beautiful video summaries of GitHub repository activity. This template visualizes repository metrics, changes, and impact areas in an engaging animated format.

## Features

- Animated title sequence
- Key metrics visualization (contributors, PRs, issues, lines changed)
- Changes breakdown (features, fixes, chores)
- Impact visualization across different areas of the codebase
- GitHub dark theme styling
- Smooth spring animations

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the preview:
   ```bash
   npm start
   ```
4. Edit the data in `src/data/githubSummary.ts` to match your repository's data
5. Render the video:
   ```bash
   npm run build
   ```

## Customization

The video is composed of several sections, each lasting 3 seconds (90 frames at 30fps):

1. **Title (0-3s)**: Repository name and date
2. **Metrics (3-6s)**: Key statistics
3. **Changes (6-9s)**: Features, fixes, and improvements
4. **Areas (9-12s)**: Impact across different parts of the codebase

You can customize:
- Colors and styling in each component
- Animation timing and effects
- Duration of each section
- Layout and typography

## Data Structure

Update the `githubSummary` object in `src/data/githubSummary.ts` with your repository's data:

```typescript
{
  title: string;
  version: string;
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
}
```

## Requirements

- Node.js 14 or higher
- npm 6 or higher

## License

MIT
