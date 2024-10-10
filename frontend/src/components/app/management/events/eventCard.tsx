import React from 'react';
import { Button, Card, Image, Stack, Text, Title } from '@mantine/core';

export const EventCard = ({
    title,
    description,
    banner,
    clickEvent
}: {
    title: string;
    description: string;
    banner: string;
    clickEvent: () => void;
}) => {
    return (
        <Card
            padding='lg'
            radius='lg'
            w='250px'
            h='300px'
        >

            <Card.Section
            >
                <Image
                    src={banner}
                    alt=''
                    mx='auto'
                    w='120px'
                    h='120px'
                />
            </Card.Section>

            <Stack
                pt='sm'
                h='100%'
                justify='space-between'
            >

                <Stack
                    gap='xs'
                >

                    <Title order={3}>
                        {title}
                    </Title>

                    <Text>
                        {description}
                    </Text>

                </Stack>

                <Button onClick={clickEvent}>
                    Manage
                </Button>

            </Stack>

        </Card>
    );
}