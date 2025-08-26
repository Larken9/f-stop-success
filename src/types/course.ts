// Sanity image type
export interface SanityImage {
  asset: {
    _ref: string;
    _type: string;
  };
  alt?: string;
}

// Portable Text type for rich content
export interface PortableTextBlock {
  _type: string;
  _key: string;
  children?: Array<{
    _type: string;
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: unknown[];
  style?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  instructor: {
    _id: string;
    name: string;
    image?: SanityImage;
  };
  price: number;
  difficulty: string;
  category: string;
  featuredImage?: SanityImage;
  modules: Module[];
  publishedAt: string;
  moduleCount?: number;
}

export interface Module {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  moduleNumber: number;
  estimatedDuration: number;
  objectives: string[];
  featuredImage?: SanityImage;
  lessons: Lesson[];
  isPublished: boolean;
}

export interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  lessonNumber: number;
  videoUrl?: string;
  estimatedDuration: number;
  difficulty: string;
  introduction?: PortableTextBlock[];
  whatYoullCover?: PortableTextBlock[];
  mainTeachingPoints?: PortableTextBlock[];
  reviewAndOutcome?: PortableTextBlock[];
  nextSteps?: PortableTextBlock[];
  actionTask?: {
    title: string;
    instructions: PortableTextBlock[];
    estimatedTime: number;
    isPersonalTask: boolean;
  };
  additionalResources?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  featuredImage?: SanityImage;
  isPublished: boolean;
}

export interface UserProgress {
  _id?: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentModule?: string;
  overallProgress: number;
  lastAccessed: string;
  enrollmentDate: string;
}