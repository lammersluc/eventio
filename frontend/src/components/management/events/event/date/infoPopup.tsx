import React from 'react';
import { Button, Group, Modal, NumberInput, Stack, Switch, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { toast } from 'react-hot-toast';

import client from '@/lib/client';
import { IconDeviceFloppy } from '@tabler/icons-react';

type Info = {
    eventId: string;
    id: string;
    name: string;
    validFrom: Date | null;
    validUntil: Date | null;
    amount: number | null;
}

export const InfoPopup = ({
    opened,
    onClose,
    info
}: {
    opened: boolean;
    onClose: () => void;
    info: Info;
}) => {
    const form = useForm({
        validate: {
            name: (value) => value === '' ? 'Name is required' : null
        },
        initialValues: {
            name: info.name,
            validFrom: info.validFrom ? new Date(info.validFrom) : null,
            validUntil: info.validUntil ? new Date(info.validUntil) : null,
            amount: info.amount
        }
    });

    const handleSubmit = async (values: typeof form.values) => {

        const promise = new Promise(async (resolve, reject) => {

            const dirty = form.getDirty();

            const changedValues = Object.keys(dirty).reduce((acc: any, key) => {
                const typedKey = key as keyof typeof values;

                if (dirty[typedKey])
                    acc[typedKey] = values[typedKey];

                return acc;
            }, {});

            const result = await client.manage
                .events({ eventId: info.eventId })
                .dates({ dateId: info.id })
                .patch(changedValues);

            if (result.error) {
                reject('Failed to update date');
                return;
            }

            onClose();
            resolve('');
        });

        toast.promise(promise, {
            loading: 'Updating date...',
            success: 'Date updated',
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

                    <DateTimePicker
                        label='Valid From'
                        key={form.key('validFrom')}
                        {...form.getInputProps('validFrom')}
                        style={{ flexGrow: 1 }}
                        clearable
                    />

                    <DateTimePicker
                        label='Valid Until'
                        key={form.key('validUntil')}
                        {...form.getInputProps('validUntil')}
                        style={{ flexGrow: 1 }}
                        clearable
                    />

                    <NumberInput
                        label='Amount'
                        key={form.key('amount')}
                        {...form.getInputProps('amount')}
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
                            leftSection={<IconDeviceFloppy />}
                            style={{ flexGrow: 1 }}
                        >
                            Save
                        </Button>

                    </Group>

                </Stack>
            </form>
        </Modal>
    );
}