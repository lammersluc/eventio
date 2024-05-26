import jwt from 'jsonwebtoken';
import qrcode from 'qrcode';

const secret = process.env.QR_SECRET!;
const expiry = process.env.QR_EXPIRY!;

type Token = {
    id: number;
    type: 'ticket' | 'wallet';
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

export const generateQR = async (id: number, type: string) => await qrcode.toDataURL(jwt.sign({ id, type }, secret, { expiresIn: expiry }));