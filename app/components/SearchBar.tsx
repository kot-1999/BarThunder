import { Button, Dropdown, Form, Input, Select, Slider, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { showError } from "@/app/src/helpers";

const { Text } = Typography;

export default function SearchBar() {
    const [ingredientOptions, setIngredientOptions] = useState<any[]>([]);
    const [ingredientLoading, setIngredientLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form] = Form.useForm();
    const currentParams = Object.fromEntries(searchParams.entries());

    const handleIngredientSearch = async (value: string = "a") => {
        if (!value) {
            setIngredientOptions([]);
            return;
        }
        try {
            setIngredientLoading(true);
            const res = await fetch(`/api/ingredients?search=${value}`);
            const result = await res.json();
            if (!res.ok) return showError(result);
            setIngredientOptions(result.data.map((i: any) => ({ label: i.name, value: i.id })));
        } finally {
            setIngredientLoading(false);
        }
    };

    const onFinish = (values: any) => {
        const params = new URLSearchParams(searchParams.toString());
        if (values.name) params.set("name", values.name);
        else params.delete("name");

        if (values.ingredient?.length) params.set("ingredient", values.ingredient.join(","));
        else params.delete("ingredient");

        if (values.abv?.length === 2) {
            params.set("minAbv", String(values.abv[0]));
            params.set("maxAbv", String(values.abv[1]));
        } else {
            params.delete("minAbv");
            params.delete("maxAbv");
        }

        params.delete("page");
        router.replace(`?${params.toString()}`);
    };

    // Dropdown content
    const filterContent = (
        <div className="p-4 pr-8 w-64 bg-white shadow-lg rounded space-y-4">
            <Form form={form} layout="vertical">
                <Form.Item
                    name="ingredient"
                    label={<Text>Cocktail Ingredients</Text>}
                    initialValue={currentParams?.ingredient ? currentParams.ingredient.split(",") : []}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select ingredients..."
                        allowClear
                        showSearch
                        onSearch={handleIngredientSearch}
                        options={ingredientOptions}
                        onFocus={() => handleIngredientSearch()}
                        loading={ingredientLoading}
                        filterOption={false}
                        className="w-full"
                    />
                </Form.Item>
                <Form.Item
                    name="abv"
                    label={<Text>Alcohol by Volume (ABV)</Text>}
                    initialValue={[Number(currentParams?.minAbv) || 0, Number(currentParams?.maxAbv) || 40]}
                >
                    <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        marks={{ 0: "0%", 40: "40%", 100: "100%" }}
                        tooltip={{ formatter: (v) => `${v}%` }}
                        className="w-full"
                    />
                </Form.Item>
            </Form>
        </div>
    );

    return (
        <div className="w-full flex justify-center gap-2">
            <Form form={form} layout="inline" onFinish={onFinish} className="flex gap-2 items-center">
                <Form.Item
                    name="name"
                    initialValue={currentParams?.name ?? ""}
                    className="flex-1"
                >
                    <Input placeholder="Type cocktail name..." allowClear className="w-full" />
                </Form.Item>

                <Dropdown
                    trigger={['click']}
                    placement="bottomLeft"
                    popupRender={() => filterContent}
                >
                    <Button type="default" icon={<FilterOutlined className="text-xl" />} />
                </Dropdown>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}