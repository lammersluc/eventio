import jwt from 'jsonwebtoken';
import qrcode from 'qrcode';

const secret = process.env.SECRET!;

type Token = {
    ticket: number;
    iat: number;
    exp: number;
};

export const checkQR = async (qrCode: string) => {
    try {
        return jwt.verify(qrCode, secret) as Token;
    } catch {
        return false;
    }
};

export const generateQR = async (ticket: number) => await qrcode.toDataURL(jwt.sign({ ticket }, secret, { expiresIn: '30s' }));
