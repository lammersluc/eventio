import { Box, ActionIcon, Divider, Group, Text } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import React, { forwardRef } from 'react';

type Item = {
    name: string;
    icon: typeof IconHome;
    clickEvent: () => void;
};

export type BarProp = Item | 'divider' | React.JSX.Element;

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

    if (React.isValidElement(barItem))
        return barItem;
    else
        barItem = barItem as Item;

    return (
        <ActionIcon
            w='100%'
            radius='md'
            size='lg'
            variant='subtle'
            color='normal'
            onClick={barItem.clickEvent}
            style={{
                transition: 'background-color 0.2s ease-in-out',
            }}
            ref={ref}
        >
            <Group
                w='100%'
                ml='3.5px'
                gap='xs'
                wrap='nowrap'
                style={{
                    transition: 'width 0.3s ease-in-out',
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