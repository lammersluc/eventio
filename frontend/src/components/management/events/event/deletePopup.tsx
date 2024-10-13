import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Stack, Button, Group, Text } from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';

import client from '@/lib/client';
import toast from 'react-hot-toast';

export const DeletePopup = ({
    opened,
    onClose,
    eventId
}: {
    opened: boolean;
    onClose: () => void;
    eventId: string;
}) => {

    const router = useRouter();

    const handleDelete = async () => {

        const promise = new Promise(async (resolve, reject) => {

            const result = await client.manage.events({ eventId }).index.delete();

            if (result.error) {
                if (result.error.status === 409) {
                    reject('There are already transactions made for this event');
                    return;
                }

                reject('Failed to delete event');
                return;
            }

            resolve('');
            onClose();
            router.push('.');
        });

        toast.promise(promise, {
            loading: 'Deleting event...',
            success: 'Event deleted',
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
            <Stack
                p='sm'
                gap='sm'
            >

                <Text>
                    Are you sure you want to delete this event?
                </Text>


                <Group
                    w='100%'
                    gap='xs'
                >

                    <Button
                        radius='md'
                        variant='outline'
                        color='gray'
                        onClick={onClose}
                        style={{ flexGrow: 1 }}
                    >
                        Cancel
                    </Button>

                    <Button
                        radius='md'
                        color='red'
                        leftSection={<IconTrash />}
                        style={{ flexGrow: 1 }}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>

                </Group>

            </Stack>
        </Modal>
    );
}