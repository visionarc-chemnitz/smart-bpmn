"use server";

import { auth } from "@/auth";
import prisma from "../../../lib/prisma";

export const updateUserName = async (id: string, name: string) => {
  const account = await prisma.user.update({
    where: { id },
    data: { name },
  });
  return account;
};

export const getUser = async (id: string) => {
  const account = await prisma.user.findUnique({
    where: { id },
  });
  return account;
};

export const getUserData = async () => {
  const session = await auth(); // Fetch user session
  return session?.user;
}