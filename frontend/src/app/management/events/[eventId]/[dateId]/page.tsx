'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { ActionIcon, Button, Group, Paper, Stack, Title, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash, IconCirclePlus } from '@tabler/icons-react';
import { toast } from 'react-hot-toast';

import client from '@/lib/client';
import { InfoPopup } from '@/components/management/events/event/date/infoPopup';
import { OptionPopup } from '@/components/management/events/event/date/optionPopup';
import { DeletePopup } from '@/components/management/events/event/date/deletePopup';

type TicketOption = {
    id: string;
    name: string;
    price: number;
    amount: number | null;
    sold: number;
}

type TicketDate = {
    name: string;
    validFrom: Date | null;
    validUntil: Date | null;
    amount: number | null;
    sold: number;
    options: TicketOption[];
}

export default function Page() {
    const [date, setDate] = React.useState<TicketDate | null>(null);

    const [infoOpened, infoPopup] = useDisclosure(false);
    const [optionOpened, optionPopup] = useDisclosure(false);
    const [deleteOpened, deletePopup] = useDisclosure(false);

    const params = useParams<{ eventId: string; dateId: string; }>();

    React.useEffect(() => {

        if (infoOpened || optionOpened) return;

        (async () => {

            const result = await client.manage.events({ eventId: params.eventId }).dates({ dateId: params.dateId }).get();

            if (result.error) {
                toast.error('Failed to load date');
                return;
            }

            setDate(result.data);

        })();

    }, [infoOpened, optionOpened]);


    return date && (
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
                                {date.name}
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
                            {date.sold} {date.amount !== null && `/ ${date.amount}`} sold
                        </Text>

                    </Stack>
                </Paper>

                <Button
                    radius='md'
                    color='red'
                    leftSection={<IconTrash />}
                    onClick={deletePopup.open}
                >
                    Delete date
                </Button>

            </Group>

            <Stack>

                <Group
                    gap='md'
                >

                    <Title>
                        Options
                    </Title>

                    <ActionIcon
                        size='xl'
                        radius='lg'
                        variant='subtle'
                        color='default'
                        onClick={optionPopup.open}
                    >
                        <IconCirclePlus />
                    </ActionIcon>

                </Group>

                <Group
                    gap='md'
                >
                    {date.options.map(option => (
                        <Paper
                            key={option.id}
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
                                        {option.name}
                                    </Title>

                                    <ActionIcon
                                        size='xl'
                                        radius='lg'
                                        variant='subtle'
                                        color='default'
                                        onClick={() => {}}
                                    >
                                        <IconEdit />
                                    </ActionIcon>

                                </Group>

                                <Text>
                                    ${option.price}
                                </Text>

                                <Text>
                                    {option.sold} {option.amount !== null && `/ ${option.amount}`} sold
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
                    ...date,
                    eventId: params.eventId,
                    id: params.dateId
                }}
            />

            <OptionPopup
                opened={optionOpened}
                onClose={optionPopup.close}
                eventId={params.eventId}
                dateId={params.dateId}
            />

            <DeletePopup
                opened={deleteOpened}
                onClose={deletePopup.close}
                eventId={params.eventId}
                dateId={params.dateId}
            />

        </Stack>
    );
}