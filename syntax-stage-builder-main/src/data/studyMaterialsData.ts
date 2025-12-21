export type MaterialType = 'PDF' | 'Ebook' | 'Notes' | 'Video' | 'Other';
export type MaterialCategory = 'Programming' | 'Web Development' | 'Mobile Development' | 'Data Science' | 'System Design' | 'Algorithms' | 'Database' | 'DevOps' | 'Other';

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  category: MaterialCategory;
  language?: string; // Programming language if applicable
  fileUrl: string;
  fileSize: string; // e.g., "2.5 MB"
  thumbnailUrl?: string;
  uploadDate: string;
  isActive: boolean;
  isFeatured: boolean;
  downloadCount: number;
  tags: string[];
  uploadedBy: string; // Admin username
}

// Initial study materials data (will be managed by admin)
export let studyMaterialsData: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Python Programming Complete Guide',
    description: 'Comprehensive guide covering Python basics to advanced topics including OOP, data structures, and web development.',
    type: 'PDF',
    category: 'Programming',
    language: 'Python',
    fileUrl: '/materials/python-complete-guide.pdf',
    fileSize: '5.2 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-e4001080f687?w=400&h=300&fit=crop',
    uploadDate: '2024-01-15',
    isActive: true,
    isFeatured: true,
    downloadCount: 1250,
    tags: ['Python', 'Programming', 'Beginner', 'Advanced'],
    uploadedBy: 'Admin'
  },
  {
    id: 'mat-2',
    title: 'JavaScript ES6+ Handbook',
    description: 'Modern JavaScript features including arrow functions, destructuring, async/await, and more.',
    type: 'Ebook',
    category: 'Web Development',
    language: 'JavaScript',
    fileUrl: '/materials/javascript-es6-handbook.epub',
    fileSize: '3.8 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',
    uploadDate: '2024-01-10',
    isActive: true,
    isFeatured: true,
    downloadCount: 980,
    tags: ['JavaScript', 'ES6', 'Web Development'],
    uploadedBy: 'Admin'
  },
  {
    id: 'mat-3',
    title: 'Data Structures and Algorithms Notes',
    description: 'Detailed notes on common data structures and algorithms with examples and complexity analysis.',
    type: 'Notes',
    category: 'Algorithms',
    fileUrl: '/materials/dsa-notes.pdf',
    fileSize: '4.1 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    uploadDate: '2024-01-08',
    isActive: true,
    isFeatured: false,
    downloadCount: 750,
    tags: ['DSA', 'Algorithms', 'Data Structures'],
    uploadedBy: 'Admin'
  }
];

// Helper function to update materials (for admin use)
export const updateStudyMaterials = (materials: StudyMaterial[]) => {
  studyMaterialsData = materials;
};


