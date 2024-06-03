'use client';
import { useRouter } from 'next/navigation';
import { Text, Stack, Button, TextInput, PasswordInput, Anchor, Progress } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconUser, IconMail } from '@tabler/icons-react'
import { zxcvbn } from '@zxcvbn-ts/core';

import client from '@/lib/client';

export default ({
    toggleVisible
} : {
    toggleVisible: () => void
}) => {
    const router = useRouter();

    const form = useForm({
        initialValues: { username: '', email: '', password: '' },
        validate: {
            username: (value) => !/^[a-z0-9_]{3,16}$/.test(value),
            email: (value) => !/^\S+@\S+$/.test(value),
            password: (value) => zxcvbn(value).score < 3
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