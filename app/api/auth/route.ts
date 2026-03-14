'use server';

import { api } from "@/app/src/ApiRequests";
import {handleServerError, IError} from "@/app/src/server";

export async function POST(req: Request) {
    try {
        const body = await req.json() as { mode: 'login' | 'register'; email: string; password: string; name?: string };

        let result;

        if (body.mode === 'login') {
            result = await api.login({ email: body.email, password: body.password });
        } else if (body.mode === 'register') {
            result = await api.register({ email: body.email, password: body.password, name: body.name as string });
        }

        return new Response(JSON.stringify({ success: true, data: result }), { status: 200 })

    } catch (err: IError | any) {
        return handleServerError(err)
    }
}