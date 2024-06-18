'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Text, Stack, Button, TextInput, PasswordInput, Anchor } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconMail } from '@tabler/icons-react'

import { showNotification } from '@/lib/notification';
import client from '@/lib/client';

export default ({
    toggleVisible
}: {
    toggleVisible: () => void
}) => {
    const router = useRouter();

    const form = useForm({
        initialValues: { email: 'test@example.com', password: 'Test123!' },
        validate: {
            email: (value) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                .test(value) ? null : 'Invalid email',
            password: (value) => value.length > 0 ? null : 'Password is required'
        }
    });

    const handleSubmit = async (values: typeof form.values) => {
        const result = await client.auth.login.post({
            email: values.email,
            password: values.password
        });

        if (!result.error) {
            localStorage.setItem('auth', JSON.stringify(result.data));
            return router.push('/');
        }

        if (result.status === 401)
            return showNotification('error', 'Invalid email or password');

        return showNotification('error', 'An error occurred');
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>

            <Stack
                p='xl'
                gap='lg'
                align='center'
            >

                <Text fw={600} size='xl'>
                    Login
                </Text>

                <TextInput
                    variant='filled'
                    size='md'
                    placeholder='Email'
                    spellCheck={false}
                    rightSection={<IconMail stroke={1.5} size={20} />}
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />

                <PasswordInput
                    w='100%'
                    variant='filled'
                    size='md'
                    placeholder='Password'
                    spellCheck={false}
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />

                <Button
                    type='submit'
                    fullWidth
                >
                    Login
                </Button>

                <Anchor
                    onClick={toggleVisible}
                >
                    No account?
                </Anchor>

            </Stack>

        </form>
    );
}