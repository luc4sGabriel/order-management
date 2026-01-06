import bcrypt from "bcryptjs";
import { config } from "../config/env";

const SALT_ROUNDS = 6;

export const hash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const compare = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};