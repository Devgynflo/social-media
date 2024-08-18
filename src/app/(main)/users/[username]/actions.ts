"use server";

import { getUserDataSelect } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("unauthorized");

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}
