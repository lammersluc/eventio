'use client';
import React from 'react';
import { Center, Group, Image, Paper } from '@mantine/core'

import Login from '@/components/auth/login';
import Register from '@/components/auth/register';

export default () => {
    const toggleVisible = () => {
        const banner = document.getElementById('banner');
        if (!banner) return;

        banner.style.transform = banner.style.transform === 'translateX(100%)' ? 'translateX(0%)' : 'translateX(100%)';
    }

    return (
        <Center h='100%'>

            <Paper
                radius='lg'
                shadow='xl'
                style={{
                    overflow: 'hidden'
                }}
            >
                
                <Group
                    pos='relative'
                >
                    
                    <Paper
                        id='banner'
                        pos='absolute'
                        h='100%'
                        w='50%'
                        display='flex'
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'transform 0.5s ease-in-out',
                            zIndex: 100
                        }}
                    >
                        <Image
                            src='/logo.png'
                            height={150}
                            w='auto'
                            top={0}
                            left={0}
                        />
                    </Paper>

                    <Register toggleVisible={toggleVisible} />
                    <Login toggleVisible={toggleVisible} />

                </Group>

            </Paper>

        </Center>
    );
}
