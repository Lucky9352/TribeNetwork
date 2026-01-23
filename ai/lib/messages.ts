/**
 * @file messages.ts
 * @description Pre-written message templates and responses for the TribeAI chat.
 * Contains curated Q&A content and welcome messages that encourage community engagement.
 */

/** Pre-written answers mapped by question text */
const questionAnswers: Record<string, string> = {
  'Looking for internships at startups': `🚀 Several startups are actively hiring interns from our campus! Current openings include roles in AI, web development, and product management.

💼 Recent Placements:
Riya Sharma - Product Intern at Razorpay
LinkedIn: linkedin.com/in/riyasharma25

Arjun Patel - SDE Intern at Zerodha
LinkedIn: linkedin.com/in/arjunpatel24

💬 Active Discussions:
Tech Startup Fair 2024 - 15 responses
Remote Internship Tips - 8 new replies
Stipend Negotiations - Updated today

👋 Join our startup internship group on Tribe Community!`,

  'How to prepare for Google interviews?': `💻 Recent Google hires focused on system design and algorithmic problems. Daily practice on LeetCode and mock interviews were key success factors.

🎯 Success Stories:
Priya Mehta - SDE II at Google
LinkedIn: linkedin.com/in/priyamehta24

Karan Shah - Software Engineer at Google
LinkedIn: linkedin.com/in/karanshah23

💬 Trending Topics:
Google Interview Guide - 25 responses
DSA Study Group - Daily updates
Mock Interview Slots - 5 openings

🚀 Connect with Google alumni on Tribe Community for personalized guidance!`,

  'Best cafes for group study?': `☕ The new Coffee House near Block B and Library Cafe are popular spots! Both offer student discounts, fast WiFi, and quiet zones for focused study sessions.

💬 Recent Reviews:
Coffee House Study Guide - 12 tips
WiFi Speed Comparison - Updated
Student Discount List - New deals

📚 Share your favorite study spots on Tribe Community!`,
}

/** Default response when no pre-written answer is found */
const DEFAULT_RESPONSE =
  '👋 This would be a great question to ask on Tribe Community! Our active community of students and alumni can share their experiences and advice.'

/**
 * Retrieves a pre-written answer for a given question.
 * @param question - The question text to look up
 * @returns The pre-written answer or a default community prompt
 */
export function getQuestionAnswer(question: string): string {
  return questionAnswers[question] || DEFAULT_RESPONSE
}

/** Array of welcome messages for random selection */
const welcomeMessages: readonly string[] = [
  '👋 Welcome to Tribe AI! I can help you find answers from our community or guide you to post your questions on Tribe Community.',
  "✨ Hi there! I'm here to connect you with peer experiences and answers from our Tribe Community forum.",
  '🌟 Hello! Let me help you discover insights from fellow students and alumni on Tribe Community.',
] as const

/**
 * Returns a random welcome message for the chat interface.
 * @returns A randomly selected welcome message
 */
export function getRandomWelcomeMessage(): string {
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length)
  return welcomeMessages[randomIndex]
}
