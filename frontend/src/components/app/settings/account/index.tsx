import React from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, Button, Center, Group, Image, Paper, Stack, TextInput } from '@mantine/core'
import { IconDeviceFloppy } from '@tabler/icons-react';
import { toast } from 'react-hot-toast';

import { PictureModal } from './pictureModal';

import client from '@/lib/client';
import { useForm } from '@mantine/form';
import { checkEmail, checkUsername } from '@/lib/accountRegex';

type Account = {
    username: string;
    email: string;
    image: string | null;
    createdAt: Date;
} | null;

export const Account = () => {
    const [account, setAccount] = React.useState<Account>();
    const [pictureModal, setPictureModal] = React.useState(false);

    const router = useRouter();

    const form = useForm({
        validate: {
            username: checkUsername,
            email: checkEmail
        }
    });

    React.useEffect(() => {
        if (pictureModal) return;

        (async () => {
            const result = await client.account.get();

            if (result.error) {
                localStorage.removeItem('auth');
                router.push('/auth');
                return;
            }

            setAccount(result.data);
            form.setValues({
                username: result.data.username,
                email: result.data.email
            });
            form.resetDirty();
        })();

    }, [pictureModal]);

    const handleSubmit = async (values: typeof form.values) => {

        const promise = new Promise(async (resolve, reject) => {

            if (!account) {
                reject('Something went wrong');
                return;
            }

            const body = {
                username: values.username !== account.username ? values.username : undefined,
                email: values.email !== account.email ? values.email : undefined
            };

            if (!body.username && !body.email) {
                resolve('');
                return;
            }

            const result = await client.account.patch(body);

            if (!result.error) {

                setAccount({
                    ...account,
                    username: values.username,
                    email: values.email
                });

                form.resetDirty();

                resolve('');
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
            loading: 'Saving...',
            success: 'Saved',
            error: (error) => error
        });
    }

    return account && (
        <>
            <Group
                gap='150px'
            >

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>

                        <TextInput
                            label='Username'
                            key={form.key('username')}
                            {...form.getInputProps('username')}
                        />

                        <TextInput
                            label='Email'
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />

                        <Group
                            justify='space-between'
                            pr='10%'
                        >

                            <Button
                                leftSection={<IconDeviceFloppy />}
                                type='submit'
                            >
                                Save
                            </Button>

                            {form.isDirty() && (
                                <Anchor
                                    size='md'
                                    onClick={() => form.reset()}
                                >
                                    Reset
                                </Anchor>
                            )}

                        </Group>

                    </Stack>
                </form>

                <Stack>

                    <Paper
                        w='128px'
                        h='128px'
                        shadow='sm'
                        radius='50%'
                        style={{
                            overflow: 'hidden'
                        }}
                    >
                        <Image
                            src={account.image}
                            alt=''
                        />
                    </Paper>

                    <Button
                        onClick={() => setPictureModal(true)}
                    >
                        Change Picture
                    </Button>

                </Stack>

            </Group>

            <PictureModal opened={pictureModal} onClose={() => setPictureModal(false)} />
        </>
    );
}