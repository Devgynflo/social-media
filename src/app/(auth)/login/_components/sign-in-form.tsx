"use client";

import { signInSchema,SignInValues } from '@/lib/validation';
import { NextPage } from 'next'
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { CustomFormField } from '@/components/custom-form-field';
import { FormFieldType } from '@/@types';
import { Form } from '@/components/ui/form';
import { useState, useTransition } from 'react';
import { login } from '../actions';
import { LoadingButton } from '@/components/loading-button';

interface SignInFormProps {}

export const SignInForm: NextPage<SignInFormProps> = ({}) => {
    const [error,setError] = useState<string>()
    const [isPending, startTransition] = useTransition();

    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            username: '',
            password: '',
        }
    });

    async function onSubmit(values:SignInValues) {
        setError(undefined)
        startTransition(async () => {
            const {error} = await login(values);
            if (error) {
                setError(error)
            }
        })
    }


  return <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        {error && <p className='text-center text-destructive'>{error}</p>}
        <CustomFormField control={form.control} name='username' fieldType={FormFieldType.INPUT} label='Username' placeholder='Username' />
        <CustomFormField control={form.control} name='password' fieldType={FormFieldType.PASSWORD} label='Password' placeholder='********'  />
        <LoadingButton type='submit' className='w-full' loading={isPending}>Se connecter</LoadingButton>
    </form>
  </Form>
}




