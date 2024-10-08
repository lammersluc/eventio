import fs from 'fs';
import sharp from 'sharp';

import prisma from '@/services/database';

export const getImage = (id: string, hash: string | null, folder: string, type = 'avatar'): string => {

    if (!hash) {
        id = 'default';
        hash = '';
    } else {
        hash = '?h=' + hash;
    }

    return process.env.APP_URL + `/public/${folder}/${id}/${type}.png` + hash;
}

export const createImage = async (file: File, folder: string, id: string, name = 'avatar'): Promise<string> => {
    const dir = `public/${folder}/${id}`;

    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);

    const { width, height } = resolutions(name);

    const image = sharp(await file.arrayBuffer());
    const metadata = await image.metadata();

    if (
        metadata.format !== 'png' ||
        metadata.width !== width ||
        metadata.height !== height
    ) return '';

    image.toFile(`${dir}/${name}.png`);

    return require('crypto').createHash('sha1').update(file).digest('hex');
}

export const deleteImage = (folder: string, id: string, name = 'avatar') => {
    const dir = `public/${folder}/${id}`;

    if (fs.existsSync(`${dir}/${name}.png`))
        fs.unlinkSync(`${dir}/${name}.png`);

    if (fs.readdirSync(dir).length === 0)
        fs.rmdirSync(dir);
}

const resolutions = (type: string) => {
    switch (type) {
        case 'avatar':
            return { width: 256, height: 256 };
        case 'banner':
            return { width: 384, height: 256 };
        default:
            return { width: 64, height: 64 };
    }
}