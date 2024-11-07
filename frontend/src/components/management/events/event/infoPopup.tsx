import React from 'react';
import { Button, Group, Modal, NumberInput, Stack, Switch, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { toast } from 'react-hot-toast';

import client from '@/lib/client';
import { IconDeviceFloppy } from '@tabler/icons-react';

type Info = {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    startAt: Date | null;
    endAt: Date | null;
    ticketsUserMax: number | null;
    isPrivate: boolean;
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
            description: info.description || '',
            location: info.location || '',
            startAt: info.startAt ? new Date(info.startAt) : null,
            endAt: info.endAt ? new Date(info.endAt) : null,
            ticketsUserMax: info.ticketsUserMax,
            isPrivate: info.isPrivate
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

            const result = await client.manage.events({
                eventId: info.id
            }).index.patch(changedValues);

            if (result.error) {
                reject('Failed to update event');
                return;
            }

            onClose();
            resolve('');
        });

        toast.promise(promise, {
            loading: 'Updating event...',
            success: 'Event updated',
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

                    <TextInput
                        label='Description'
                        key={form.key('description')}
                        {...form.getInputProps('description')}
                    />

                    <TextInput
                        label='Location'
                        key={form.key('location')}
                        {...form.getInputProps('location')}
                    />

                    <DateTimePicker
                        label='Start At'
                        key={form.key('startAt')}
                        {...form.getInputProps('startAt')}
                        style={{ flexGrow: 1 }}
                        clearable
                    />

                    <DateTimePicker
                        label='End At'
                        key={form.key('endAt')}
                        {...form.getInputProps('endAt')}
                        style={{ flexGrow: 1 }}
                        clearable
                    />

                    <NumberInput
                        label='Max Tickets Per User'
                        key={form.key('ticketsUserMax')}
                        {...form.getInputProps('ticketsUserMax')}
                    />

                    <Switch
                        label='Is Private'
                        key={form.key('isPrivate')}
                        {...form.getInputProps('isPrivate')}
                        checked={form.getInputProps('isPrivate').value}
                        onChange={() => form.setValues({
                            isPrivate: !form.getInputProps('isPrivate').value
                        })}
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