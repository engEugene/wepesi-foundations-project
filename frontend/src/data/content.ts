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
    title: "Tree Planting for Greener Kigali",
    organization: "EcoServe Rwanda",
    duration: "1 Day (Nov 15)",
    location: "Nyandungu Urban Wetland Park, Kigali",
    category: "Environment",
    description:
      "Join fellow students and local youth in restoring Kigali’s green spaces by planting indigenous trees and promoting urban biodiversity. Tools and refreshments will be provided.",
  },
  {
    id: 2,
    title: "Waste Sorting and Recycling Workshop",
    organization: "Clean City Initiative",
    duration: "3 Days (Nov 20–22)",
    location: "Kacyiru Sector, Kigali",
    category: "Sustainability",
    description:
      "Help raise awareness about proper waste management by teaching sorting techniques and creating recyclable art projects for local schools.",
  },
  {
    id: 3,
    title: "Tutoring Underprivileged Students",
    organization: "Bright Minds Rwanda",
    duration: "2 Weeks (Dec 1–14)",
    location: "Gatsata Community Center, Kigali",
    category: "Education",
    description:
      "Volunteer as a tutor to support primary school learners in literacy and numeracy. Training and materials will be provided before sessions begin.",
  },
  {
    id: 4,
    title: "Community Health Awareness Drive",
    organization: "Wellbeing for All",
    duration: "1 Week (Dec 5–12)",
    location: "Nyarugenge District, Kigali",
    category: "Health",
    description:
      "Collaborate with local health volunteers to raise awareness on hygiene, nutrition, and preventive care. Great for students interested in healthcare and public health.",
  },
  {
    id: 5,
    title: "Lake Muhazi Cleanup Challenge",
    organization: "Green Youth Movement",
    duration: "1 Day (Dec 10)",
    location: "Lake Muhazi Shoreline, Kigali Outskirts",
    category: "Environment",
    description:
      "Spend a day with an energetic team cleaning up the lakeshore to protect aquatic life and restore natural beauty. Transportation and lunch included.",
  },
  {
    id: 6,
    title: "Tech for Sustainability Hackathon",
    organization: "Innovate Rwanda",
    duration: "3 Days (Jan 10–12)",
    location: "KLab Innovation Hub, Kigali",
    category: "Technology",
    description:
      "Join other innovators in designing digital tools and solutions for sustainability challenges in Kigali. No prior coding experience required.",
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
  photo: "/src/images/placeholder.png",
  name: "Leila Omol",
  title: "Student Environmentalist | ALU Volunteer Enthusiast",
  bio: "Dedicated to creating a cleaner, greener, and more sustainable future through active community service.",
  school: "African Leadership University",
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
