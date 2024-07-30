"use server";

import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
// @ts-ignore
import { hash } from "@node-rs/argon2";
import { equal } from "assert";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error?: string }> {
  try {
    const { email, password, username } = signUpSchema.parse(credentials);
    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2, 
        outputLen: 32,
        parallelism:1
    });
    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive',
            },
        }
    })

    if (existingUsername) {
        return { error: "Ce nom d'utilisateur existe déjà" };
    }

    const existingEmail = await prisma.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: 'insensitive',
            },
        }
    })

    if (existingEmail) {
        return { error: "Cet email existe déjà" };
    }

    await prisma.user.create({
        data: {
            id: userId,
            username,
            email,
            passwordHash,
            displayName: username
        }
    })

    const session = await lucia.createSession(userId, {});
    const sessionCookie=  lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);


    return redirect('/');

    
  } catch (error) {
    if(isRedirectError(error)) throw error; 
    console.log("error signUp Action", error);
    return { error: "Quelque chose s'est mal passé.Veuillez réessayer ." };
  }
}
