import { PaginatedResponse } from "../types/pagination.types";

export async function paginate<T>(
  model: any,
  options: {
    filter?: Record<string, any>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
): Promise<PaginatedResponse<T>> {
  const {
    filter = {},
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
  } = options;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit).sort(sort),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}