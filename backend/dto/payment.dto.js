import { z } from "zod";

const CheckoutLine = z.object({
  _id: z.string().regex(/^[a-f0-9]{24}$/i).optional(),  // optional if comes from FE
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid product id").optional(), // metadata uses id
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().int().min(1),
  image: z.string().url().or(z.string().min(1)).optional(), // URL or base64 string
});

export const CreateCheckoutSessionDto = z.object({
  products: z.array(CheckoutLine).nonempty(),
  couponCode: z.string().trim().min(3).optional(),
});
