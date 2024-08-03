"use client";

import { signUpSchema, SignUpValues } from '@/lib/validation';
import { NextPage } from 'next'
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { CustomFormField } from '@/components/custom-form-field';
import { FormFieldType } from '@/@types';
import { Form } from '@/components/ui/form';
import { useState, useTransition } from 'react';
import { signUp } from '../actions';
import { LoadingButton } from '@/components/loading-button';

interface SignUpFormProps {}

export const SignUpForm: NextPage<SignUpFormProps> = ({}) => {
    const [error,setError] = useState<string>()
    const [isPending, startTransition] = useTransition();

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    });

    async function onSubmit(values:SignUpValues) {
        setError(undefined)
        startTransition(async () => {
            const {error} = await signUp(values);
            if (error) {
                setError(error)
            }
        })
    }


  return <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        {error && <p className='text-center text-destructive'>{error}</p>}
        <CustomFormField control={form.control} name='username' fieldType={FormFieldType.INPUT} label='Username' placeholder='Username' />
        <CustomFormField control={form.control} name='email' fieldType={FormFieldType.INPUT} label='Email' placeholder='Email' />
        <CustomFormField control={form.control} name='password' fieldType={FormFieldType.PASSWORD} label='Password' placeholder='********'  />
        <LoadingButton type='submit' className='w-full' loading={isPending}>S&apos;inscrire</LoadingButton>
    </form>
  </Form>
}

