import { z } from "zod";
import { orderStates, serviceStatus } from "../types/enum/enums.type";

export const CreateOrderServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.number().positive("Value must be above zero"),
  status: z.enum(serviceStatus).default(serviceStatus.PENDING),
});

export const CreateOrderDTO = z.object({
    lab: z.string().min(1, "Lab is required"),
    patient: z.string().min(1, "Patient is required"),
    customer: z.string().min(1, "Customer is required"),
    services: z.array(CreateOrderServiceSchema)
    .min(1, "At least one service is required")
    .refine(
      services => services.reduce((total, service) => total + service.value, 0) > 0,
      { message: "Total value of services must be greater than 0" }
    ),
})

export const fecthOrdersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    // .transform para converter string em number e ja deixa valor padrao caso venha undefined
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    // .transform para converter string em number e ja deixa valor padrao caso venha undefined
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  state: z.enum(orderStates).optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDTO>;
export type FetchOrderQueryDto = z.infer<typeof fecthOrdersQuerySchema>;
export type CreateOrderServiceSchema = z.infer<typeof CreateOrderServiceSchema>;


