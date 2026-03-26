import { NextRequest, NextResponse } from 'next/server';
import {getCookie, handleServerError} from "@/app/src/server";

export async function POST(req: NextRequest) {
    try {
        const userToken = await getCookie('userToken');
        const incomingFormData = await req.formData();

        // Create new FormData for backend
        const formData = new FormData();

        // Copy all fields (important!)
        for (const [key, value] of incomingFormData.entries()) {
            formData.append(key, value as any);
        }

        const res = await fetch(`${process.env.API_URL}/api/images`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken}`,
                Accept: 'application/json',
            },
            body: formData,
        });
        const data = await res.json();

        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        return handleServerError(err)
    }
}