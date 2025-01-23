"use server";

import prisma from "../../lib/prisma";

export const socialAccount = async (email: string)=> {
  const account = await prisma.account.findFirst({
    where: {
      user: {
        email: email,
      },
    },
    select: {
      user: true,
      provider: true,
    },
  });
  return account;
};