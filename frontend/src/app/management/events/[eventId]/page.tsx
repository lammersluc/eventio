'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Stack, Title, Text, Paper, ActionIcon, Group, Box, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCirclePlus, IconEdit, IconTrash } from '@tabler/icons-react';
import toast from 'react-hot-toast';

import client from '@/lib/client';
import { InfoPopup } from '@/components/management/events/event/infoPopup';
import { DatePopup } from '@/components/management/events/event/datePopup';
import { DeletePopup } from '@/components/management/events/event/deletePopup';

type TicketDate = {
    id: string;
    name: string;
    validFrom: Date | null;
    validUntil: Date | null;
    amount: number | null;
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
    dates: TicketDate[];
    role: number;
};

export default function Page() {
    const [event, setEvent] = React.useState<Event>();

    const [infoOpened, infoPopup] = useDisclosure(false);
    const [dateOpened, datePopup] = useDisclosure(false);
    const [deleteOpened, deletePopup] = useDisclosure(false);

    const params = useParams<{ eventId: string; }>();
    const router = useRouter();

    React.useEffect(() => {

        if (infoOpened || dateOpened) return;

        (async () => {
            const result = await client.manage.events({ eventId: params.eventId }).get();

            if (result.error) {
                toast.error('Event not found');
                return;
            }

            setEvent(result.data);
        })();

    }, [infoOpened, dateOpened]);

    return event && (
        <Stack>

            <Group
                justify='space-between'
                align='start'
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
                                onClick={infoPopup.open}
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

                        <Group
                            justify='space-between'
                            gap='xl'
                        >
                            <Text>
                                {event.startAt ? new Date(event.startAt).toLocaleString() : 'No start date'}
                            </Text>
                            -
                            <Text>
                                {event.endAt ? new Date(event.endAt).toLocaleString() : 'No end date'}
                            </Text>
                        </Group>

                        <Text>
                            {event.ticketsUserMax || 'No tickets limit'}
                        </Text>

                        <Text>
                            {event.isPrivate ? 'Private' : 'Public'}
                        </Text>

                    </Stack>
                </Paper>

                <Button
                    radius='md'
                    color='red'
                    leftSection={<IconTrash />}
                    onClick={deletePopup.open}
                >
                    Delete event
                </Button>

            </Group>

            <Stack>

                <Group
                    gap='md'
                >

                    <Title>
                        Dates
                    </Title>

                    <ActionIcon
                        size='xl'
                        radius='lg'
                        variant='subtle'
                        color='default'
                        onClick={datePopup.open}
                    >
                        <IconCirclePlus />
                    </ActionIcon>

                </Group>

                <Group
                    gap='md'
                >
                    {event.dates.map(date => (
                        <Paper
                            key={date.id}
                            p='lg'
                            shadow='lg'
                            radius='lg'
                        >
                            <Stack>

                                <Group
                                    justify='space-between'
                                    gap='xl'
                                >

                                    <Title
                                        order={3}
                                    >
                                        {date.name}
                                    </Title>

                                    <ActionIcon
                                        size='xl'
                                        radius='lg'
                                        variant='subtle'
                                        color='default'
                                        onClick={() => router.push(`${params.eventId}/${date.id}`)}
                                    >
                                        <IconEdit />
                                    </ActionIcon>

                                </Group>

                                <Group
                                    justify='space-between'
                                    gap='xl'
                                >
                                    <Text>
                                        {date.validFrom ? new Date(date.validFrom).toLocaleString() : 'No valid from'}
                                    </Text>
                                    -
                                    <Text>
                                        {date.validUntil ? new Date(date.validUntil).toLocaleString() : 'No valid until'}
                                    </Text>
                                </Group>

                                <Text>
                                    {date.sold} {date.amount !== null && `/ ${date.amount}`} tickets sold
                                </Text>

                            </Stack>
                        </Paper>
                    ))}
                </Group>

            </Stack>

            <InfoPopup
                opened={infoOpened}
                onClose={infoPopup.close}
                info={{
                    ...event,
                    id: params.eventId
                }}
            />

            <DatePopup
                opened={dateOpened}
                onClose={datePopup.close}
                eventId={params.eventId}
            />

            <DeletePopup
                opened={deleteOpened}
                onClose={deletePopup.close}
                eventId={params.eventId}
            />

        </Stack >
    );
}