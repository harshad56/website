export type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type ProjectCategory = "Web Development" | "Mobile Development" | "Data Science" | "Game Development" | "System Programming" | "DevOps" | "AI/ML" | "E-Commerce" | "Social Media" | "Productivity";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  thumbnailUrl: string;
  previewImages?: string[];
  category: ProjectCategory;
  language: string;
  difficulty: ProjectDifficulty;
  techStack: string[];
  features?: string[];
  rating: number;
  reviewCount: number;
  totalDownloads: number;
  isFeatured: boolean;
  isActive: boolean;
  downloadUrl: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Purchase {
  id: string;
  projectId: string;
  userId: string;
  email: string;
  amount: number;
  currency: string;
  paymentId: string;
  status: "pending" | "completed" | "failed";
  downloadToken: string;
  downloadedAt?: Date;
  purchasedAt: Date;
}

export interface PaymentRequest {
  projectId: string;
  userName: string;
  userEmail: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  qrCodeUrl?: string;
  paymentId?: string;
  transactionId?: string;
  downloadToken?: string;
}
