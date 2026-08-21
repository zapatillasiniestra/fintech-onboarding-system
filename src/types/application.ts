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

export interface IdentityRequest {
  full_name: string;
  email: string;
}

export interface IdentityVerification {
  verified: boolean;
  confidence: number;
  provider: string;
  decision?: Decision;
  externalId: string | undefined;
  reasons: string[];
  raw: Record<string, unknown>;
}

export interface CreateApplicationData {
  userId: number;
  fullName: string;
  email: string;
  verification: IdentityVerification;
}

export type UserRole = "user" | "admin";

export type Decision = "approved" | "rejected" | "manual_review";

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

