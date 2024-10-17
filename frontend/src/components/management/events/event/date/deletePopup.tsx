import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Stack, Button, Group, Text } from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';

import client from '@/lib/client';
import toast from 'react-hot-toast';

export const DeletePopup = ({
    opened,
    onClose,
    eventId,
    dateId
}: {
    opened: boolean;
    onClose: () => void;
    eventId: string;
    dateId: string;
}) => {

    const router = useRouter();

    const handleDelete = async () => {

        const promise = new Promise(async (resolve, reject) => {

            const result = await client.manage.events({ eventId }).dates({ dateId }).delete();

            if (result.error) {
                if (result.error.status === 409) {
                    reject('There are already tickets sold for this date');
                    return;
                }

                reject('Failed to delete date');
                return;
            }

            resolve('');
            onClose();
            router.push('.');
        });

        toast.promise(promise, {
            loading: 'Deleting date...',
            success: 'Date deleted',
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
            size='sm'
        >
            <Stack
                p='sm'
                gap='sm'
            >

                <Text>
                    Are you sure you want to delete this date?
                </Text>

                <Text
                    size='xs'
                    c='gray'
                >
                    This cannot be undone
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