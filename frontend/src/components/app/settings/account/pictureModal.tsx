import React from 'react';
import { Modal, Stack, Button, Group, Paper, Text, Anchor, Slider } from '@mantine/core';
import { IconUpload, IconDeviceFloppy } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import AvatarEditor from 'react-avatar-editor';

import client from '@/lib/client';

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
            await client.account.avatar.post({
                avatar: null
            });
            onClose();
            return;
        }

        const canvas = (editor.current as AvatarEditor).getImageScaledToCanvas();

        const res = 256;

        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = res;
        resizedCanvas.height = res;
        const ctx = resizedCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(canvas, 0, 0, res, res);
        }
        const avatar = resizedCanvas.toDataURL();

        await client.account.avatar.post({
            avatar
        });

        onClose();

        await new Promise((resolve) => setTimeout(resolve, 200));
        setFile(null);
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title='Change Picture'
            radius='lg'
            centered={true}
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
                            onDrop={([file]) => { setZoom(1); setFile(file); }}
                            maxFiles={1}
                            accept={IMAGE_MIME_TYPE}
                            style={{
                                border: 'none'
                            }}
                        >
                            <Stack
                                my='xl'
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

                                <Text
                                    size='md'
                                    c='gray'
                                >
                                    Drop or click to upload
                                </Text>

                            </Stack>
                        </Dropzone>
                    }
                </Paper>

                {file &&
                    <Stack
                        gap='xs'
                        align='center'
                    >

                        <Slider
                            w='256px'
                            value={zoom}
                            min={1}
                            max={5}
                            step={0.01}
                            label={null}
                            onChange={setZoom}
                        />

                        <Anchor
                            c='red'
                            onClick={() => setFile(null)}
                        >
                            Remove Picture
                        </Anchor>

                    </Stack>
                }


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
                            {file ? 'Save' : 'Remove'}
                        </Button>

                    </Group>

                </Stack>

            </Stack>
        </Modal>
    );
}