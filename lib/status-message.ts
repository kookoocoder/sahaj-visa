import { QUEUE_STATS } from "@/lib/constants";

export function buildEtaMessage() {
  const facts = QUEUE_STATS;
  return `Current mocked queue: about ${facts.medianDays} days at the median (${facts.p50}–${facts.p90} day range). ${facts.similarShare}% of applications this month in this prototype’s seed data finished in a similar window. The five-year official average of ${facts.pctCleared72hOfficialFiveYear}% in 72 hours is not what this month looks like (${facts.pctCleared72hThisMonthMock}% in 72 hours in the mock). This is not a promise.`;
}
