import React from 'react';
import { useRouter } from 'next/navigation';
import { Text, Stack, Button, TextInput, PasswordInput, Anchor } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconUser } from '@tabler/icons-react'
import { toast } from 'react-hot-toast';

import client from '@/lib/client';

export const Login = ({
    toggleVisible
}: {
    toggleVisible: () => void
}) => {
    const router = useRouter();

    const form = useForm({
        initialValues: { username: '', password: '' }
    });

    const handleSubmit = (values: typeof form.values) => {
        
        const promise = new Promise(async (resolve, reject) => {

            const result = await client.auth.login.post({
                username: values.username,
                password: values.password
            });

            if (!result.error) {
                localStorage.setItem('auth', JSON.stringify(result.data));

                resolve('');
                await new Promise((resolve) => setTimeout(resolve, 1000));

                router.push('/app');
                return;
            }

            if (result.status === 401) {
                reject('Invalid username or password');
                return;
            }

            reject('Something went wrong');
        });

        toast.promise(promise, {
            loading: 'Logging in...',
            success: 'Logged in',
            error: (error) => error
        });
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>

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
                    placeholder='Username'
                    spellCheck={false}
                    rightSection={<IconUser stroke={1.5} size={20} />}
                    key={form.key('username')}
                    {...form.getInputProps('username')}
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