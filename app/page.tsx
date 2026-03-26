'use client'

import { useEffect, useState } from "react";
import { Input, Button, Form, Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

import CocktailList from "@/app/components/CocktailList";
import SimplePagination from "@/app/components/SimplePagination";
import { showError } from "@/app/src/helpers";
import ChuckNorrisJoke from "@/app/components/ChuckNorris";

export default function App() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form] = Form.useForm();

    const [cocktails, setCocktails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [ingredientOptions, setIngredientOptions] = useState<any[]>([]);
    const [ingredientLoading, setIngredientLoading] = useState(false);

    const currentParams = Object.fromEntries(searchParams.entries());

    // Fetch cocktails data
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

    // Fetch ingredients
    const handleIngredientSearch = async (value: string = 'a') => {
        if (!value) {
            setIngredientOptions([]);
            return;
        }

        try {
            setIngredientLoading(true);

            const res = await fetch(`/api/ingredients?search=${value}`);
            const result = await res.json();
            if (!res.ok) {
                showError(result);
                return;
            }

            setIngredientOptions(
                result.data.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }))
            );
        } catch (err) {
            showError(err);
        } finally {
            setIngredientLoading(false);
        }
    };

    // Form submission
    const onFinish = (values: any) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                params.set(key, value.join(','));
            } else if (value) {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        params.delete("page");
        router.replace(`?${params.toString()}`);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <ChuckNorrisJoke/>
            <Form form={form} layout="inline" onFinish={onFinish}>
                <Form.Item name="name" initialValue={currentParams?.name ?? ''}>
                    <Input placeholder="Cocktail name" allowClear />
                </Form.Item>

                <Form.Item
                    name="ingredient"
                    initialValue={currentParams?.ingredient ? currentParams.ingredient.split(',') : []}
                >
                    <Select
                        style={{ minWidth: 200 }}
                        mode="multiple"
                        placeholder="Ingredient"
                        allowClear
                        showSearch
                        onSearch={handleIngredientSearch}
                        options={ingredientOptions}
                        onFocus={() => handleIngredientSearch()}
                        loading={ingredientLoading}
                        filterOption={false}
                    />
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