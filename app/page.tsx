'use client'

import { useEffect, useState } from "react";
import { Input, Button, Form } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

import CocktailList from "@/app/components/CocktailList";
import SimplePagination from "@/app/components/SimplePagination";
import { showError } from "@/app/src/helpers";

export default function App() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form] = Form.useForm();

    const [cocktails, setCocktails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const currentParams = Object.fromEntries(searchParams.entries());

    // ---- FETCH DATA ----
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/cocktails?${searchParams.toString()}`);
                const data = await res.json();

                if (!res.ok) {
                    showError(data);
                    return;
                }

                setCocktails(data);
            } catch (err) {
                showError(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [searchParams]);

    // ---- SEARCH HANDLER ----
    const onFinish = (values: any) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([key, value]) => {
            if (value) params.set(key, String(value));
            else params.delete(key);
        });

        params.delete("page");

        router.replace(`?${params.toString()}`);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>

            <Form form={form} layout="inline" onFinish={onFinish}>
                <Form.Item name="name" initialValue={currentParams?.name ?? ''}>
                    <Input placeholder="Cocktail name" allowClear />
                </Form.Item>

                <Form.Item name="ingredient" initialValue={currentParams?.ingredient ?? ''}>
                    <Input placeholder="Ingredient" allowClear />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                </Form.Item>
            </Form>

            <CocktailList cocktails={cocktails.data} />

            <SimplePagination
                pagination={{
                    current: cocktails.meta.current_page,
                    total: cocktails.meta.total,
                    perPage: cocktails.meta.per_page
                }}
            />

        </div>
    );
}