import { Center, Paper, Text, Input, Stack, Button, PasswordInput } from '@mantine/core'
import { IconMail } from '@tabler/icons-react'

export default () => {
    return (
        <Center
            h='100%'
        >
            <Paper
                radius='lg'
                shadow='xl'
                withBorder
            >
                <Stack
                    p='xl'
                    gap='lg'
                    align='center'
                >

                    <Text fw={600} size='xl'>
                        Login
                    </Text>

                    <Stack
                        gap='xs'
                    >
                        <Text
                            fw={500}
                            opacity={0.5}
                        >
                            Email
                        </Text>
                        <Input variant='filled' size='md' type='email' rightSection={<IconMail size={20}/>} required={true} placeholder='you@example.com' />
                    </Stack>

                    <Stack
                        gap='xs'
                        w='100%'
                    >
                        <Text
                            fw={500}
                            opacity={0.5}
                        >
                            Password
                        </Text>
                        <PasswordInput variant='filled' size='md' placeholder='Password123!' />
                    </Stack>

                    <Button fullWidth>Login</Button>

                </Stack>

            </Paper>
        </Center>
    );
}