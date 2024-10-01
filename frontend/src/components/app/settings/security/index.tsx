import React from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, Button, Center, Group, Image, Paper, PasswordInput, Progress, Stack, TextInput } from '@mantine/core'
import { IconDeviceFloppy } from '@tabler/icons-react';
import { toast } from 'react-hot-toast';

import client from '@/lib/client';
import { useForm } from '@mantine/form';
import { checkPassword, checkPasswordStrength } from '@/lib/accountRegex';


export const Security = () => {

    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            newPasswordRepeat: ''
        },
        validate: {
            newPassword: checkPassword
        }
    });

    const handleSubmit = async (values: typeof form.values) => {

        const promise = new Promise(async (resolve, reject) => {

            const result = await client.account.password.patch({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            });

            if (!result.error) {

                form.reset();

                resolve('');
                return;
            }

            if (result.error.status === 401) {

                form.setErrors({
                    oldPassword: 'Incorrect password'
                })

                reject('Incorrect password');
                return;
            }

            reject('Something went wrong');
        });

        toast.promise(promise, {
            loading: 'Changing password...',
            success: 'Password changed',
            error: (error) => error
        });
    }

    return (
        <Group
            gap='150px'
        >

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack
                    w='220px'
                >

                    <PasswordInput
                        label='Old Password'
                        key={form.key('oldPassword')}
                        {...form.getInputProps('oldPassword')}
                    />

                    <Stack
                        w='100%'
                        gap={3}
                    >
                        <PasswordInput
                            label='New Password'
                            key={form.key('newPassword')}
                            {...form.getInputProps('newPassword')}
                        />
                        {(() => {
                            const { strength, color } = checkPasswordStrength(form.values.newPassword);
                            return (
                                <Progress
                                    value={strength}
                                    color={color}
                                    size={4}
                                    radius='xl'
                                />
                            );
                        })()}
                    </Stack>

                    <Group
                        justify='space-between'
                        pr='10%'
                    >

                        <Button
                            w='fit-content'
                            leftSection={<IconDeviceFloppy />}
                            type='submit'
                        >
                            Save
                        </Button>

                    </Group>

                </Stack>
            </form>

            <Stack
                align='center'
            >

                <Image
                    src='https://cdn0.iconfinder.com/data/icons/cybersecurity-3/400/2FA-2-1024.png'
                    alt=''
                    w='192px'
                    h='192px'
                />
                2FA

            </Stack>

        </Group>
    );
}