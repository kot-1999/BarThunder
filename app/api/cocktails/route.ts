import { NextRequest } from 'next/server';
import {api} from "@/app/src/ApiRequests";
import {handleServerError} from "@/app/src/server"; // adjust path

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = searchParams.get('page') ?? '1';
        const name = searchParams.get('name') ?? undefined;
        const ingredientIDs = searchParams.get('ingredient') ?? undefined;
        console.log(name, ingredientIDs);
        const data = await api.listCocktails({
            page,
            name,
            ingredientIDs,
        });

        return Response.json(data);
    } catch (err) {
        return handleServerError(err)
    }
}

// export async function POST(req: NextRequest) {
//     try {
//         const { body } = req
//
//         api.
//     } catch (err) {
//         return handleServerError(err)
//     }
// }