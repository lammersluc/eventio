'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Stack, Button, TextInput, PasswordInput, Anchor, Progress } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconUser, IconMail } from '@tabler/icons-react'
import { toast } from 'react-hot-toast';
import { zxcvbn } from '@zxcvbn-ts/core';

import client from '@/lib/client';

export const Register = ({
    toggleVisible
} : {
    toggleVisible: () => void
}) => {
    const router = useRouter();

    const form = useForm({
        initialValues: { username: '', email: '', password: '' },
        validate: {
            username: (value) => /^[a-z0-9_]{3,16}$/.test(value) ? null
                : '3-16 characters (a-z, 0-9, _)',
            email: (value) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(value) ? null
                : 'Invalid email',
            password: (value) => zxcvbn(value).score > 2 ? null
                : 'Password not strong enough'
        }
    });

    const handleSubmit = (values: typeof form.values) => {

        const promise = new Promise(async (resolve, reject) => {

            const result = await client.auth.register.post({
                username: values.username,
                email: values.email,
                password: values.password
            });

            if (!result.error) {
                localStorage.setItem('auth', JSON.stringify(result.data));

                resolve('');

                await new Promise((resolve) => setTimeout(resolve, 1000));

                router.push('/');
                return;
            }

            if (result.error.status === 409) {

                const conflicts = result.error.value;

                form.setErrors({
                    username: conflicts.includes('username') ? 'Username already exists' : null,
                    email: conflicts.includes('email') ? 'Email already exists' : null
                })

                const text = conflicts.join(' and ');

                reject(text.charAt(0).toUpperCase() + text.slice(1) + ' already exist' + (conflicts.length === 1 ? 's' : ''));
                return;
            }

            reject('Something went wrong');

        });

        toast.promise(promise, {
            loading: 'Registering...',
            success: 'Registered',
            error: (error) => error
        });
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Stack
                p='xl'
                gap='lg'
                align='center'
            >
                <Text fw={600} size='xl'>
                    Register
                </Text>

                <TextInput
                    variant='filled'
                    size='md'
                    placeholder='Username'
                    spellCheck={false}
                    rightSection={<IconUser stroke={1.5} size={20}/>}
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                />

                <TextInput
                    variant='filled'
                    size='md'
                    placeholder='Email'
                    spellCheck={false}
                    rightSection={<IconMail stroke={1.5} size={20}/>}
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />

                <Stack
                    w='100%'
                    gap={3}
                >
                    <PasswordInput
                        variant='filled'
                        size='md'
                        placeholder='Password'
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />
                    <Progress
                        value={zxcvbn(form.values.password).score * 25}
                        color={zxcvbn(form.values.password).score < 3 ? 'red' : 'blue'}
                        size={4}
                        radius='xl'
                    />
                </Stack>

                <Button
                    type='submit'
                    fullWidth
                >
                    Register
                </Button>

                <Anchor
                    onClick={toggleVisible}
                >
                    Already have an account?
                </Anchor>
            </Stack>

        </form>
    );
}