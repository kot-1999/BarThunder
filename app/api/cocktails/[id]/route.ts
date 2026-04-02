import { NextRequest } from 'next/server';
import {api} from "@/app/src/ApiRequests";
import {handleServerError} from "@/app/src/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const data = await api.getCocktail(id)

        return Response.json(data);
    } catch (err) {
        return handleServerError(err)
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const { rating } = await req.json();

        await api.rateCocktail(id, rating);

        const cocktail = await api.getCocktail(id)
        return Response.json(cocktail);
    } catch (err) {
        return handleServerError(err);
    }
}