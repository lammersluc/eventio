import { t } from "elysia";

interface Body {
    user: string;
    password: string;
}

export const service = async ({
    body
}: {
    body: Body
}) => {
    return { token: body.user + "1234"};
}

export const validation = {
    body: t.Object({
        user: t.String(),
        password: t.String()
    }),
    response: t.Object({
        token: t.String()
    })
}