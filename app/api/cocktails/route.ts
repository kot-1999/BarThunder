import { NextRequest } from 'next/server';
import {api} from "@/app/src/ApiRequests";
import {handleServerError} from "@/app/src/server"; // adjust path

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = searchParams.get('page') ?? '1';
        const name = searchParams.get('name') ?? undefined;
        const ingredientIDs = searchParams.get('ingredient') ?? undefined;

        const data = await api.listCocktails({
            page,
            name,
            ingredientIDs,
        });

        return Response.json(data);
    } catch (err) {
        console.error(err);
        return handleServerError(err)
    }
}

export async function POST(req: NextRequest) {
    try {
        const data =  await req.json()
        await api.createCocktail(data)
        return Response.json('All ok')
    } catch (err) {
        return handleServerError(err)
    }
}