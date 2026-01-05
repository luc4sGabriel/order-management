import { IUser, IUserResponse } from "../types/user.type";
import { PaginatedResponse } from "../types/pagination.types";

export class userPresenter {
  static toHttp(user: IUser): IUserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toHttpList(
    paginated: PaginatedResponse<IUser>
  ): PaginatedResponse<IUserResponse> {
    return {
      data: paginated.data.map(userPresenter.toHttp),
      meta: paginated.meta,
    };
  }

}