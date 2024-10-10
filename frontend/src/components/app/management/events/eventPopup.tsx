import React from 'react';
import { Modal, Stack, Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCirclePlus } from '@tabler/icons-react';

import client from '@/lib/client';
import toast from 'react-hot-toast';

export const EventPopup = ({
    opened,
    onClose
}: {
    opened: boolean;
    onClose: () => void;
}) => {

    const form = useForm({
        validate: {
            name: (value) => value === '' ? 'Name is required' : null
        }
    });

    const handleSubmit = async (values: typeof form.values) => {

        const promise = new Promise(async (resolve, reject) => {

            const result = await client.manage.events.post({
                name: values.name,
            });

            if (result.error) {
                reject('Failed to create event');
                return;
            }

            resolve('');
            onClose();
        });

        toast.promise(promise, {
            loading: 'Creating event...',
            success: 'Event created',
            error: (error) => error
        });
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            radius='lg'
            centered={true}
            size='xs'
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack
                    p='sm'
                    gap='sm'
                >

                    <TextInput
                        label='Name'
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />


                    <Group
                        w='100%'
                        gap='xs'
                    >

                        <Button
                            radius='md'
                            variant='outline'
                            color='gray'
                            onClick={() => {
                                form.reset();
                                onClose();
                            }}
                            style={{ flexGrow: 1 }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type='submit'
                            radius='md'
                            leftSection={<IconCirclePlus />}
                            style={{ flexGrow: 1 }}
                        >
                            Create
                        </Button>

                    </Group>

                </Stack>
            </form>
        </Modal>
    );
}