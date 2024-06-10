import jwt from 'jsonwebtoken';

import prisma from '#/services/database';

const secret = process.env.JWT_SECRET!;
const accessExpiry = process.env.ACCESS_EXPIRY!;
const refreshExpiry = process.env.REFRESH_EXPIRY!;

type Token = {
    type: 'access' | 'refresh';
    uid: number;
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
    if (!refreshToken) return access.uid;

    let refresh: Token;

    try {
        refresh = jwt.verify(refreshToken, secret) as Token;
    } catch {
        return false;
    }

    if (
        refresh.type !== 'refresh' ||
        access.uid !== refresh.uid ||
        access.iat !== refresh.iat
    ) return false;

    const user = await prisma.user.findUnique({
        where: {
            id: access.uid
        }
    });

    if (
        !user ||
        Math.floor(user.updated_at.getTime() / 1000) > access.iat
    ) return false;

    return access.uid;
};

export const generateTokens = (uid: number) => ({
    accessToken: jwt.sign({ type: 'access', uid }, secret, { expiresIn: accessExpiry }),
    refreshToken: jwt.sign({ type: 'refresh', uid }, secret, { expiresIn: refreshExpiry })
});