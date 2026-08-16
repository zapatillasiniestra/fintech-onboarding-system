import pool from "../db/db";
import type { AIAssessment } from "../types/ai-assessments";
import type { AIRiskLevel } from "../types/ai-assessments";
import type { Decision } from "../types/application";

interface CreateAIAssessmentData {
  applicationId: number;
  riskLevel: AIRiskLevel;
  decision: Decision;
  reasons: string[];
  model: string;
}

async function create(
  data: CreateAIAssessmentData
): Promise<AIAssessment> {
  const result = await pool.query(
    `
    INSERT INTO ai_assessments (
      application_id,
      risk_level,
      decision,
      reasons,
      model
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      data.applicationId,
      data.riskLevel,
      data.decision,
      JSON.stringify(data.reasons),
      data.model
    ]
  );

  return result.rows[0];
}

async function findByApplicationId(
  applicationId: number
): Promise<AIAssessment[]> {
  const result = await pool.query(
    `
    SELECT *
    FROM ai_assessments
    WHERE application_id = $1
    ORDER BY created_at DESC
    `,
    [applicationId]
  );

  return result.rows;
}

export default {
  create,
  findByApplicationId
};