'use server'

import { getOrCreateBar } from "@/app/src/getOrCreateBar";
import { api } from "@/app/src/ApiRequests";
import CocktailList from "@/app/drinks/page";

export default async function App() {
    await getOrCreateBar();

    const cocktails = await api.listCocktails();

    return <CocktailList cocktails={cocktails.data} />;
}