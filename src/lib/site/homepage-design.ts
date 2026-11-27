import {
  bestieLine,
  bestieName,
  kitHeading,
  kitName,
  kitPromise,
} from "./site-navigation"

export const siteDescription = `${bestieName}. ${bestieLine} Clear answers on tech, AI, hiring, and vendors for founders and small businesses.`

export const homepageAudienceFocuses = [
  "Non-technical founders",
  "Small businesses",
  "Startup teams",
  "Solo founders",
]

export const homepageDesign = {
  hero: {
    heading: `${bestieName}.`,
    note: bestieLine,
    supporting: "Clear answers for your biggest tech decisions.",
    description:
      "Independent, honest guidance on tech, AI, hiring, and vendors. I have spent my career building software and leading engineering teams. Now I help founders and small businesses decide what to build, buy, and who to trust. No hype, no jargon, and no question too basic.",
  },
  alwaysBuilding:
    "Building practical AI tools and helping people across industries make confident tech decisions. No jargon, no guesswork.",
  credibilityItems: [
    "25 years building software",
    "Multi-startup tech founder",
    "AI strategy and architecture reviews",
    "Taught AI at the University of Michigan",
  ],
  audienceHeading: "Big tech decisions, and nobody senior to ask.",
  audienceItems: [
    {
      title: "Is this quote, this code, or this timeline any good?",
      description:
        "You are making decisions on agency and developer estimates without anyone to translate.",
    },
    {
      title: "Which software and AI tools are actually worth it?",
      description:
        "Every vendor sounds like a genius. You need someone who is not selling it to you.",
    },
    {
      title: "Who owns architecture, process, and the next senior hire?",
      description:
        "You deserve thoughtful answers without paying for a full-time CTO.",
    },
    {
      title: "When is it time to bring in real developers?",
      description:
        "You have gotten impressive results with AI and no-code. Now the next step is showing.",
    },
  ],
  offeringsHeading: "Learn it, ask it, or have it reviewed.",
  kitHeading,
  kitPromise,
  kitDescription: `The free ${kitName} is being prepared. ${kitPromise}`,
  kitContents: [
    "A one-hour worksheet that ends with your one-page AI plan",
    "The Sara Test, so you can judge any AI tool yourself",
    "A “Safe to start” one-pager: what never to paste into AI, which settings to turn off, how to spot a trustworthy tool",
  ],
  storyHeading: "Serious about tech. Not so serious about everything else.",
  audiences: [
    "Non-technical founders",
    "Small business owners",
    "Startup teams",
    "Solo founders",
    "Agencies",
  ],
  consultingDescription:
    "Independent reviews of your tech stack, architecture, code, vendor proposal, or AI plan. Clear recommendations and practical next steps, with no development work to sell and no referral fees.",
  experienceHeading: "25 years across startups and enterprise.",
  experienceDescription:
    "From first commit to scale, as an engineer, engineering leader, consultant, and teacher.",
  industries: [
    "Fintech",
    "Real estate",
    "AI and developer tools",
    "Travel",
    "Education",
    "Automotive",
    "Marketing",
    "Publishing",
  ],
  ventures: [
    {
      title: "Rise & Shore",
      role: "Travel and hospitality · Founder",
      description:
        "AI-powered search for beach vacation rentals, booked direct with local agencies.",
    },
    {
      title: "TaxDedux",
      role: "Fintech and tax · Technical co-founder",
      description:
        "AI tax planning and deduction discovery for freelancers, the self-employed, and CPA firms.",
    },
  ],
  closingHeading: "Make your next tech decision with confidence.",
  closingDescription: `The free ${kitName} is being prepared. ${kitPromise}`,
}

export const techTranslations = [
  {
    theySaid: "“That’s technical debt.”",
    theyMeant:
      "We took shortcuts, and they are starting to cost us time. Ask which ones matter now.",
  },
  {
    theySaid: "“We’ll connect it with an API.”",
    theyMeant:
      "Your apps need to talk. Ask who is connecting them and writing down how it works.",
  },
  {
    theySaid: "“It needs to scale.”",
    theyMeant:
      "They expect more people to use it. Ask how many, and what would actually break.",
  },
  {
    theySaid: "“Two weeks, tops.”",
    theyMeant:
      "That is the estimate before testing, feedback, and the real scope show up.",
  },
]

// One of these is featured per visit, so each reload shows the next phrase.
export const aiTranslations = [
  {
    theySaid: "“It’s AI-powered.”",
    theyMeant:
      "There’s a chatbot in the corner. Ask what the AI actually does.",
  },
  {
    theySaid: "“The AI handles that automatically.”",
    theyMeant:
      "It works until it doesn’t. Ask who checks it, and how you undo it.",
  },
  {
    theySaid: "“We’ll build you an AI agent.”",
    theyMeant:
      "It’s software that takes actions for you. Ask what it can do without checking with you first.",
  },
  {
    theySaid: "“Your data is safe with our AI.”",
    theyMeant:
      "Maybe. Ask where it’s stored, how long it’s kept, and whether it trains on what you paste in.",
  },
]

export const homepageOfferings = [
  {
    slug: "starter-kit",
    title: `The Free ${kitName}`,
    description: kitPromise,
    ctaLabel: "Get the kit",
    ctaDestination: "/newsletter",
  },
  {
    slug: "course",
    title: "The course",
    description:
      "A practical, self-paced course for making stronger tech calls without becoming a developer. The course is in development.",
    ctaLabel: "See the course",
    ctaDestination: "/course",
  },
  {
    slug: "community",
    title: "Ask Sara",
    description:
      "A place for straight answers to real questions about tech, AI, hiring, and vendors. Ask Sara is in development.",
    ctaLabel: "See Ask Sara",
    ctaDestination: "/community",
  },
  {
    slug: "reviews",
    title: "Async reviews",
    description:
      "Share your tech stack, architecture, code, vendor proposal, or AI plan. Get clear recommendations and practical next steps.",
    ctaLabel: "See reviews",
    ctaDestination: "/build-with-me",
  },
]

export const homepageOfferingEyebrows: Record<string, string> = {
  "starter-kit": `Free · ${kitName}`,
  course: "Course · In development",
  community: "Ask Sara",
  reviews: "Review · In development",
}

export const homepageQuestions = [
  {
    question: "Should I hire an agency or a freelancer to build my app?",
    answer:
      "Choose based on the scope and how much coordination you can own. Compare deliverables, code ownership, support, and who makes the day-to-day decisions.",
  },
  {
    question: "How do I know if a development quote is fair?",
    answer:
      "Ask for an itemized scope, timeline, assumptions, and exclusions. Compare estimates against the same requirements before you decide.",
  },
  {
    question: "Where should a small business start with AI?",
    answer:
      "Start with one repetitive task, not a chatbot. Check whether the time saved is worth the cost and whether the data is safe to use.",
  },
]

export const homepageFaqHeading = "Real questions, straight answers."
