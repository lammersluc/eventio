'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Stack, Title, Text, Paper, ActionIcon, Group, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCirclePlus, IconEdit, IconTrash } from '@tabler/icons-react';
import toast from 'react-hot-toast';

import client from '@/lib/client';
import { InfoPopup } from '@/components/app/management/events/event/infoPopup';
import { DatePopup } from '@/components/app/management/events/event/datePopup';
import { DeletePopup } from '@/components/app/management/events/event/deletePopup';

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

type DeleteType = {
    type: 'event' | 'date';
    id: string;
}

export default function Page() {
    const [event, setEvent] = React.useState<Event>();

    const [infoOpened, info] = useDisclosure(false);
    const [date, setDate] = React.useState<EventDate | null>(null);
    const [deleteType, setDeleteType] = React.useState<DeleteType | null>(null);

    const params = useParams<{ eventId: string; }>();

    React.useEffect(() => {

        if (infoOpened || date || deleteType) return;

        (async () => {
            const result = await client.manage.events({ eventId: params.eventId }).get();

            if (result.error) {
                toast.error('Event not found');
                return;
            }

            setEvent(result.data);
        })();

    }, [infoOpened, date, deleteType]);

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
                        onClick={() => setDate({
                            id: '',
                            name: '',
                            validFrom: null,
                            validUntil: null,
                            amount: null,
                            sold: 0
                        })}
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

                                    <Group
                                        gap='xs'
                                    >

                                        <ActionIcon
                                            size='xl'
                                            radius='lg'
                                            variant='subtle'
                                            color='default'
                                            onClick={() => setDate(date)}
                                        >
                                            <IconEdit />
                                        </ActionIcon>

                                        <ActionIcon
                                            size='xl'
                                            radius='lg'
                                            variant='subtle'
                                            color='red'
                                            onClick={() => setDeleteType({
                                                type: 'date',
                                                id: date.id
                                            })
                                            }
                                        >
                                            <IconTrash />
                                        </ActionIcon>

                                    </Group>

                                </Group>

                                <Group
                                    justify='space-between'
                                    gap='xl'
                                >
                                    <Box>
                                        {date.validFrom ? new Date(date.validFrom).toLocaleString() : 'No valid from'}
                                    </Box>
                                    -
                                    <Box>
                                        {date.validUntil ? new Date(date.validUntil).toLocaleString() : 'No valid until'}
                                    </Box>
                                </Group>

                                <Group>
                                    <Text>
                                        {date.sold} {!date.amount && 'sold'}
                                    </Text>

                                    {date.amount !== null &&
                                        <>
                                            /
                                            <Text>
                                                {date.amount} sold
                                            </Text>
                                        </>
                                    }
                                </Group>

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
                opened={date !== null}
                onClose={() => setDate(null)}
                eventId={params.eventId}
                date={date || {
                    id: '',
                    name: '',
                    validFrom: null,
                    validUntil: null,
                    amount: null,
                    sold: 0
                }}
            />

            <DeletePopup
                opened={deleteType !== null}
                onClose={() => setDeleteType(null)}
                eventId={params.eventId}
                dateId={deleteType?.id || null}
            />

        </Stack >
    );
}