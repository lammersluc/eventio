export const getImage = (id: string, hash: string | null, folder: string, type = 'avatar'): string => {
    
    if (!hash) {
        id = 'default';
        hash = '';
    } else {
        hash = '?h=' + hash;
    }

    return process.env.APP_URL + `/public/${folder}/${id}/${type}.png` + hash;
}

export const createHash = (data: string): string => {
    return require('crypto').createHash('sha1').update(data).digest('hex');
}