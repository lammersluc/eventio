'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Breadcrumbs, Stack, Anchor } from '@mantine/core'

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    const path = usePathname();
    const router = useRouter();

    const breadcrumbs = path.split('/').slice(2).map((item, index, array) => {
        let label = item.charAt(0).toUpperCase() + item.slice(1);

        if (index === 1) label = 'Event';
        if (index === 2) label = 'Date';

        return {
            label,
            href: '/management/' + array.slice(0, index + 1).join('/')
        };
    });

    return (
        <Stack
            p='xl'
        >

            <Breadcrumbs>

                {breadcrumbs.map((item, index) => (
                    <Anchor
                        key={index}
                        onClick={() => router.push(item.href)}
                    >
                        {item.label}
                    </Anchor>
                ))}

            </Breadcrumbs>

            {children}

        </Stack>
    );
}