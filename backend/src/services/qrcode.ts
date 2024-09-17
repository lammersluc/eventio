import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secret = process.env.QR_SECRET!;
const iv = crypto.randomBytes(16);

const expiry = 35 * 1000;

type Encrypted = {
    iv: string;
    encryptedData: string
};

type Data = {
    id: string;
    type: 'ticket' | 'wallet';
    exp: number;
};

export const checkData = async (string: string) => {

    const encrypted = await JSON.parse(string) as Encrypted;
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), Buffer.from(encrypted.iv, 'hex'));

    let decrypted = decipher.update(Buffer.from(encrypted.encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const data = await JSON.parse(decrypted.toString()) as Data;

    if (data.exp < Date.now()) return false;

    return data;
};

export const generateData = (id: string, type: string) => {
    const text = JSON.stringify({ id, type, exp: Date.now() + expiry });
    
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return JSON.stringify({ iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') });
}