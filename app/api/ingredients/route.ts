import {NextRequest} from "next/server";
import {api} from "@/app/src/ApiRequests";
import {handleServerError} from "@/app/src/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const search = searchParams.get('search')

        const data = await api.getIngredients(search ?? undefined);

        return Response.json(data);
    } catch (err) {
        return handleServerError(err)
    }
}