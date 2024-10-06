'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Group, Stack, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import toast from 'react-hot-toast';

import { EventCard } from '@/components/app/management/eventCard';
import { CreateEventPopup } from '@/components/app/management/createEventPopup';

import client from '@/lib/client';

type Event = {
    id: string;
    name: string;
    description: string;
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
        <Stack
            p='xl'
        >

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
                            description={event.description}
                            banner={event.banner}
                            clickEvent={() => router.push('./events/' + event.id)}
                        />
                    ))
                }
            </Group>

            <CreateEventPopup
                opened={opened}
                onClose={close}
            />

        </Stack>
    );
}