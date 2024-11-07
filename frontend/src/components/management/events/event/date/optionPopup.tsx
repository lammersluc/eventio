import React from 'react';
import { Modal, Stack, Button, Group, TextInput, NumberInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy } from '@tabler/icons-react';

import client from '@/lib/client';
import toast from 'react-hot-toast';

type TicketOption = {
    id: string;
    name: string;
    price: number;
    amount: number | null;
}

export const OptionPopup = ({
    opened,
    onClose,
    eventId,
    dateId,
    option
}: {
    opened: boolean;
    onClose: () => void;
    eventId: string;
    dateId: string;
    option: TicketOption | null;
}) => {

    const form = useForm({
        validate: {
            name: (value) => value === '' ? 'Name is required' : null
        },
        initialValues: {
            name: option?.name || '',
            price: option?.price || 0,
            amount: option?.amount || null
        }
    });

    React.useEffect(() => {
        if (!opened) return;

        form.setValues({
            name: option?.name || '',
            price: option?.price || 0,
            amount: option?.amount || null
        });

        console.log(option);
    }, [opened]);

    const handleSubmit = async (values: typeof form.values) => {

        const promise = new Promise(async (resolve, reject) => {

            const result = option ?
                await client.manage.events({ eventId }).options({ optionId: option.id }).patch({
                    name: values.name,
                    price: values.price,
                    amount: values.amount
                }) : 
                await client.manage.events({ eventId }).dates({ dateId }).options.put({
                    name: values.name
                });

            if (result.error) {
                reject(`Failed to ${option ? 'update' : 'create'} option`);
                return;
            }

            resolve('');
            onClose();
        });

        toast.promise(promise, {
            loading: `${option ? 'Updating' : 'Creating'} option...`,
            success: `Option ${option ? 'updated' : 'created'}`,
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

                    <NumberInput
                        label='Price'
                        leftSection='$'
                        key={form.key('price')}
                        {...form.getInputProps('price')}
                    />

                    <NumberInput
                        label='Amount'
                        allowDecimal={false}
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