'use client';

interface Props {
    params: {
        id: string;
    };
}

export default function DrinkDetails({ params }: Props) {
    return (
        <div>
            <h1>Drink #{params.id}</h1>
        </div>
    );
}