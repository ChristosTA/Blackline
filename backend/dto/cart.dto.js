import { z } from "zod";

export const AddToCartDto = z.object({
  productId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid product id"),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export const UpdateQuantityDto = z.object({
  quantity: z.coerce.number().int().min(0).max(99),
});
