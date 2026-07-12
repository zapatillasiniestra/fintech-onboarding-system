const pool=require("../db/db.js");
const repository=require("../repositories/applications.repository");
const auditRepository=require("../repositories/audit.repository");
const {addEmailJob}=require("../jobs/email.queue");
const AppError=require("../utils/AppError");

async function getApplications(userId, page = 1, limit = 10, status, search, order) {
  const offset = (page - 1) * limit;

  const result =
    await repository.getApplications(userId, limit, offset, status, search, order);

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

  return result.rows;
}

async function getApplicationsById(userId) {

    const application =
      await repository.findById(userId);

    if (!application) {
      throw new AppError(
        "application not found",
        404
      );
    }

  return result.rows;
}

async function getStats(userId) {
  const application =
    await repository.getStats(userId);

  if (!application) {
    throw new AppError(
      "data not found",
      404
    );
  }

  let stats = {};
  let approved = 0;
  let rejected = 0;

  for (const row of application.rows) {
    stats[row.status] = Number(row.total);
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

  return result.rows;
}

async function createApplication(userId, full_name, email) {
  const result =
    await repository.create(userId, full_name, email);

  if (!result) {
    throw new AppError(
      "data not found",
      404
    );
  }

  return result.rows[0];
}

async function updateStatus(applicationId, adminUserId, status) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const application =
      await repository.findById(
        client,
        applicationId
      );

    if (!application) {
      throw new AppError(
        "application not found",
        404
      );
    }

    const currentStatus = application.status;

    if (
      currentStatus === "approved" ||
      currentStatus === "rejected"
    ) {
      throw new AppError(
        "application already finalized",
        400
      );
    }

    const allowedTransitions = {
      pending: ["under_review"],
      under_review: [
        "approved",
        "rejected"
      ],
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
      currentStatus === "approved" ||
      currentStatus === "rejected"
    ) {
      addEmailJob({
        email: application.email,
        fullName: application.full_name,
        currentStatus
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

  } catch (err) {

    await client.query("ROLLBACK");
    throw err;

  } finally {

    client.release();

  }
}

module.exports = {
  getApplications,
  getAllApplications,
  getApplicationsById,
  getStats,
  getRecents,
  createApplication,
  updateStatus
};
