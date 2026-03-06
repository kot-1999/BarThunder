'use client'

import { Input, Button, Form } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

export default function CocktailSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form] = Form.useForm();

    const currentParams = Object.fromEntries(searchParams.entries());

    const onFinish = (values: any) => {
        const params = new URLSearchParams(searchParams.toString());
        console.log(values)
        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                params.set(key, String(value))
            } else {
                params.delete(key)
            }
        });

        params.delete('page')

        // This triggers server component to rerun
        router.replace(`?${params.toString()}`);
    };

    return (
        <Form form={form} layout="inline" onFinish={onFinish}>
            <Form.Item name="name" initialValue={currentParams?.name ?? ''}>
                <Input placeholder="Cocktail name" allowClear />
            </Form.Item>

            <Form.Item name="ingredient">
                <Input placeholder="Ingredient" value={currentParams?.ingredient ?? ''} allowClear />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Search</Button>
            </Form.Item>
        </Form>
    );
}