import crypto from "crypto";

import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generatePasswordResetToken = async (email: string) => {

    // get the token from the uuidv4 function
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    // check if there is an existing token for the email
    const existingToken = await getPasswordResetTokenByEmail(email);

    // if there is an existing token, delete it from the database
    if (existingToken) {
      await db.passwordResetToken.delete({
        where: { id: existingToken.id }
      });
    }

    // generate a new token and save it to the database
    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    return passwordResetToken;
  }

  export const generateTwoFactorToken = async (email: string) => {
    // generate a 6 digit token from the crypto.randomInt function
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    // set token expiration in 15 minutes
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

    // check if there is an existing token for the email
    const existingToken = await getTwoFactorTokenByEmail(email);

    // if there is an existing token, delete it from the database
    if (existingToken) {
      await db.twoFactorToken.delete({
        where: {
          id: existingToken.id,
        }
      });
    }

    // generate a new token and save it to the database
    const twoFactorToken = await db.twoFactorToken.create({
      data: {
        email,
        token,
        expires,
      }
    });

    return twoFactorToken;
  }


export const generateVerificationToken = async (email: string) => {

  // get the token from the uuidv4 function
const token = uuidv4();

  // expire the token in 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // check if there is an existing token for the email
  const existingToken = await getVerificationTokenByEmail(email);

  // if there is an existing token, delete it from the database
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // generate a new token and save it to the database
  const verficationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return verficationToken;
};
