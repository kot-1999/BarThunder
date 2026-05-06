import { NextRequest } from 'next/server';
import {api} from "@/app/src/ApiRequests";
import {handleServerError} from "@/app/src/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const data = await api.listCocktails({
            page: searchParams.get('page') ?? '1',
            name: searchParams.get('name') ?? undefined,
            ingredientIDs: searchParams.get('ingredient') ?? undefined,
            ownCollection: searchParams.get('ownCollection') ?? undefined,
            sort: searchParams.get('sort') ?? undefined,
            maxAbv: searchParams.get('maxAbv') ?? undefined,
            minAbv: searchParams.get('minAbv') ?? undefined,
            perPage: searchParams.get('perPage') ?? undefined,
            minRating: searchParams.get('minRating') ?? undefined,
            maxRating: searchParams.get('maxRating') ?? undefined

        });

        return Response.json(data);
    } catch (err) {
        return handleServerError(err)
    }
}

export async function POST(req: NextRequest) {
    try {
        const data =  await req.json()
        const cocktail = await api.createCocktail(data)
        const collection = await api.getCollection()
        await api.updateCollection([cocktail.data.id, ...collection.data.cocktails.map((item: { id: string }) => item.id)])

        return Response.json('All ok')
    } catch (err) {
        return handleServerError(err)
    }
}