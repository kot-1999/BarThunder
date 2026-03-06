'use server';

import {api} from "@/app/src/ApiRequests";

interface Props {
    params: {
        id: string
    }
}

export default async function DrinkDetails({ params }: Props) {
    const values = await params

    const cocktail = await api.getCocktail(values.id)

    console.log(cocktail.data)

    return (
        <div>
            <h1>Drink #{values.id}</h1>
        </div>
    );
}