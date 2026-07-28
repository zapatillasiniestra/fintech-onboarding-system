function calculateApprovalRate(approved: number, rejected: number) {
  if (approved + rejected === 0) {
    return 0;
  }

  return approved / (approved + rejected) * 100;
}

export default calculateApprovalRate;

