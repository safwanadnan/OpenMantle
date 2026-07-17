/**
 * Normalizes subscription amounts to a monthly basis for MRR calculations.
 *
 * Rules (from Shopify App Managed Pricing / mantle-brain):
 *  - EVERY_30_DAYS → amount passes through unchanged
 *  - ANNUAL → amount ÷ 12
 *  - Only *permanent* discounts reduce the baseline MRR:
 *      permanent = discountEndsAt is null AND originalDiscountCycles is null
 *  - Temporary discounts (time-limited or cycle-limited) do NOT reduce MRR
 */

export interface DiscountInput {
  percentage: number | null;
  fixedAmount: string | null;
  discountEndsAt: string | null;
  originalDiscountCycles: number | null;
}

export function computeMonthlyAmount(
  amount: string,
  billingPeriod: string,
  discount: DiscountInput | null,
): number {
  let raw = Number(amount);
  if (!Number.isFinite(raw) || raw < 0) raw = 0;

  // Apply discount only if it is permanent
  if (discount) {
    const isPermanent = discount.discountEndsAt === null && discount.originalDiscountCycles === null;
    if (isPermanent) {
      if (discount.percentage !== null && discount.percentage > 0) {
        raw = raw * (1 - discount.percentage / 100);
      } else if (discount.fixedAmount !== null) {
        raw = Math.max(0, raw - Number(discount.fixedAmount));
      }
    }
    // Temporary/cycle-limited discounts: leave raw unchanged
  }

  if (billingPeriod === "ANNUAL") {
    return raw / 12;
  }
  // EVERY_30_DAYS or anything else
  return raw;
}

/** Given a period preset string, return { start, end } as Date objects. */
export function resolvePeriod(period: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);

  switch (period) {
    case "last_7_days":
      start.setDate(start.getDate() - 7);
      break;
    case "last_30_days":
      start.setDate(start.getDate() - 30);
      break;
    case "last_90_days":
      start.setDate(start.getDate() - 90);
      break;
    case "last_12_months":
      start.setMonth(start.getMonth() - 12);
      break;
    case "all_time":
      start.setFullYear(2000, 0, 1);
      break;
    default:
      // Fallback: last 30 days
      start.setDate(start.getDate() - 30);
  }

  return { start, end };
}

/** Generate evenly spaced bucket start times between start and end. */
export function generateBuckets(start: Date, end: Date, interval: "day" | "week" | "month"): Date[] {
  const buckets: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    buckets.push(new Date(current));
    if (interval === "day") {
      current.setDate(current.getDate() + 1);
    } else if (interval === "week") {
      current.setDate(current.getDate() + 7);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
  }
  return buckets;
}
