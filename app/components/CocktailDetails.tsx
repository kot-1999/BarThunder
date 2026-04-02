'use client'

import { useRouter } from "next/navigation";
import {Cocktail} from "@/app/src/types";
import {
    Card,
    Row,
    Col,
    Tag,
    List,
    Divider,
    Button, Flex, Steps, theme
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import {useState} from "react";

export default function CocktailDetails({ cocktail }: { cocktail: Cocktail }) {
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const { token } = theme.useToken();
    const totalAmount = cocktail.ingredients.reduce((sum, item) => sum + item.amount, 0);

    return (
        <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
            <Button onClick={() => router.back()} style={{ marginBottom: 16 }}>
                ← Back
            </Button>

            <Card>
                <Row gutter={[32, 32]}>
                    {/* Image */}
                    <Col xs={24} md={10}>
                        {cocktail.images?.length > 0 && (
                            <img
                                src={cocktail.images[0].url}
                                alt={cocktail.name}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    objectFit: "cover"
                                }}
                            />
                        )}
                    </Col>

                    {/* Main Info */}
                    <Col xs={24} md={14}>
                        <Title level={2}>{cocktail.name}</Title>

                        <Paragraph>{cocktail.description}</Paragraph>

                        {/* Tags */}
                        <div style={{ marginBottom: 12 }}>
                            {cocktail.tags.map(tag => (
                                <Tag key={tag.id}>{tag.name}</Tag>
                            ))}
                        </div>

                        <Divider />

                        <Text strong>Glass:</Text> {cocktail.glass?.name} <br />
                        <Text strong>Method:</Text> {cocktail.method?.name} <br />
                        <Text strong>ABV:</Text> {cocktail.abv}% <br />

                        {cocktail.garnish && (
                            <>
                                <Text strong>Garnish:</Text> {cocktail.garnish}
                                <br />
                            </>
                        )}

                        {cocktail.source && (
                            <>
                                <Text strong>Source:</Text>{" "}
                                <a href={cocktail.source} target="_blank">
                                    Original Recipe
                                </a>
                            </>
                        )}
                    </Col>
                </Row>

                <Divider />

                {/* Ingredients */}
                <Title level={4}>Ingredients</Title>
                <List
                    bordered
                    dataSource={cocktail.ingredients}
                    renderItem={(item, index) => {
                        const percent = ((item.amount / totalAmount) * 100).toFixed(0);

                        return (
                            <List.Item className="flex items-center justify-between">
                                <div className="flex items-center gap-3 w-full">
                                    {/* Number Circle */}
                                    <div
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            backgroundColor: token.colorPrimary,
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* Ingredient text */}
                                    <div className="flex-1 relative">
                                        <Text>
                                            {item.amount} {item.units} {item.ingredient.name}
                                        </Text>

                                        {/* Background proportion */}
                                        <div
                                            className="absolute top-0 right-0 h-full rounded"
                                            style={{
                                                width: `${percent}%`,
                                                backgroundColor: token.colorPrimary + '33', // 20% opacity
                                                zIndex: 1,
                                            }}
                                        />
                                    </div>

                                    {/* Optional tag */}
                                    {item.optional && <Tag color="orange">optional</Tag>}

                                    {/* Percentage */}
                                    <Text strong>{percent}%</Text>
                                </div>
                            </List.Item>
                        );
                    }}
                />

                {/*OLD LIST OF INGREDIENTS*/}
                {/*<List*/}
                {/*    bordered*/}
                {/*    dataSource={cocktail.ingredients}*/}
                {/*    renderItem={(item, index) => (*/}
                {/*        <List.Item className="flex items-center justify-between">*/}
                {/*            <div className="flex items-center gap-3">*/}
                {/*                /!* Number Circle using Antd primary color *!/*/}
                {/*                <div*/}
                {/*                    style={{*/}
                {/*                        width: 24,*/}
                {/*                        height: 24,*/}
                {/*                        borderRadius: '50%',*/}
                {/*                        backgroundColor: token.colorPrimary,*/}
                {/*                        color: '#fff',*/}
                {/*                        display: 'flex',*/}
                {/*                        alignItems: 'center',*/}
                {/*                        justifyContent: 'center',*/}
                {/*                        fontWeight: 600,*/}
                {/*                        fontSize: 14,*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    {index + 1}*/}
                {/*                </div>*/}

                {/*                /!* Ingredient text *!/*/}
                {/*                <Text>*/}
                {/*                    {item.amount} {item.units} {item.ingredient.name}*/}
                {/*                </Text>*/}

                {/*                /!* Optional tag *!/*/}
                {/*                {item.optional && <Tag color="orange">optional</Tag>}*/}
                {/*            </div>*/}
                {/*        </List.Item>*/}
                {/*    )}*/}
                {/*/>*/}

                <Divider />

                {/* Instructions */}
                <Title level={4}>Instructions</Title>

                {/*OLD LIST OF STEPS*/}
                {/*<List*/}
                {/*    bordered*/}
                {/*    dataSource={cocktail.instructions.split("\n")}*/}
                {/*    renderItem={(step) => <List.Item>{step}</List.Item>}*/}
                {/*/>*/}

                <Steps
                    current={current}
                    onChange={(step) => setCurrent(step)}
                    orientation="vertical"
                    items={cocktail.instructions.split("\n").map((instruction: string, index: number) => ({
                        title: 'Step ' + (index + 1),
                        content: instruction.slice(3)
                    }))}
                />
            </Card>
        </main>
    );
}