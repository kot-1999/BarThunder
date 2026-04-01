'use client';

import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import CocktailList from "@/app/components/CocktailList";
import {showError} from "@/app/src/helpers";
import CocktailUploadForm from "@/app/components/CocktailUploadForm";
import {Button, Modal} from "antd";
import SimplePagination from "@/app/components/SimplePagination";
import SearchBar from "@/app/components/SearchBar";

export default function MyShelf() {
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [cocktails, setCocktails] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const query = new URLSearchParams(searchParams.toString());
                query.set('ownCollection', 'true');
                query.set('sort', 'created_at');
                const res = await fetch(`/api/cocktails?${query.toString()}`);                const data = await res.json();
                if (!res.ok) {
                    showError(data);
                    return;
                }

                setCocktails(data);
            } catch (err) {
                showError(err);
            }
        }
        load()
    }, [searchParams])

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">My Shelf</h1>
            <Button type="primary" onClick={() => setOpen(true)}>
                Add New
            </Button>

            <Modal
                title="Create Cocktail"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnClose
                width={700}
            >
                <CocktailUploadForm onSuccess={() => setOpen(false)} />
            </Modal>

            <SearchBar/>

            <CocktailList cocktails={cocktails?.data ?? []}></CocktailList>

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