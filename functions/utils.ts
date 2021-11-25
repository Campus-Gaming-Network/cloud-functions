import { customAlphabet } from "nanoid";
import bcrypt = require("bcrypt");
import { NANO_ALPHABET, NANO_ID_LENGTH, SALT_ROUNDS } from "./constants";

// Returns a callable function
export const nanoid = customAlphabet(NANO_ALPHABET, NANO_ID_LENGTH);

export const shallowEqual = (
  object1: { [key: string]: unknown },
  object2: { [key: string]: unknown }
): boolean => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};

export const changeLog = (prev: string, curr: string): string =>
  `${prev} -> ${curr}`;

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);

export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => await bcrypt.compare(password, hash);
