"use server";

import prisma from "@/lib/prisma";
import { signInSchema, SignInValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
//@ts-ignore
import {verify} from '@node-rs/argon2';
import { redirect } from "next/navigation";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function login(credentials: SignInValues):Promise<{error?: string}> {
    try {
       const {username, password} = signInSchema.parse(credentials);
       const existingUser = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive',
            },
        }
    })

    if(!existingUser || !existingUser.passwordHash) {
        return { error: "Cet utilisateur n'existe pas ou son mot de passe n'est pas valide" };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
        memoryCost: 19456,
        timeCost: 2, 
        outputLen: 32,
        parallelism:1
    });

    if(!validPassword) {
        return { error: "Cet utilisateur n'existe pas ou son mot de passe n'est pas valide" };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie=  lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return redirect('/');
       
       
    } catch (error) {
         if(isRedirectError(error)) throw error; 
        console.log("error signIn Action", error);
        return { error: "Quelque chose s'est mal passé.Veuillez réessayer ." };
    }

}