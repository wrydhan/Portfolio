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
  featured?: boolean;
  internalHref?: string;
  status?: "in-progress";
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
    summary:
      "A track-day series I founded for founders, investors, and car people — now a sponsored operation heading to Sonoma Raceway.",
    description:
      "I run the whole thing myself: venue, budget, sponsors, and the day-of experience. Two events in, 100+ people through the gates, and a flagship at Sonoma Raceway on October 26, 2026.",
    details: [
      "Grew from a single experimental meetup into a recurring, sponsored series in under a year.",
      "Closed $30K in corporate sponsorship from Rho, MongoDB, and Warp against a ~$32K flagship budget.",
      "Booked Sonoma Raceway for 400 expected attendees — the next chapter of a still-solo operation.",
    ],
    tags: ["Entrepreneurship", "Sponsorships", "Event operations", "Automotive"],
    links: [{ label: "Case study", href: "/founders-track-day" }],
    year: "2025 — Present",
    featured: true,
    internalHref: "/founders-track-day",
  },
  {
    id: "proj-schedule-maker",
    title: "Track Day Schedule Maker",
    summary:
      "The scheduling tool I actually use to run track days — sessions, run groups, and a PDF for the paddock.",
    description:
      "A Next.js app I built to stop assembling schedules by hand. Configure the day, drop in drivers, group them by skill, then drag people around until the grid feels right.",
    details: [
      "Generates a full day: tech inspection, driver meeting, sessions, breaks, and lunch before 2 PM.",
      "Skill-based or random grouping, with drag-and-drop between and within run groups.",
      "One-click PDF export of the schedule, groups, and day stats — built for printing, not just the screen.",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind", "@dnd-kit", "jsPDF"],
    links: [
      { label: "Live app", href: "https://track-day-schedule-maker.vercel.app" },
      { label: "GitHub", href: "https://github.com/wrydhan/TrackDayScheduleMaker" },
    ],
    year: "2025",
  },
  {
    id: "proj-buildsheet",
    title: "BuildSheet",
    summary:
      "A digital garage for car people — log the build, turn it into a swipeable magazine of spec sheets, share a public link.",
    description:
      "The app I'm building now. Add a car, log mods and maintenance, then generate poster-style sheets you can swipe through like a magazine. Built with Expo and Supabase; the MVP is feature-complete, with deploy and runtime bring-up still in progress.",
    details: [
      "Garage + build log for mods, service, and notes — then styled spec sheets generated from that data and photos.",
      "Public share pages at /c/[slug] so anyone can view a garage without an account.",
      "AI parsing and narration run server-side via Supabase Edge Functions. iOS, Android, and web from one Expo app.",
    ],
    tags: ["Expo", "React Native", "Supabase", "TypeScript", "In progress"],
    links: [{ label: "GitHub", href: "https://github.com/wrydhan/BuildSheet" }],
    year: "2026",
    status: "in-progress",
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
