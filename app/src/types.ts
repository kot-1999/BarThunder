export type Cocktail = {
    id: number;
    name: string;
    slug: string;
    instructions: string;
    garnish: string | null;
    description: string;
    source: string;
    public_id: string | null;
    public_at: string | null;
    abv: number
    images: {
        id: number;
        file_path: string;
        url: string;
        thumb_url: string;
        copyright: string;
        sort: number;
        placeholder_hash: string;
    }[];
    method: {
        id: number;
        name: string;
        dilution_percentage: number
    }
    tags: {
        id: number;
        name: string;
    }[];
    rating: {
        user: number | null;
        average: number;
        total_votes: number;
    };
    glass: {
        id: number;
        name: string;
        description: string;
        volume: number | null;
        volume_units: string | null;
    };
    ingredients: {
        sort: number;
        amount: number;
        amount_max: number | null;
        units: string;
        optional: boolean;
        ingredient: {
            id: number;
            slug: string;
            name: string;
        };
        note: string | null;
        is_specified: boolean;
        formatted: {
            ml: {
                amount: number;
                amount_max: number | null;
                units: string;
                full_text: string;
            };
            oz: {
                amount: number;
                amount_max: number | null;
                units: string;
                full_text: string;
            };
            cl: {
                amount: number;
                amount_max: number | null;
                units: string;
                full_text: string;
            };
        };
        in_shelf: boolean;
        in_shelf_as_variant: boolean;
        in_shelf_as_substitute: boolean;
        in_shelf_as_complex_ingredient: boolean;
        in_bar_shelf: boolean;
        in_bar_shelf_as_substitute: boolean;
        in_bar_shelf_as_complex_ingredient: boolean;
        in_bar_shelf_as_variant: boolean;
    }[];
};

export type Meta = {
    current_page: number
    total: number
    per_page: number
}