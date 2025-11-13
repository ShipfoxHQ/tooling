const config = {
  // Upload Storybook build output
  buildDir: 'storybook-static',

  // Project token (can also be set via ARGOS_TOKEN env var)
  // token: process.env.ARGOS_TOKEN,

  // Repository information (optional, auto-detected from git)
  // repository: 'shipfox/tooling',

  // Branch information (optional, auto-detected from git)
  // branch: process.env.GITHUB_REF_NAME,

  // Commit information (optional, auto-detected from git)
  // commit: process.env.GITHUB_SHA,

  // Parallel upload settings for faster uploads
  parallel: {
    total: -1, // Auto-detect based on available resources
    nonce: process.env.GITHUB_RUN_ID || Date.now().toString(),
  },

  // Ignore certain screenshots or patterns
  // ignore: ['**/private/**'],

  // Reference branch for comparisons (usually main)
  reference: 'main',

  // Threshold for visual changes (0 = any change, 1 = no changes)
  threshold: 0,
};

export default config;
