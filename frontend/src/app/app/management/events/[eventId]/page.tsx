'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Stack, Title, Text } from '@mantine/core';
import toast from 'react-hot-toast';

import client from '@/lib/client';

type EventDate = {
    id: string;
    amount: number;
    name: string;
    validFrom: globalThis.Date | null;
    validUntil: globalThis.Date | null;
    sold: number;
}

type Event = {
    name: string;
    description: string;
    banner: string;
    startAt: Date | null;
    dates: EventDate[];
    location: string | null;
    endAt: Date | null;
    role: number;
};

export default function Page() {
    const [event, setEvent] = React.useState<Event>();

    const params = useParams<{ eventId: string; }>();

    React.useEffect(() => {

        (async () => {
            const result = await client.manage.events({ eventId: params.eventId }).get();

            if (result.error) {
                toast.error('Event not found');
                return;
            }

            setEvent(result.data);
        })();

    }, []);

    return event && (
        <Stack
            p='xl'
        >

            <Title order={1}>
                {event.name}
            </Title>

            <Text>
                {event.description}
            </Text>

        </Stack>
    );
}