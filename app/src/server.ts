'use server'
import {cookies} from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function request(
    url: string,
    options: RequestInit = {},
    isRoot = false
) {
    try {
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
        console.log('----------', `${baseUrl}${url}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(options.headers || {}),
                },
                cache: 'no-store',
                body: options.body ?? undefined,
                method: options.method ?? undefined
            })
        if (isRoot) {
            return response
        }

        const data = await response.json()

        if (!response.ok) {
            throw new Error(
                data?.message || 'Something went wrong'
            );
        }

        return data;
    } catch (error: any) {
        console.error('API ERROR:', error.message);
        throw error;
    }
}

type Key = 'token'

export async function setCookie(key: Key, data: any) {
    const cookieStore = await cookies();
    cookieStore.set(key, JSON.stringify(data), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12, // 12 hours
    });
}
export async function getCookie(key: Key) {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('token')

    if (cookie?.value) {
        return JSON.parse(cookie.value)
    }

    return null
}

export async function deleteCookie(key: Key) {
    const cookieStore = await cookies();

    cookieStore.delete(key);
}