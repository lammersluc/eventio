'use client';
import { useRouter } from 'next/navigation';
import { Text, Stack, Button, TextInput, PasswordInput, Anchor } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconUser, IconMail } from '@tabler/icons-react'

import client from '@/lib/client';

export default ({
    toggleVisible
} : {
    toggleVisible: () => void
}) => {
    const router = useRouter();

    const form = useForm({
        initialValues: { username: '', email: '', password: '', confirm: '' },
        validate: {
            username: (value) => /^[a-z0-9_]{3,16}$/.test(value) ? null : 'Invalid username',
            email: (value) => /^\S+@\S+$/.test(value) ? null : 'Invalid email',
            password: (value) => value.length > 0 ? null : 'Password is required',
            confirm: (value, other) => value === other.password ? null : 'Passwords do not match'
        }
    });

    const handleSubmit = async (values: typeof form.values) => {
        const result = await client.auth.register.post({
            username: values.username,
            email: values.email,
            password: values.password
        });

        if (!result.error) {
            localStorage.setItem('auth', JSON.stringify(result.data));
            return router.push('/');
        }

        if (result.data === 'username')
            return form.setErrors({
                username: 'Username already exists'
            })

        if (result.data === 'email')
            return form.setErrors({
                email: 'Email already exists'
            })
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
                    rightSection={<IconUser stroke={1.5} size={20}/>}
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                />

                <TextInput
                    variant='filled'
                    size='md'
                    placeholder='Email'
                    rightSection={<IconMail stroke={1.5} size={20}/>}
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />

                <PasswordInput
                    w='100%'
                    variant='filled'
                    size='md'
                    placeholder='Password'
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />

                <PasswordInput
                    w='100%'
                    variant='filled'
                    size='md'
                    placeholder='Confirm Password'
                    key={form.key('confirm')}
                    {...form.getInputProps('confirm')}
                />

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