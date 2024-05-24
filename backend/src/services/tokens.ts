import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

type Token = {
    type: 'access' | 'refresh';
    uid: number;
    iat: number;
    exp: number;
};

export const checkTokens = (accessToken: string, refreshToken?: string) => {
    let access: Token;

    try {
        access = jwt.verify(accessToken, secret, {
            ignoreExpiration: refreshToken ? true : false
        }) as Token;
    } catch {
        return false;
    }

    if (access.type !== 'access') return false;
    if (!refreshToken) return access.uid;

    let refresh: Token

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

    return access.uid;
}

export const generateTokens = (uid: number) => ({
    accessToken: jwt.sign({ type: 'access', uid }, secret, { expiresIn: '10m' }),
    refreshToken: jwt.sign({ type: 'refresh', uid }, secret, { expiresIn: '7d' }),
});