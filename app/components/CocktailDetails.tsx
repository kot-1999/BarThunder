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
    Button
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";

export default function CocktailDetails({ cocktail }: { cocktail: Cocktail }) {
    const router = useRouter();

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

                        <Text>Glass:</Text> {cocktail.glass?.name} <br />
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
                    dataSource={[...cocktail.ingredients].sort((a, b) => a.sort - b.sort)}
                    renderItem={(item) => (
                        <List.Item>
                            {item.amount} {item.units} {item.ingredient.name}
                            {item.optional && (
                                <Tag color="orange" style={{ marginLeft: 8 }}>
                                    optional
                                </Tag>
                            )}
                        </List.Item>
                    )}
                />

                <Divider />

                {/* Instructions */}
                <Title level={4}>Instructions</Title>

                <List
                    bordered
                    dataSource={cocktail.instructions.split("\n")}
                    renderItem={(step) => <List.Item>{step}</List.Item>}
                />
            </Card>
        </main>
    );
}