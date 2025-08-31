import { z } from "zod";
export const ObjectIdDto = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid ObjectId"),
});
