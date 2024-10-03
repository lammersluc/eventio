export const getImage = (id: string, hash: string | null, type: string): string => {
    
    if (!hash) {
        id = 'default';
        hash = '';
    } else {
        hash = '?h=' + hash;
    }

    return process.env.APP_URL + `/public/images/${type}/${id}.png` + hash;
}