'use client';

import { Center, Paper, Text, Input, Stack, Button, PasswordInput,  } from '@mantine/core'
import { useForm } from '@mantine/form';
import { IconMail } from '@tabler/icons-react'

export default () => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '', password: '' },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
        }
    });

    return (
        <Center
            h='100%'
        >
            <Paper
                radius='lg'
                shadow='xl'
            >
                <form onSubmit={console.log}>

                    <Stack
                        p='xl'
                        gap='lg'
                        align='center'
                    >

                        <Text fw={600} size='xl'>
                            Login
                        </Text>

                            <Input
                                variant='filled'
                                size='md'
                                type='email'
                                {...form.getInputProps('name')}
                                required={true}
                                placeholder='Email'
                                rightSection={<IconMail stroke={1.5} size={20}/>}
                                key={form.key('email')}
                                {...form.getInputProps('email')}
                            />
                            <PasswordInput
                                w='100%'
                                variant='filled'
                                size='md'
                                required={true}
                                placeholder='Password'
                                key={form.key('password')}
                                {...form.getInputProps('password')}
                            />

                            <Button
                                type='submit'
                                fullWidth
                            >
                                Login
                            </Button>

                    </Stack>

                </form>

            </Paper>

        </Center>
    );
}