'use server'

import { getOrCreateBar } from "@/app/src/getOrCreateBar";
import { api } from "@/app/src/ApiRequests";
import CocktailList from "@/app/components/CocktailList";
import CocktailSearch from "@/app/components/CocktailSearch";
import SimplePagination from "@/app/components/SimplePagination";

export default async function App({ searchParams }: { searchParams: Record<string, string> }) {
    await getOrCreateBar();

    const search = await searchParams
    const cocktails = await api.listCocktails({
        page: search?.page ?? 1,
        name: search?.name ?? null,
        ingredientName: search?.ingredient ?? null,
    });

    return <div>

        <CocktailSearch/>
        <CocktailList cocktails={cocktails.data} />
        <SimplePagination pagination={{ current: cocktails.meta.current_page, total: cocktails.meta.total, perPage: cocktails.meta.per_page }} />
    </div>;
}