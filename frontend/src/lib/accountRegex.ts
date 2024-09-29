import { zxcvbn } from "@zxcvbn-ts/core";

export const checkUsername = (username: string) => {
    return /^[a-z0-9_]{3,16}$/.test(username) ?
        null : '3-16 characters (a-z, 0-9, _)';
}

export const checkEmail = (email: string) => {
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(email) ?
        null : 'Invalid email';
}

export const checkPassword = (password: string) => {
    return zxcvbn(password).score > 2 ?
        null : 'Password not strong enough';
}

export const checkPasswordStrength = (password: string) => {
    const score = zxcvbn(password).score;

    return {
        strength: score * 25,
        color: score < 3 ? 'red' : 'blue'
    }
}