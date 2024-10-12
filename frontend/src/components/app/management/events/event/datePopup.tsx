import React from 'react';
import { Modal, Stack, Button, Group, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';

import client from '@/lib/client';
import toast from 'react-hot-toast';

type EventDate = {
    id: string;
    name: string;
    validFrom: Date | null;
    validUntil: Date | null;
    amount: number | null;
}

export const DatePopup = ({
    opened,
    onClose,
    eventId,
    date
}: {
    opened: boolean;
    onClose: () => void;
    eventId: string;
    date: EventDate;
}) => {

    const form = useForm({
        validate: {
            name: (value) => value === '' ? 'Name is required' : null
        },
        initialValues: {
            name: date.name,
            validFrom: date.validFrom,
            validUntil: date.validUntil,
            amount: date.amount
        }
    });

    React.useEffect(() => {
        if (!opened) return;
        
        form.setValues({
            name: date.name,
            validFrom: date.validFrom ? new Date(date.validFrom) : null,
            validUntil: date.validUntil ? new Date(date.validUntil) : null,
            amount: date.amount
        });
    }, [date]);

    const handleSubmit = async (values: typeof form.values) => {

        const promise = new Promise(async (resolve, reject) => {

            const result = date.id === '' ?
                await client.manage.events({ eventId }).dates.put({
                    name: values.name,
                    validFrom: values.validFrom || undefined,
                    validUntil: values.validUntil || undefined,
                    amount: values.amount || undefined
                }) :
                await client.manage.events({ eventId }).dates({ dateId: date.id }).patch({
                    name: values.name,
                    validFrom: values.validFrom,
                    validUntil: values.validUntil,
                    amount: values.amount
                });

            if (result.error) {
                reject('Failed to save date');
                return;
            }

            resolve('');
            onClose();
        });

        toast.promise(promise, {
            loading: 'Saving date...',
            success: 'Date saved',
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
                        label='Valid from'
                        key={form.key('validFrom')}
                        {...form.getInputProps('validFrom')}
                        style={{ flexGrow: 1 }}
                        clearable
                    />

                    <DateTimePicker
                        label='Valid until'
                        key={form.key('validUntil')}
                        {...form.getInputProps('validUntil')}
                        style={{ flexGrow: 1 }}
                        clearable
                    />

                    <TextInput
                        label='Amount'
                        key={form.key('amount')}
                        type='number'
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