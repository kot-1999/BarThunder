import {cookies} from "next/headers";

// ===============================
// ERROR HANDLING
// ===============================

export class IError extends Error {
    messages: string[]
    status: number | string
    constructor(status: number | string, messages: string[]) {
        super();

        this.messages = messages;
        this.status = status;
    }
}

export const handleServerError = (err: IError | any) => {
    if (err.status) {
        const messages = err.messages[0]?.length ? err.messages.map((message: string[]) => message[0]) : err.messages;
        return new Response(JSON.stringify({ messages: messages }), { status: err.status });
    } else {
        return new Response(JSON.stringify({ messages: [err.message] }), { status: 500 });
    }
}

// ===============================
// API REQUEST
// ===============================

const baseUrl = process.env.API_URL;

export async function request(
    url: string,
    options: RequestInit = {},
    isRoot = false
) {
    try {
        console.info('API Request', `${baseUrl}${url}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(options.headers || {}),
                },
                cache: 'no-store',
                body: options.body ?? {},
                method: options.method ?? undefined
            }
            )
        const response = await fetch(

            `${baseUrl}${url}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(options.headers || {}),
                },
                cache: 'no-store',
                body: options.body ?? undefined,
                method: options.method ?? undefined
            }
        );

        if (isRoot) {
            return response
        }

        const data = response.ok ? await response.json() : {}
        if (!response.ok) {
            if (data.errors) {
                // data.errors is like: { email: ["..."], password: ["..."] }
                const messages: string[] = Object.values(data.errors) // array of arrays

                throw new IError(response.status, messages);
            } else {
                throw new Error(response.statusText);
            }

        }

        return data;
    } catch (error: any) {
        throw error;
    }
}

// ===============================
// COOKIES
// ===============================

type Key = 'userToken' | 'root' | 'userData'

export async function setCookie(key: Key, data: any) {
    const cookieStore = await cookies();
    cookieStore.set(key, JSON.stringify(data), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 1, // 1 hour
    });
}
export async function getCookie(key: Key) {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key)
    if (cookie?.value) {
        return JSON.parse(cookie.value)
    }

    return null
}
