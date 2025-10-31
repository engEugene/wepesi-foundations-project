// Home Page Content
export const homeContent = {
  heroTitle: "Empowering Environmentalists Through Action",
  heroSubtitle:
    "Connect with impactful environmental volunteering opportunities near you. Join hands with students driving sustainable change in their communities.",
  ctaButton: "Explore Opportunities",
  stats: [
    { number: "500+", label: "Active Volunteers" },
    { number: "30+", label: "Partner Organizations" },
    { number: "10,000+", label: "Hours Served" },
  ],
  howItWorks: [
    {
      step: "Create an account",
      description: "Sign up to join a community of passionate changemakers.",
    },
    {
      step: "Find opportunities",
      description: "Browse by location, category, and interest.",
    },
    {
      step: "Earn badges",
      description: "Track your impact and celebrate milestones.",
    },
  ],
};

// Opportunities Page
export const opportunitiesData = [
  {
    id: 1,
    title: "Tree Planting in Karura Forest",
    organization: "EcoServe Kenya",
    duration: "1 Day (Nov 15)",
    location: "Nairobi Arboretum",
    category: "Reforestation",
    description:
      "Help restore Kenya’s forest cover by planting indigenous trees and learning about biodiversity protection.",
    image: "/src/images/placeholder.png",
  },
  {
    id: 2,
    title: "Beach Cleanup Drive",
    organization: "Green Youth Alliance",
    duration: "Weekend (Nov 23–24)",
    location: "Mombasa, Kenya",
    category: "Marine Conservation",
    description:
      "Join students and environmentalists in cleaning up coastal beaches and reducing plastic pollution.",
    image: "/src/images/placeholder.png",
  },
  {
    id: 3,
    title: "Community Climate Awareness Workshop",
    organization: "EcoFuture Initiative",
    duration: "2 Days (Dec 5–6)",
    location: "Kisumu, Kenya",
    category: "Climate Education",
    description:
      "Facilitate workshops that teach communities about renewable energy and sustainable living practices.",
    image: "/src/images/placeholder.png",
  },
];

// Badges
export const badgesData = [
  {
    name: "Environmentalist",
    levelIcon: "🌱",
    requirement: "1–10 hours",
    description: "First steps in volunteering and environmental stewardship.",
  },
  {
    name: "Contributor",
    levelIcon: "🔆",
    requirement: "11–50 hours",
    description: "Actively involved in multiple environmental initiatives.",
  },
  {
    name: "Changemaker",
    levelIcon: "🌍",
    requirement: "51–100 hours",
    description: "Creating measurable community and ecological impact.",
  },
  {
    name: "Leader",
    levelIcon: "💫",
    requirement: "100+ hours",
    description: "Inspiring others to take environmental action.",
  },
];

// Default Profile Data
export const defaultProfile = {
  name: "Leila Omol",
  title: "Student Environmentalist | ALU Volunteer Enthusiast",
  bio: "Dedicated to creating a cleaner, greener, and more sustainable future through active community service.",
  hours: 40,
  completedActivities: 5,
  badges: ["Environmentalist", "Contributor"],
  avatar: "/src/images/placeholder.png",
  impactStats: {
    treesPlanted: 320,
    workshopsLed: 3,
    plasticCollectedKg: 85,
  },
  socials: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    x: "https://x.com/",
  },
};

// Contact Page
export const contactContent = {
  title: "Get in Touch",
  subtitle:
    "We’re here to help! Reach out anytime and we’ll respond as soon as possible.",
  socials: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    x: "https://x.com/",
  },
};

// Organization and Volunteer Profile Setup
export const organizationProfileContent = {
  title: "Organization Profile Setup",
  subtitle:
    "Share your mission and connect with volunteers who align with your cause.",
  fields: [
    { name: "name", label: "Organization Name", type: "text", required: true },
    { name: "mission", label: "Mission Statement", type: "textarea", required: true },
    { name: "contactEmail", label: "Contact Email", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: false },
    { name: "website", label: "Website (optional)", type: "url", required: false },
    { name: "description", label: "Description", type: "textarea", required: false },
  ],
  submitButton: "Save Profile",
  theme: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "text-blue-700",
    ring: "focus:ring-blue-500",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

export const volunteerProfileContent = {
  title: "Volunteer Profile Setup",
  subtitle:
    "Tell us about yourself, your skills, and how often you’d like to volunteer.",
  fields: [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "age", label: "Age", type: "number", required: false },
    {
      name: "availability",
      label: "Availability",
      type: "text",
      placeholder: "e.g. Weekends, 3 days a week",
      required: false,
    },
    {
      name: "skills",
      label: "Skills",
      type: "text",
      placeholder: "e.g. First Aid, Teaching, Communication",
      required: false,
    },
    { name: "contactEmail", label: "Email", type: "email", required: true },
    {
      name: "bio",
      label: "Short Bio",
      type: "textarea",
      placeholder: "Tell us a bit about yourself...",
      required: false,
    },
  ],
  submitButton: "Save Profile",
  theme: {
    bg: "bg-lime-50",
    border: "border-lime-100",
    title: "text-lime-700",
    ring: "focus:ring-lime-500",
    button: "bg-lime-600 hover:bg-lime-700",
  },
};
