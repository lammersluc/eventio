'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Stack } from '@mantine/core';
import { toast } from 'react-hot-toast';

import client from '@/lib/client';

type TicketOption = {
    id: string;
    name: string;
    price: number;
    sold: number;
}

type TicketDate = {
    id: string;
    name: string;
    validFrom: Date | null;
    validUntil: Date | null;
    amount: number | null;
    sold: number;
    options: TicketOption[];
}

export default function Page() {
    const [date, setDate] = React.useState<TicketDate | null>(null);

    const params = useParams<{ eventId: string; dateId: string; }>();

    React.useEffect(() => {

        (async () => {

            const result = await client.manage.events({ eventId: params.eventId }).dates({ dateId: params.dateId }).get();

            if (result.error) {
                toast.error('Failed to load date');
                return;
            }

            setDate(result.data);

        })();

    }, []);


    return date && (
        <Stack>

            
        </Stack >
    );
}