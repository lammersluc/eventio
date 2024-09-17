'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ActionIcon, Box, Group, Modal, Stack, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

export default ({
    opened,
    close
}: {
    opened: boolean,
    close: () => void
}) => {
    const router = useRouter();

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Settings"
            centered
            transitionProps={{ transition: 'rotate-right', duration: 300 }}
        >



        </Modal>
    );
}