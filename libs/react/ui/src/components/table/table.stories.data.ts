/**
 * Data types, generation functions, and sample data for Table stories
 */

export type JobData = {
  id: string;
  name: string;
  total: number;
  success: number;
  failed: number;
  neutral: number;
  flaked: number;
  failureRate: string;
  flakeRate: string;
  repository?: string;
  branch?: string;
};

export type SearchJobData = {
  id: string;
  name: string;
  total: number;
  success: number;
  failed: number;
  status: 'active' | 'completed' | 'failed';
  repository: string;
  branch: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
};

/**
 * Generate mock job data
 */
export const generateJobData = (count: number): JobData[] => {
  return Array.from({length: count}, (_, i) => ({
    id: `job-${i + 1}`,
    name: 'Dependabot updates',
    total: 46,
    success: 46,
    failed: 46,
    neutral: 46,
    flaked: 46,
    failureRate: '14%',
    flakeRate: '0%',
    repository: 'shipfox/tooling',
    branch: 'main',
  }));
};

/**
 * Generate mock search job data with varied properties
 */
export const generateSearchJobData = (count: number): SearchJobData[] => {
  const jobNames = [
    'Build & Deploy',
    'Run Tests',
    'Code Quality Check',
    'Security Scan',
    'Integration Tests',
    'Performance Tests',
    'Deploy to Staging',
    'Deploy to Production',
    'Database Migration',
    'Cache Warm-up',
  ];
  const repositories = ['shipfox/tooling', 'shipfox/web', 'shipfox/api', 'shipfox/mobile'];
  const branches = ['main', 'develop', 'staging', 'feat/new-feature'];
  const statuses: Array<'active' | 'completed' | 'failed'> = ['active', 'completed', 'failed'];

  return Array.from({length: count}, (_, i) => ({
    id: `job-${i + 1}`,
    name: jobNames[i % jobNames.length],
    total: Math.floor(Math.random() * 100) + 20,
    success: Math.floor(Math.random() * 80) + 10,
    failed: Math.floor(Math.random() * 20),
    status: statuses[i % statuses.length],
    repository: repositories[i % repositories.length],
    branch: branches[i % branches.length],
  }));
};

/**
 * Sample job data
 */
export const jobsData = generateJobData(100);

/**
 * Sample search job data
 */
export const searchJobsData = generateSearchJobData(50);

/**
 * Sample user data
 */
export const users: User[] = [
  {id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active'},
  {id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active'},
  {id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive'},
  {id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'active'},
  {id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'active'},
];
