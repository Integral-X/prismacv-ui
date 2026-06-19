export const COURSE_CATEGORIES = [
  "All",
  "UI Design",
  "UX Research",
  "React",
  "Coding",
  "Animation",
  "Product Management",
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];

export interface CourseSuggestion {
  id: string;
  title: string;
  author: string;
  rating: number;
  ratingCount: string;
  durationHours: number;
  platform: string;
  categories: Exclude<CourseCategory, "All">[];
  priceLabel: string;
  paceLabel: string;
}

export const MOCK_COURSE_SUGGESTIONS: CourseSuggestion[] = [
  {
    id: "course-1",
    title: "Practical Wireframing for Product Designers",
    author: "Sarah Johnson",
    rating: 4.6,
    ratingCount: "12.3k",
    durationHours: 8,
    platform: "Udemy",
    categories: ["UI Design", "UX Research"],
    priceLabel: "Free",
    paceLabel: "Self-paced",
  },
  {
    id: "course-2",
    title: "Practical Wireframing for Product Designers",
    author: "Sarah Johnson",
    rating: 4.6,
    ratingCount: "12.3k",
    durationHours: 8,
    platform: "Udemy",
    categories: ["UI Design"],
    priceLabel: "Free",
    paceLabel: "Self-paced",
  },
  {
    id: "course-3",
    title: "Practical Wireframing for Product Designers",
    author: "Sarah Johnson",
    rating: 4.6,
    ratingCount: "12.3k",
    durationHours: 8,
    platform: "Udemy",
    categories: ["Product Management"],
    priceLabel: "Free",
    paceLabel: "Self-paced",
  },
  {
    id: "course-4",
    title: "React for Designers: Component Systems",
    author: "Maya Chen",
    rating: 4.8,
    ratingCount: "8.1k",
    durationHours: 12,
    platform: "Udemy",
    categories: ["React", "Coding"],
    priceLabel: "Free",
    paceLabel: "Self-paced",
  },
  {
    id: "course-5",
    title: "Micro-interactions & UI Animation",
    author: "Leo Martins",
    rating: 4.5,
    ratingCount: "5.4k",
    durationHours: 6,
    platform: "Udemy",
    categories: ["Animation", "UI Design"],
    priceLabel: "Free",
    paceLabel: "Self-paced",
  },
  {
    id: "course-6",
    title: "UX Research Methods in Practice",
    author: "Priya Nair",
    rating: 4.7,
    ratingCount: "9.2k",
    durationHours: 10,
    platform: "Udemy",
    categories: ["UX Research"],
    priceLabel: "Free",
    paceLabel: "Self-paced",
  },
];
