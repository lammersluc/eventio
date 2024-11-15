'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Group, Stack, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import toast from 'react-hot-toast';

import { EventCard } from '@/components/management/events/eventCard';
import { EventPopup } from '@/components/management/events/eventPopup';

import client from '@/lib/client';

type Event = {
    id: string;
    name: string;
    description: string | null;
    banner: string;
}

export default function Page() {
    const [opened, { open, close }] = useDisclosure(false);
    const [events, setEvents] = React.useState<Event[]>([]);

    const router = useRouter();

    React.useEffect(() => {

        (async () => {

            if (opened) return;

            const result = await client.manage.events.get();

            if (result.error)
                toast.error('Failed to load events');

            setEvents(result.data || []);

        })();

    }, [opened]);

    return (
        <Stack>

            <Group
                justify='space-between'
            >

                <Title order={1}>
                    Events
                </Title>

                <Button
                    onClick={open}
                >
                    Create Event
                </Button>

            </Group>

            <Group>
                {
                    events.map((event) => (
                        <EventCard
                            key={event.id}
                            title={event.name}
                            description={event.description || ''}
                            banner={event.banner}
                            clickEvent={() => router.push('./events/' + event.id)}
                        />
                    ))
                }
            </Group>

            <EventPopup
                opened={opened}
                onClose={close}
            />

        </Stack>
    );
}