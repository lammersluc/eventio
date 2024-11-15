'use client';
import React from 'react';
import { Center, Tabs } from '@mantine/core'
import { Account } from '@/components/settings/account';
import { Security } from '@/components/settings/security';

const tabs = [
    {
        value: 'account',
        label: 'Account',
        element: <Account />
    },
    {
        value: 'security',
        label: 'Security',
        element: <Security />
    }
];

export default function Page() {

    return (
                <Tabs
                    w='100%'
                    h='100%'
                    p='xl'
                    variant='pills'
                    radius='md'
                    defaultValue='account'
                >

                    <Tabs.List>
                        {
                            tabs.map((tab) => (
                                <Tabs.Tab
                                    size='xl'
                                    key={tab.value}
                                    value={tab.value}
                                >
                                    {tab.label}
                                </Tabs.Tab>
                            ))
                        }
                    </Tabs.List>

                    {
                        tabs.map((tab) => (
                            <Tabs.Panel
                                key={tab.value}
                                value={tab.value}
                                w='100%'
                                h='100%'
                            >
                                <Center
                                    w='100%'
                                    h='100%'
                                >
                                    {tab.element}
                                </Center>
                            </Tabs.Panel>
                        ))
                    }

                </Tabs>
    );
}