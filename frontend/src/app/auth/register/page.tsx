import { Center, Paper, Text, Input, Stack, Button, PasswordInput } from '@mantine/core'
import { IconUser, IconMail } from '@tabler/icons-react'

export default () => {
    return (
        <Center
            h='100%'
        >
            <Paper
                radius='lg'
                shadow='xl'
            >
                <Stack
                    p='xl'
                    gap='lg'
                    align='center'
                >

                    <Text fw={600} size='xl'>
                        Register
                    </Text>

                    <Input variant='filled' size='md' required={true} placeholder='Username' rightSection={<IconUser stroke={1.5} size={20}/>}/>
                    <Input variant='filled' size='md' type='email' required={true} placeholder='Email' rightSection={<IconMail stroke={1.5} size={20}/>} />
                    <PasswordInput w='100%' variant='filled' size='md' required={true} placeholder='Password' />
                    <PasswordInput w='100%' variant='filled' size='md' required={true} placeholder='Confirm Password' />

                    <Button fullWidth>Register</Button>

                </Stack>

            </Paper>
        </Center>
    );
}