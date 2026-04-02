import { NextRequest } from 'next/server';
import {api} from "@/app/src/ApiRequests";
import {handleServerError} from "@/app/src/server";
import boolean from "@rc-component/async-validator/es/validator/boolean"; // adjust path

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = searchParams.get('page') ?? '1';
        const name = searchParams.get('name') ?? undefined;
        const ingredientIDs = searchParams.get('ingredient') ?? undefined;
        const ownCollection = searchParams.get('ownCollection') ?? undefined;
        const sort = searchParams.get('sort') ?? undefined;
        const maxAbv = searchParams.get('maxAbv') ?? undefined;
        const minAbv = searchParams.get('minAbv') ?? undefined;

        const data = await api.listCocktails({
            page,
            name,
            ingredientIDs,
            ownCollection: ownCollection,
            sort,
            maxAbv,
            minAbv,
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