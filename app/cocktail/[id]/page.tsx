'use server';

import {api} from "@/app/src/ApiRequests";
import CocktailDetails from "@/app/components/CocktailDetails";
import ChuckNorrisJoke from "@/app/components/ChuckNorris";

interface Props {
    params: {
        id: string
    }
}

export default async function DrinkDetails({ params }: Props) {
    const values = await params

    const cocktail = await api.getCocktail(values.id)

    return (
        <div>
            <ChuckNorrisJoke/>
            <CocktailDetails cocktail={cocktail.data}/>
        </div>
    );
}