export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
  details: string[];
  tags: string[];
  links: ProjectLink[];
  year?: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  technologies?: string[];
};

export const siteConfig = {
  name: "Waleed Rydhan",
  title: "Computer Science Student · Full-Stack Developer",
  headline:
    "CS student (4+1 B.S./M.S.) with internship experience across full-stack development, API integrations, and go-to-market engineering.",
  email: "wrydhan@gmail.com",
  phone: "925-570-5154",
  location: "Dublin, CA",
  links: [
    { label: "GitHub", href: "https://github.com/wrydhan" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/waleed-rydhan-982345388" },
    { label: "Resume PDF", href: "/resume.pdf" },
  ],
};

export const about = {
  summary:
    "Computer Science student at CSU East Bay (4+1 B.S./M.S.) with hands-on internship experience across full-stack development, third-party API integrations, and go-to-market engineering. Comfortable across front-end and back-end work in TypeScript and React — someone who uses software skills to help the business as a whole.",
  interests: [
    "Automotive & motorsports",
    "Startup & founder communities",
    "Event operations",
  ],
};

export const experience: Experience[] = [
  {
    id: "exp-purefi",
    role: "Software Engineer Intern",
    company: "PureFi",
    period: "Apr 2026 — Jun 2026",
    location: "San Francisco Bay Area · Hybrid",
    highlights: [
      "Built an AI-powered CLI debugging tool that collected error data from Honeycomb, Intercom, and in-app logs, then pinpointed likely root causes in plain language — powered by Claude models.",
      "Developed features across PureFi's mobile app and website, including localization, ACH transfer workflows, and customer support pages/systems.",
      "Integrated third-party services including Plaid, MoonPay, Coinbase, Intercom, and BridgePay for payments, identity verification, and support.",
      "Implemented ad tracking to improve marketing attribution and product analytics.",
    ],
    technologies: [
      "TypeScript",
      "React",
      "React Native",
      "Claude",
      "Plaid",
      "Honeycomb",
    ],
  },
  {
    id: "exp-loops",
    role: "Go-to-Market (GTM) Engineer Intern",
    company: "Loops.fi",
    period: "Oct 2025 — Mar 2026",
    location: "San Francisco, CA · Hybrid",
    highlights: [
      "Built AI-powered CLI tools for marketing ops, including one that analyzed a LinkedIn creator's best posts, derived a content strategy, and generated on-brand posts using OpenAI models.",
      "Developed LinkedIn scraping pipelines with Apify to pull full post histories for content analysis and generation.",
      "Bridged marketing and engineering by identifying workflow bottlenecks and shipping code-based solutions across the GTM stack.",
    ],
    technologies: ["TypeScript", "OpenAI", "Apify", "Node.js", "CLI"],
  },
  {
    id: "exp-founders",
    role: "Operations Intern",
    company: "Founders Inc",
    period: "Aug 2023 — Sep 2025",
    location: "San Francisco, CA · On-site",
    highlights: [
      "Planned and managed events and physical spaces for a startup community and venture hub.",
      "Built out dedicated gaming and IT rooms, coordinating equipment, setup, and day-to-day logistics.",
    ],
    technologies: ["Event operations", "IT setup", "Logistics"],
  },
];

export const projects: Project[] = [
  {
    id: "proj-track-day",
    title: "Founders Track Day",
    summary: "Track-day event series connecting car enthusiasts, founders, and investors.",
    description:
      "Founded and operate a track-day event series at the intersection of automotive culture and the startup community.",
    details: [
      "Hosted 2 events with 200+ total attendees so far.",
      "Secured $30K in sponsorships from Rho and MongoDB for the next event — a $32K production at Sonoma Raceway scheduled for October 2026.",
      "Own operations end to end: venue booking, sponsor outreach, budgeting, and on-site event management.",
    ],
    tags: ["Events", "Sponsorships", "Operations", "Automotive"],
    links: [],
    year: "2025 — Present",
  },
  {
    id: "proj-purefi-cli",
    title: "PureFi AI Debugging CLI",
    summary: "CLI tool that aggregates error data and explains root causes in plain language.",
    description:
      "Built during my PureFi internship to accelerate the team's debugging workflow by unifying signals from multiple observability and support tools.",
    details: [
      "Pulls error data from Honeycomb, Intercom, and the app's built-in debugging/logs.",
      "Uses Claude models to pinpoint likely root causes and explain them clearly.",
      "Designed to cut time spent triaging production issues across mobile and web.",
    ],
    tags: ["TypeScript", "Claude", "Honeycomb", "Intercom", "CLI"],
    links: [],
    year: "2026",
  },
  {
    id: "proj-loops-content",
    title: "Loops.fi Content Strategy CLI",
    summary: "AI tool that analyzes LinkedIn posts and generates on-brand content.",
    description:
      "GTM engineering project that turns creator engagement data into actionable content strategies and draft posts.",
    details: [
      "Analyzes a LinkedIn creator's best-performing posts to derive a content strategy from engagement data.",
      "Generates on-brand posts for any topic and audience using OpenAI models.",
      "LinkedIn scraping pipelines built with Apify feed full post histories into the analysis tools.",
    ],
    tags: ["TypeScript", "OpenAI", "Apify", "GTM", "CLI"],
    links: [],
    year: "2025",
  },
];

export const skills = {
  languages: ["TypeScript", "JavaScript", "Python", "C++", "Next.js", "HTML"],
  frameworks: ["React", "Apollo (GraphQL)", "Tailwind CSS", "Expo (React Native)"],
  tools: [
    "Supabase",
    "Neon (PostgreSQL)",
    "Git & GitHub",
    "Vercel",
    "Netlify",
    "Linear",
    "Cursor",
  ],
  ai: ["Claude", "ChatGPT (OpenAI)", "Gemini", "GitHub Copilot", "v0"],
  integrations: [
    "Plaid",
    "MoonPay",
    "Coinbase",
    "Intercom",
    "BridgePay",
    "Honeycomb",
    "Apify",
  ],
  marketing: ["Apollo.io", "Google Analytics", "Meta Ads", "TikTok Ads"],
};

export const education = [
  {
    degree: "B.S. / M.S. in Computer Science (4+1 Accelerated Program)",
    school: "California State University, East Bay",
    period: "Expected B.S. May 2028 · M.S. May 2029",
    details:
      "Relevant coursework: Data Structures and Algorithms, Analysis of Algorithms, Computer Architecture, Operating Systems.",
  },
];
