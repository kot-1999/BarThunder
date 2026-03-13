'use server';

import {api} from "@/app/src/ApiRequests";
import {getOrCreateBar} from "@/app/src/getOrCreateBar";
import CocktailDetails from "@/app/components/CocktailDetails";

interface Props {
    params: {
        id: string
    }
}

export default async function DrinkDetails({ params }: Props) {
    await getOrCreateBar();

    const values = await params

    const cocktail = await api.getCocktail(values.id)

    return (
        <div>
            <CocktailDetails cocktail={cocktail.data}/>
        </div>
    );
}