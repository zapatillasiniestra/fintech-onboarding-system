export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

export interface Application {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  status: ApplicationStatus;
  createdAt: Date;
}

export interface ApplicationStats {
  pending: number;
  under_review: number;
  approved: number;
  rejected: number;
  approvalRate: number;
}

export interface VerificationResult {
  verified: boolean;
  confidence: number;
  provider: string;
  reason?: string;
  raw?: unknown;
}

export type UserRole = "user" | "admin";

export type SortOrder = "asc" | "desc";

export interface AuthUser {
  userId: number;
  email: string;
  role: UserRole;
}

export interface EmailJob {
  email: string;
  fullName: string;
  status: ApplicationStatus;
}