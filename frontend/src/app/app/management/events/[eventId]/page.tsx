'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Stack, Title, Text, Paper, ActionIcon, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import toast from 'react-hot-toast';

import client from '@/lib/client';
import { InfoPopup } from '@/components/app/management/events/event/infoPopup';

type EventDate = {
    id: string;
    amount: number;
    name: string;
    validFrom: Date | null;
    validUntil: Date | null;
    sold: number;
}

type Event = {
    name: string;
    description: string | null;
    banner: string;
    location: string | null;
    startAt: Date | null;
    endAt: Date | null;
    ticketsUserMax: number | null;
    isPrivate: boolean;
    dates: EventDate[];
    role: number;
};

export default function Page() {
    const [event, setEvent] = React.useState<Event>();

    const [opened, { open, close }] = useDisclosure(false);

    const params = useParams<{ eventId: string; }>();

    React.useEffect(() => {

        if (opened) return;

        (async () => {
            const result = await client.manage.events({ eventId: params.eventId }).get();

            if (result.error) {
                toast.error('Event not found');
                return;
            }

            console.log(result.data.startAt)

            setEvent(result.data);
        })();

    }, [opened]);

    return event && (
        <Stack
            p='xl'
        >

            <Paper
                p='lg'
                shadow='lg'
                radius='lg'
                w='fit-content'
            >
                <Stack>

                    <Group
                        justify='space-between'
                        gap='xl'
                    >

                        <Title>
                            {event.name}
                        </Title>

                        <ActionIcon
                            size='xl'
                            radius='lg'
                            variant='subtle'
                            color='default'
                            onClick={open}
                        >
                            <IconEdit />
                        </ActionIcon>

                    </Group>

                    <Text>
                        {event.description || 'No description'}
                    </Text>

                    <Text>
                        {event.location || 'No location'}
                    </Text>

                    <Text>
                        {event.startAt ? new Date(event.startAt).toLocaleString() : 'No start date'} - {event.endAt ? new Date(event.endAt).toLocaleString() : 'No end date'}
                    </Text>

                </Stack>
            </Paper>

            <InfoPopup
                opened={opened}
                onClose={close}
                info={{
                    ...event,
                    id: params.eventId
                }}
            />

        </Stack>
    );
}