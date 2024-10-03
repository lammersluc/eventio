'use client';
import React from 'react';
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
    image: string;
}

export default function Page() {

    const [opened, { open, close }] = useDisclosure(false);
    const [events, setEvents] = React.useState<Event[]>([]);

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
                            key={event.name}
                            title={event.name}
                            description={event.description}
                            image={event.image}
                            clickEvent={() => {}}
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