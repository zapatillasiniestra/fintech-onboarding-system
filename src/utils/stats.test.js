const {
  calculateApprovalRate
} = require("./stats");

test(
  "returns 50 when approved and rejected are equal",
  () => {
    expect(
      calculateApprovalRate(1, 1)
    ).toBe(50);
  }
);

test(
  "returns 100 when all are approved",
  () => {
    expect(
      calculateApprovalRate(5, 0)
    ).toBe(100);
  }
);

test(
  "returns 0 when all are rejected",
  () => {
    expect(
      calculateApprovalRate(0, 5)
    ).toBe(0);
  }
);

test(
  "returns 0 when there are no decisions",
  () => {
    expect(
      calculateApprovalRate(0, 0)
    ).toBe(0);
  }
);
