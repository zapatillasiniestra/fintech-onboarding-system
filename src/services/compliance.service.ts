import type { PoolClient } from "pg";
import complianceRepository from "../repositories/compliance.repository";

async function getComplianceChecks(
  client: PoolClient,
  applicationId: number
) {
  return complianceRepository.findByApplicationId(
    client,
    applicationId
  );
}

export default {
  getComplianceChecks
};