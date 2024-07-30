import { Metadata, NextPage } from 'next'
import Image from 'next/image'

import signInImg from '@/assets/login-image.jpg'
import Link from 'next/link'
import { SignInForm } from './_components/sign-in-form'

export const metadata: Metadata = {
    title: 'Login',
}

interface SignInPageProps {}

const SignInPage: NextPage<SignInPageProps> = ({}) => {
  return <div className='flex h-screen items-center justify-center p-5'>
    <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card shadow-2xl">
        <div className='md:w-1/2 w-full space-y-10 overflow-y-auto p-10'>
            <div className="space-y-1 text-center">
                <h1 className='tex-3xl font-bold'>Inscription Social Media</h1>
                <p className="text-muted-foreground">
                    Connectez-vous pour <span className='italic'>profiter</span> de toutes les fonctionnalités de notre site.
                </p>
            </div>
            <div className="space-y-5">
                <SignInForm />
            </div>
            <Link href={'/signup'} className='block text-center hover:underline'>Aucun compte. Créer un compte</Link>
        </div>
        <Image src={signInImg} alt="login" className='w-1/2 hidden md:block object-cover' />
    </div>
  </div>
}

export default SignInPage