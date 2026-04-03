'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import CocktailList from "@/app/components/CocktailList";
import SimplePagination from "@/app/components/SimplePagination";
import { showError } from "@/app/src/helpers";
import SearchBar from "@/app/components/SearchBar";

export default function App() {
    const searchParams = useSearchParams();

    const [cocktails, setCocktails] = useState<any>(null);

    // Fetch cocktails data
    useEffect(() => {
        async function load() {
            try {
                const query = new URLSearchParams(searchParams.toString());
                query.set('perPage', '24');

                const res = await fetch(`/api/cocktails?${query.toString()}`);
                const data = await res.json();
                if (!res.ok) {
                    showError(data);
                    return;
                }

                setCocktails(data);
            } catch (err) {
                showError(err);
            }
        }

        load();
    }, [searchParams]);



    return (
        <div>
            <SearchBar></SearchBar>

            <CocktailList cocktails={cocktails?.data ?? []} showAddNew={false} results={cocktails?.meta.total} />

            <SimplePagination
                pagination={{
                    current: cocktails?.meta?.current_page ?? 1,
                    total: cocktails?.meta.total ?? 0,
                    perPage: cocktails?.meta.per_page ?? 24
                }}
            />

        </div>
    );
}