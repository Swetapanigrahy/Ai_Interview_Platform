export type RoleSlug =
  | "frontend" | "backend" | "fullstack" | "data-science"
  | "devops" | "mobile" | "qa" | "product-manager";

export type Role = {
  slug: RoleSlug;
  title: string;
  short: string;
  description: string;
  emoji: string;
  questions: string[];
  followUps: string[];
};

export const ROLES: Role[] = [
  {
    slug: "frontend",
    title: "Frontend Engineer",
    short: "Frontend",
    emoji: "🎨",
    description: "React, TypeScript, performance, accessibility, modern CSS.",
    questions: [
      "Tell me about yourself and your frontend experience.",
      "Walk me through how React's reconciliation and the virtual DOM work.",
      "How do you optimize the performance of a large React application?",
      "Explain the difference between controlled and uncontrolled components, and when you'd pick each.",
      "How do you approach accessibility in a complex UI?",
      "Describe a challenging frontend bug you fixed and what you learned.",
    ],
    followUps: [
      "Interesting — could you give a concrete example from a project?",
      "Got it. What trade-offs did you consider?",
      "Thanks. How did you measure the impact of that change?",
    ],
  },
  {
    slug: "backend",
    title: "Backend Engineer",
    short: "Backend",
    emoji: "⚙️",
    description: "APIs, databases, scalability, distributed systems.",
    questions: [
      "Tell me about your backend experience and the stack you're most comfortable with.",
      "How would you design a rate limiter for a public API?",
      "Walk me through how you'd model and index a high-traffic 'orders' table.",
      "Explain the difference between SQL and NoSQL databases and when you'd choose each.",
      "How do you handle authentication and authorization in a microservice architecture?",
      "Tell me about a time you debugged a tricky production issue.",
    ],
    followUps: [
      "Interesting — what did the data look like at peak load?",
      "Good. What was your fallback if that approach failed?",
      "Thanks. How did you monitor it after rollout?",
    ],
  },
  {
    slug: "fullstack",
    title: "Fullstack Engineer",
    short: "Fullstack",
    emoji: "🧩",
    description: "End-to-end product development across frontend and backend.",
    questions: [
      "Walk me through a fullstack feature you owned end-to-end.",
      "How do you decide what logic lives on the client vs the server?",
      "How would you architect real-time updates (e.g., chat or notifications)?",
      "What's your approach to API contract design between frontend and backend?",
      "How do you keep types and validation consistent across the stack?",
      "Describe a deployment pipeline you've set up.",
    ],
    followUps: [
      "Got it. What was the hardest part of integrating those two layers?",
      "Interesting — how did the team review changes that touched both sides?",
      "Thanks. What would you do differently next time?",
    ],
  },
  {
    slug: "data-science",
    title: "Data Scientist",
    short: "Data Science",
    emoji: "📊",
    description: "ML, statistics, experimentation, data pipelines.",
    questions: [
      "Tell me about a data science project you're proud of.",
      "How do you decide which model to use for a new problem?",
      "Walk me through how you'd design an A/B test for a recommendation feature.",
      "Explain the bias–variance trade-off with a practical example.",
      "How do you handle missing or imbalanced data?",
      "How do you communicate model results to non-technical stakeholders?",
    ],
    followUps: [
      "Interesting — what features ended up mattering most?",
      "Got it. How confident were you in the result and why?",
      "Thanks. What was the business impact?",
    ],
  },
  {
    slug: "devops",
    title: "DevOps / SRE",
    short: "DevOps",
    emoji: "🛠️",
    description: "CI/CD, infrastructure, observability, reliability.",
    questions: [
      "Tell me about your experience with infrastructure as code.",
      "How do you design a CI/CD pipeline for a microservices app?",
      "What does a healthy observability stack look like to you?",
      "Walk me through how you'd respond to a production outage.",
      "How do you handle secrets management at scale?",
      "Describe an SLO/SLI you've defined and why.",
    ],
    followUps: [
      "Got it. What tooling did you reach for first?",
      "Interesting — how did you reduce blast radius?",
      "Thanks. What did the postmortem reveal?",
    ],
  },
  {
    slug: "mobile",
    title: "Mobile Engineer",
    short: "Mobile",
    emoji: "📱",
    description: "iOS, Android, React Native, performance, offline.",
    questions: [
      "Tell me about your mobile development background.",
      "How do you approach offline-first behavior in a mobile app?",
      "What strategies do you use to keep app size and startup time low?",
      "How do you handle push notifications across iOS and Android?",
      "Walk me through your testing strategy for a mobile release.",
      "Describe a tricky platform-specific bug you solved.",
    ],
    followUps: [
      "Got it. How did users notice the change?",
      "Interesting — what was the trade-off vs native?",
      "Thanks. What metrics did you track post-launch?",
    ],
  },
  {
    slug: "qa",
    title: "QA Engineer",
    short: "QA",
    emoji: "🧪",
    description: "Testing strategy, automation, quality processes.",
    questions: [
      "Tell me about your testing philosophy.",
      "How do you decide what to automate vs test manually?",
      "Walk me through how you'd write an end-to-end test for a checkout flow.",
      "How do you handle flaky tests in CI?",
      "What metrics do you track to measure release quality?",
      "Describe a bug that escaped to production and how you prevented a recurrence.",
    ],
    followUps: [
      "Got it. How did the team adopt that practice?",
      "Interesting — what was the root cause?",
      "Thanks. How long did it take to stabilize?",
    ],
  },
  {
    slug: "product-manager",
    title: "Product Manager",
    short: "Product",
    emoji: "🚀",
    description: "Discovery, prioritization, roadmaps, stakeholder alignment.",
    questions: [
      "Tell me about a product you launched and what your role was.",
      "How do you prioritize a roadmap when stakeholders disagree?",
      "Walk me through how you'd validate a new feature idea.",
      "How do you measure the success of a launch?",
      "Tell me about a time you killed a feature. Why?",
      "How do you work with engineering when scope needs to change?",
    ],
    followUps: [
      "Got it. What signals convinced you?",
      "Interesting — how did the team react?",
      "Thanks. What would you do differently?",
    ],
  },
];

export const getRole = (slug: string) =>
  ROLES.find(r => r.slug === slug) ?? null;
