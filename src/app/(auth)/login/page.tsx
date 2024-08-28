import { Metadata, NextPage } from "next";
import Image from "next/image";

import signInImg from "@/assets/login-image.jpg";
import Link from "next/link";
import { SignInForm } from "./_components/sign-in-form";
import { GoogleSignInButton } from "./_components/google-sign-in-button";

export const metadata: Metadata = {
  title: "Login",
};

interface SignInPageProps {}

const SignInPage: NextPage<SignInPageProps> = ({}) => {
  return (
    <div className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">
            Inscription Social Media
          </h1>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OU</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
          </div>

          <div className="space-y-5">
            <SignInForm />
          </div>
          <Link href={"/signup"} className="block text-center hover:underline">
            Aucun compte. Créer un compte
          </Link>
        </div>
        <Image
          src={signInImg}
          alt="login"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </div>
  );
};

export default SignInPage;
