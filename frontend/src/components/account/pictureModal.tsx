import React from 'react';
import { Modal, Stack, Button, Group, Paper, Text, Anchor, Slider } from '@mantine/core';
import { IconUpload, IconDeviceFloppy } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import AvatarEditor from 'react-avatar-editor';
import sharp from 'sharp';

import client from '@/lib/client';
import { format } from 'path';

export const PictureModal = ({
    opened,
    onClose
}: {
    opened: boolean;
    onClose: () => void;
}) => {
    const [file, setFile] = React.useState<File | null>(null);
    const [zoom, setZoom] = React.useState(1);

    const editor = React.useRef(null);

    const handleSave = async () => {

        if (!file || !editor.current) {
            await client.account.image.delete();
            onClose();
            return;
        }

        const image = (editor.current as AvatarEditor).getImage().toDataURL();

        await client.account.image.post({
            image
        });

        onClose();

        await new Promise((resolve) => setTimeout(resolve, 500));
        setFile(null);
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title='Change Picture'
            radius='lg'
        >
            <Stack
                p='md'
                gap='md'
                align='center'
            >

                <Paper
                    w='256px'
                    h='256px'
                    shadow='sm'
                    radius='xl'
                    style={{
                        overflow: 'hidden'
                    }}
                >
                    {file ?
                        <AvatarEditor
                            ref={editor}
                            image={file}
                            width={256}
                            height={256}
                            border={0}
                            borderRadius={256}
                            scale={zoom}
                        />
                        :
                        <Dropzone
                            w='100%'
                            h='100%'
                            pt='xl'
                            onDrop={([file]) => {setZoom(1); setFile(file);}}
                            maxFiles={1}
                            maxSize={5 * 1024 ** 2}
                            accept={IMAGE_MIME_TYPE}
                            style={{
                                border: 'none'
                            }}
                        >
                            <Stack
                                justify='center'
                                align='center'
                                style={{
                                    cursor: 'pointer'
                                }}
                            >

                                <IconUpload
                                    size={128}
                                    color='gray'
                                />

                                <Stack
                                    gap={0}
                                    align='center'
                                >

                                    <Text
                                        size='md'
                                        c='gray'
                                    >
                                        Drop or click to upload
                                    </Text>

                                    <Text
                                        size='sm'
                                        c='gray'
                                    >
                                        (max 5mb)
                                    </Text>

                                </Stack>

                            </Stack>
                        </Dropzone>
                    }
                </Paper>

                {file &&
                    <Slider
                        w='256px'
                        value={zoom}
                        min={1}
                        max={5}
                        step={0.1}
                        onChange={setZoom}
                    />
                }

                <Anchor
                    c='red'
                    onClick={() => setFile(null)}
                >
                    Remove Picture
                </Anchor>


                <Stack
                    gap='md'
                    align='center'
                >

                    <Group
                        w='100%'
                        gap='xs'
                        justify='space-between'
                    >

                        <Button
                            radius='md'
                            variant='outline'
                            color='gray'
                            onClick={() => {
                                setFile(null);
                                setZoom(1);
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            radius='md'
                            leftSection={<IconDeviceFloppy />}
                            onClick={handleSave}
                        >
                            Save
                        </Button>

                    </Group>

                </Stack>

            </Stack>
        </Modal>
    );
}