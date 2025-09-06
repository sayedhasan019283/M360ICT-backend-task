import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import ms from 'ms';  // ms library for handling time durations

// Function to create a token
const createToken = (payload: object, secret: Secret, expireTime: string): string => {
  // Ensure the secret is a string or buffer
  if (typeof secret !== 'string' && !Buffer.isBuffer(secret)) {
    throw new Error("Invalid secret type. Expected a string or Buffer.");
  }

  // Convert the expireTime string to milliseconds using ms
  const expiresIn: number = ms(expireTime); // '1h', '2d', etc., will be converted to milliseconds

  // Create the token with the provided payload, secret, and options (expiresIn)
  const options: SignOptions = { expiresIn };  // expiresIn will be a number (in milliseconds)

  return jwt.sign(payload, secret, options);
};

// Function to verify a token
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  // Ensure the secret is a string or buffer
  if (typeof secret !== 'string' && !Buffer.isBuffer(secret)) {
    throw new Error("Invalid secret type. Expected a string or Buffer.");
  }

  // Verify the token with the provided secret
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = { createToken, verifyToken };
