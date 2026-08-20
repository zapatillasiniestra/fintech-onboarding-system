import type { PoolClient } from "pg";
import identityRepository from "../repositories/identity-verifications.repository";

async function getIdentityChecks(
  client: PoolClient,
  applicationId: number
) {
  return identityRepository.findByApplicationId(
    client,
    applicationId
  );
}

export default {
  getIdentityChecks
};