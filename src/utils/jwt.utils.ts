import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface payloadType {
    sub: string;
    email: string;
}

export class JwtService {
  generate(payload: payloadType): string {
    return jwt.sign(payload, config.jwt_secret, {
      expiresIn: config.jwt_expires_in,
    } as jwt.SignOptions);
  }

  verify(token: string): payloadType {
    return jwt.verify(token, config.jwt_secret) as payloadType;
  }
}