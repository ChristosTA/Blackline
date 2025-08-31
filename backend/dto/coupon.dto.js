import { z } from "zod";

export const ValidateCouponDto = z.object({
  code: z.string().trim().min(3),
});
