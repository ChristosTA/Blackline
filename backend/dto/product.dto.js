import { z } from "zod";

export const CreateProductDto = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  category: z.enum(["jeans","t-shirts","shoes","glasses","jackets","suits","bags"]),
  image: z.string().min(1).optional().or(z.literal(""))
});

export const PatchProductFeaturedDto = z.object({
  isFeatured: z.coerce.boolean().optional()
});
