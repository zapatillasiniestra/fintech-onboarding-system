function calculateApprovalRate(
  approved,
  rejected
) {
  if (approved + rejected === 0) {
    return 0;
  }

  return approved / (approved + rejected) * 100;
}

module.exports = {
  calculateApprovalRate
};
