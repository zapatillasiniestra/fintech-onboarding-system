import pool from "../db/db";
import type { ApplicationStats, ApplicationStatus,IdentityRequest,SortOrder } from "../types/application";
import repository from "../repositories/applications.repository";
import auditRepository from "../repositories/audit.repository";
import {addEmailJob} from "../jobs/email.queue";
import {AppError} from "../utils/AppError";
import {
  createIdentityProvider,
  createAIProvider
} from "../providers/ProviderFactory";
import aiAssessmentsRepository from "../repositories/ai-assessments.repository";

async function verifyIdentity(
    request: IdentityRequest
  ) {
  const identityProvider = createIdentityProvider();
  const verification = await identityProvider.verifyIdentity(request);

  return verification;
}

async function getApplications(
    userId: number,
    page: number = 1,
    limit: number = 10,
    status?: ApplicationStatus,
    search?: string,
    order?: SortOrder
  ) {
  const offset = (page - 1) * limit;

  const result =
    await repository.getApplications(
      userId,
      limit,
      offset,
      status as ApplicationStatus,
      search as string,
      order as SortOrder);

  return {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil( result.total / limit ),
    data: result.applications
  };
}

async function getAllApplications() {
    const applications =
      await repository.findAll();

    if (!applications) {
      throw new AppError(
        "applications not found",
        404
      );
    }

  return applications;
}

async function getApplicationsById(userId: number) {

    const application =
      await repository.findById(userId);

    if (!application) {
      throw new AppError(
        "application not found",
        404
      );
    }

  return application;
}

async function getStats(userId: number) {
  const application =
    await repository.getStats(userId);

  if (!application) {
    throw new AppError(
      "data not found",
      404
    );
  }

  const stats: ApplicationStats = {
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    approvalRate: 0
  };
  let approved = 0;
  let rejected = 0;

  for (const row of application) {
    stats[row.status as ApplicationStatus] = Number(row.total);
    if (row.status === "approved") {
      approved = Number(row.total);
    }

    if (row.status === "rejected") {
      rejected = Number(row.total);
    }
    if (approved + rejected > 0) {
      stats.approvalRate =
        approved / (approved + rejected) * 100;
    } else {
      stats.approvalRate = 0;
    }
  }

  return stats;
}

async function getRecents() {
  const result =
    await repository.getRecents();

  if (!result) {
    throw new AppError(
      "data not found",
      404
    );
  }

  return result;
}

async function createApplication(
  userId: number,
  full_name: string,
  email: string
) {
  const verification = await verifyIdentity({
    full_name,
    email
  });

  if (!verification.verified) {
    throw new AppError(
      "identity verification failed",
      400
    );
  }

  const aiProvider = createAIProvider();

  const assessment =
    await aiProvider.assessApplication({
      fullName: full_name,
      email,
      verification
    });

  const result = await repository.create({
    userId,
    fullName: full_name,
    email,
    verification
  });

  await aiAssessmentsRepository.create({
    applicationId: result.id,
    riskLevel: assessment.riskLevel,
    decision: assessment.decision,
    reasons: assessment.reasons,
    model: "mock"
  });

  return result;
}

async function updateStatus(
    applicationId: number,
    adminUserId: number,
    status: ApplicationStatus
  ) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const application =
      await repository.findByIdTx(
        client,
        applicationId
      );

    if (!application) {
      throw new AppError(
        "application not found",
        404
      );
    }

    const currentStatus = application.status as ApplicationStatus;

    if (
      currentStatus === "approved" ||
      currentStatus === "rejected"
    ) {
      throw new AppError(
        "application already finalized",
        400
      );
    }

    const allowedTransitions: Record<
        ApplicationStatus,
        ApplicationStatus[]
      > = {
      pending: ["under_review"],
      under_review: ["approved", "rejected"],
      approved: [],
      rejected: []
    };

    if (
      !allowedTransitions[currentStatus]
        .includes(status)
    ) {
      throw new AppError(
        "invalid status transition",
        400
      );
    }

    if (
      status === "approved" ||
      status === "rejected"
    ) {
      addEmailJob({
        email: application.email,
        fullName: application.full_name,
        status
      });
    }
    const updated =
      await repository.updateStatus(
        client,
        applicationId,
        status
      );

    await auditRepository.createLog(
      client,
      applicationId,
      adminUserId,
      status
    );

    await client.query("COMMIT");

    return updated;

  } catch (err: unknown) { 

    await client.query("ROLLBACK");
    throw err;

  } finally {

    client.release();

  }
}

export default {
  verifyIdentity,
  getApplications,
  getAllApplications,
  getApplicationsById,
  getStats,
  getRecents,
  createApplication,
  updateStatus
};