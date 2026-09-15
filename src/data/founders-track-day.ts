export type MediaSlot = {
  /** Drop a file in /public and set this path. Leave null to keep the TODO placeholder. */
  src: string | null;
  alt: string;
  caption?: string;
};

export const foundersTrackDay = {
  eyebrow: "Highlight · Case study",
  title: "Founders Track Day",
  tagline: "Founders and investors coming together the event of a lifetime.",
  role: "Founder & Organizer",
  operator: "Solo operator",
  period: "September 2025 — Present",

  heroImage: {
    src: "/images/founders-track-day/hero.jpg",
    alt: "Founders and investors in the paddock at Thunderhill",
  } satisfies MediaSlot,

  firstEventReel: {
    href: "https://www.instagram.com/p/DPmuu4PkhND/",
    label: "Watch the Thunderhill reel on Instagram",
    venue: "Thunderhill Raceway",
  },

  idea: [
    "It just started as an idea I had while working at Founders, Inc. Founders and friends I had were all interested in cars and racing them, what if we just did an event as a company?",
    "I started Founders Track Day in September 2025 to put that instinct on a real racetrack: a recurring day of driving that builds community.",
  ],

  stats: [
    { label: "Founded", value: "Sep 2025" },
    { label: "Events hosted", value: "2" },
    { label: "Attendees so far", value: "100+" },
    { label: "Sponsorship closed", value: "$30K" },
    { label: "Flagship budget", value: "~$32K" },
    { label: "Flagship venue", value: "Sonoma" },
    { label: "Next date", value: "Oct 26, 2026" },
    { label: "Expected at Sonoma", value: "400" },
  ],

  responsibilities: [
    {
      title: "Concepting",
      body: "Came up with the idea, garnered support then turned it into a reality.",
    },
    {
      title: "Sponsorship & partnerships",
      body: "Pitched, negotiated, and closed Rho, MongoDB, and Warp for a total of $30K.",
    },
    {
      title: "Venue & logistics",
      body: "Sourced and booked racetrack venues, including Sonoma Raceway for the flagship and Thunderhill for the first events.",
    },
    {
      title: "Finance & budgeting",
      body: "Built and managed the full event budget end to end.",
    },
    {
      title: "On-site operations",
      body: "Ran the day live. Personally directed attendee experience, scheduling, vendors, and whatever broke at 7am.",
    },
    {
      title: "Community & growth",
      body: "100+ people across the first two events. Next: 400 at Sonoma.",
    },
  ],

  tags: [
    "Entrepreneurship",
    "Sponsorship sales",
    "Partnership negotiation",
    "Budgeting & financial planning",
    "Event operations & logistics",
    "Community building",
    "Project management",
    "Vendor management",
    "Marketing & positioning",
  ],

  flagship: {
    kicker: "The flagship",
    venue: "Sonoma Raceway",
    date: "October 26, 2026",
    body: "The next chapter is a full production at a world-class track. Four hundred people, a ~$32K budget, and the whole thing funded through $30K in already-closed corporate sponsorship. Getting here meant learning to pitch sponsors, negotiate with a racing venue, and hold a real budget — then actually deliver.",
    facts: [
      { label: "Expected attendance", value: "400" },
      { label: "Production budget", value: "~$32K" },
      { label: "Sponsorship secured", value: "$30K" },
    ],
  },

  sponsors: [
    {
      name: "Rho",
      href: "https://www.rho.co/",
      blurb: "Business banking built for startups — checking, cards, spend, and treasury in one place.",
      markSrc: "/images/sponsors/rho.png",
      logoSrc: null as string | null,
    },
    {
      name: "MongoDB",
      href: "https://www.mongodb.com/",
      blurb: "The modern data platform — operational, search, and AI workloads in one database.",
      markSrc: null as string | null,
      logoSrc: "/images/sponsors/mongodb.svg",
    },
    {
      name: "Warp",
      href: "https://www.warp.co/",
      blurb: "AI-native employee management — payroll, HRIS, benefits, and IT that runs itself.",
      markSrc: null as string | null,
      logoSrc: null as string | null,
    },
  ],

  gallery: [
    {
      src: "/images/founders-track-day/gallery-paddock.jpg",
      alt: "Attendees talking in the paddock beside track-day cars",
      caption: "Paddock — the conversations that don’t happen in a conference room.",
    },
    {
      src: "/images/founders-track-day/gallery-drivers-meeting.jpg",
      alt: "Driver meeting at Thunderhill Raceway with track map on the whiteboard",
      caption: "Driver meeting at Thunderhill before the first sessions went out.",
    },
    {
      src: "/images/founders-track-day/gallery-meetup.jpg",
      alt: "Line of sports cars parked together at a Founders Track Day meetup",
      caption: "The lineup — founders, investors, and a shared obsession with cars.",
    },
  ] as MediaSlot[],

  relatedProjectIds: ["proj-schedule-maker", "proj-buildsheet"] as const,
};
