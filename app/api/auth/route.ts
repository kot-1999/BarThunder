'use server';

import { api } from "@/app/src/ApiRequests";
import {getCookie, handleServerError, IError} from "@/app/src/server";
import {NextResponse} from "next/server";

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

export async function PUT() {
    try {
        const res = api.logout()

        const response = NextResponse.json({}, { status: 200 });
        response.cookies.delete("userToken");
        response.cookies.delete("userData");
        return response;
    } catch (err: IError | any) {
        return handleServerError(err)
    }
}

export async function GET() {
    try {
        const isAuthenticated = await getCookie('userToken')

        return new Response(JSON.stringify({ isAuthenticated: !!isAuthenticated }), { status: 200 })

    } catch (err: IError | any) {
        return handleServerError(err)
    }
}