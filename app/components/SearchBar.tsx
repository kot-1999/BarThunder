'use client'

import {Button, Form, Input, Select} from "antd"
import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {showError} from "@/app/src/helpers";
import {SearchOutlined} from "@ant-design/icons";



export default function SearchBar() {
    // Hooks
    const [loading, setLoading] = useState(true);
    const [ingredientOptions, setIngredientOptions] = useState<any[]>([]);
    const [ingredientLoading, setIngredientLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // AntD
    const [form] = Form.useForm();

    const currentParams = Object.fromEntries(searchParams.entries());


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

    return (
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
                ></Select>
                {/*<SearchOutlined />*/}
                {/*<FilterOutlined />*/}

            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Search
                </Button>
            </Form.Item>
        </Form>
    )
}