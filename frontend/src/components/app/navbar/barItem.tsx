import { Box, ActionIcon, Divider, Group, Text } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import React, { forwardRef } from 'react';

type Item = {
    name: string;
    icon: typeof IconHome;
    clickEvent: () => void;
};

export type BarProp = Item | 'divider';

export const BarItem = forwardRef<HTMLButtonElement, { barItem: BarProp }>(({
    barItem
}, ref) => {

    if (barItem === 'divider')
        return (
            <Divider
                size='sm'
                w='100%'
            />
        );

    return (
        <ActionIcon
            w='100%'
            radius='md'
            size='lg'
            variant='subtle'
            color='normal'
            onClick={barItem.clickEvent}
            ref={ref}
        >
            <Group
                w='100%'
                ml='3.5px'
                gap='xs'
                wrap='nowrap'
                style={{
                    overflow: 'hidden'
                }}
            >

                <Box
                    w='25px'
                    h='25px'
                >
                    <barItem.icon stroke={1.5} />
                </Box>

                <Text
                    w='100%'
                    size='sm'
                    fw={700}
                >
                    {barItem.name}
                </Text>

            </Group>
        </ActionIcon>
    )
});