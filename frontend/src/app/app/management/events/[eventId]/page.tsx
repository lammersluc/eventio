'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Stack, Title, Text, Paper, ActionIcon, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCirclePlus, IconEdit } from '@tabler/icons-react';
import toast from 'react-hot-toast';

import client from '@/lib/client';
import { InfoPopup } from '@/components/app/management/events/event/infoPopup';
import { DatePopup } from '@/components/app/management/events/event/datePopup';

type EventDate = {
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
    dates: EventDate[];
    role: number;
};

export default function Page() {
    const [event, setEvent] = React.useState<Event>();

    const [infoOpened, info] = useDisclosure(false);
    const [dateOpened, dates] = useDisclosure(false);

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
        <Stack
            p='xl'
            w='fit-content'
        >

            <Paper
                p='lg'
                shadow='lg'
                radius='lg'
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
                            onClick={info.open}
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

                    <Text>
                        {event.ticketsUserMax || 'No tickets limit'}
                    </Text>

                    <Text>
                        {event.isPrivate ? 'Private' : 'Public'}
                    </Text>

                </Stack>
            </Paper>

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
                        onClick={dates.open}
                    >
                        <IconCirclePlus />
                    </ActionIcon>

                </Group>

                <Group
                    gap='md'
                >
                    {event.dates.map(date => (
                        <Paper
                            p='lg'
                            shadow='lg'
                            radius='lg'
                        >
                            <Stack
                                key={date.id}
                            >

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
                                        onClick={() => router.push('dates/' + date.id)}
                                    >
                                        <IconEdit />
                                    </ActionIcon>

                                </Group>

                                <Text>
                                    {date.amount} tickets
                                </Text>

                                <Text>
                                    {date.validFrom ? new Date(date.validFrom).toLocaleString() : 'No valid from'} - {date.validUntil ? new Date(date.validUntil).toLocaleString() : 'No valid until'}
                                </Text>

                                <Text>
                                    {date.sold} sold
                                </Text>

                            </Stack>
                        </Paper>
                    ))}
                </Group>

            </Stack>

            <InfoPopup
                opened={infoOpened}
                onClose={info.close}
                info={{
                    ...event,
                    id: params.eventId
                }}
            />

            <DatePopup
                opened={dateOpened}
                onClose={dates.close}
                eventId={params.eventId}
            />

        </Stack >
    );
}