import {
  GraduationCap,
  FileText,
  HelpCircle,
  CalendarClock,
} from 'lucide-react'

export const features = [
  {
    id: 'summary',
    title: 'Notes Summarizer',
    description:
      'Paste any study notes and get a clean, concise summary with the key points and takeaways you need to remember.',
    icon: FileText,
    toolPath: '/tools?tool=summarizer',
    benefits: [
      'Instant condensing of long notes',
      'Key takeaways pulled out for you',
      'Great for quick revision before exams',
    ],
  },
  {
    id: 'quiz',
    title: 'Quiz Generator',
    description:
      'Turn any topic into a practice quiz with multiple-choice questions. Test yourself and see your score instantly.',
    icon: HelpCircle,
    toolPath: '/tools?tool=quiz',
    benefits: [
      'Generate quizzes on any topic',
      'Choose Easy, Medium, or Hard difficulty',
      'Instant scoring with correct answers',
    ],
  },
  {
    id: 'planner',
    title: 'Study Planner',
    description:
      'Organize your study schedule with tasks, priorities, and due dates. Stay on track and never miss a deadline.',
    icon: CalendarClock,
    toolPath: '/tools?tool=planner',
    benefits: [
      'Create and track study tasks',
      'Prioritize with easy filters',
      'Everything saved to your browser',
    ],
  },
  {
    id: 'assistant',
    title: 'AI Study Assistant',
    description:
      'Ask any academic or programming question and get a helpful, detailed explanation from your personal AI tutor.',
    icon: GraduationCap,
    toolPath: '/tools?tool=assistant',
    benefits: [
      '24/7 access to a virtual tutor',
      'Covers programming and study topics',
      'Clear, beginner-friendly explanations',
    ],
  },
]

export const steps = [
  {
    number: '01',
    title: 'Add your study material',
    description:
      'Paste your notes, pick a topic, or list your tasks. StudyMate AI accepts whatever you are working on.',
  },
  {
    number: '02',
    title: 'Choose an AI tool',
    description:
      'Summarize notes, generate a quiz, plan your study time, or chat with the AI assistant.',
  },
  {
    number: '03',
    title: 'Learn and practice',
    description:
      'Review the output, take the quiz, track your progress, and master your subject faster.',
  },
]

export const benefits = [
  {
    title: 'Save Time',
    description:
      'Summaries and quizzes cut your revision time dramatically so you can focus on understanding.',
  },
  {
    title: 'Learn Actively',
    description:
      'Quizzes and practice questions help you retain information far better than passive reading.',
  },
  {
    title: 'Stay Organized',
    description:
      'A clear study plan keeps your subjects, tasks, and deadlines in one tidy place.',
  },
  {
    title: 'Always Available',
    description:
      'Your AI study assistant is ready 24/7 — whenever a question pops into your head.',
  },
]
