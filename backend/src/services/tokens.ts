import jwt from 'jsonwebtoken';

import prisma from '@/services/database';

const secret = process.env.JWT_SECRET!;
const accessExpiry = process.env.ACCESS_EXPIRY!;
const refreshExpiry = process.env.REFRESH_EXPIRY!;

type Token = {
    type: 'access' | 'refresh';
    id: string;
    iat: number;
    exp: number;
};

export const checkTokens = async (accessToken: string, refreshToken?: string) => {
    let access: Token;

    try {
        access = jwt.verify(accessToken, secret, {
            ignoreExpiration: refreshToken ? true : true
        }) as Token;
    } catch {
        return false;
    }

    if (access.type !== 'access') return false;
    if (!refreshToken) return access.id;

    let refresh: Token;

    try {
        refresh = jwt.verify(refreshToken, secret) as Token;
    } catch {
        return false;
    }

    if (
        refresh.type !== 'refresh' ||
        access.id !== refresh.id ||
        access.iat !== refresh.iat
    ) return false;

    const user = await prisma.user.findUnique({
        where: {
            id: access.id
        }
    });

    if (
        !user ||
        Math.floor(user.updated_at.getTime() / 1000) > access.iat
    ) return false;

    return access.id;
};

export const generateTokens = (id: string) => ({
    accessToken: jwt.sign({ type: 'access', id }, secret, { expiresIn: accessExpiry }),
    refreshToken: jwt.sign({ type: 'refresh', id }, secret, { expiresIn: refreshExpiry })
});