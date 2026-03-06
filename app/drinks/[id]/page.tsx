'use client';

interface Props {
    params: {
        id: string;
        name: string
    };
}

export default function DrinkDetails({ params }: Props) {
    console.log(params)

    return (
        <div>
            <h1>Drink #{params.id}</h1>
        </div>
    );
}