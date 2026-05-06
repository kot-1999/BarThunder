'use client'

import {Card, Row, Col, Tag, Typography, Divider, Button, Flex, Modal} from "antd";
import Link from "next/link";
import {Cocktail} from "@/app/src/types";
import {decodeText, showError} from "@/app/src/helpers";
import Rating from "@/app/components/Rating";
import {useState} from "react";
import CocktailUploadForm from "@/app/components/CocktailUploadForm";

const { Title, Text, Paragraph } = Typography;

export default function CocktailList({ cocktails, showAddNew, results }: { cocktails: Cocktail[], showAddNew?: boolean, results: number }) {
    const [open, setOpen] = useState(false);

    const onChange = async (event: number, id: number) => {
        try {
            await fetch(`/api/cocktails/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: event }),
            });
        } catch (error) {
            showError(error);
        }
    }

    const funnyTexts = [
        "Oops! The bar is empty",
        "No cocktails found… Maybe try water?",
        "Looks like the bartenders are on strike",
        "Your cocktail adventure is waiting… somewhere else!",
        "Nothing to shake here",
    ];
    const randomText = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
    return (
        <main className="p-6">

            <Modal
                title="Create Cocktail"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnHidden
                width={700}
            >
                <CocktailUploadForm/>
            </Modal>

            <Title level={4}>{results} Results</Title>
            <Row gutter={[16, 16]}>
                {/* Add New Card */}
                {showAddNew ? (
                    <Col xs={24} sm={12} lg={8}>
                        <Card
                            hoverable
                            className="flex items-center justify-center text-center"
                            style={{ height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                            onClick={() => setOpen(true)}
                        >
                            <Title level={3}>+ Add New Cocktail</Title>
                            <Text type="secondary">Click here to add a new cocktail</Text>
                            <div className="mt-4">
                                <Button type="primary" onClick={() => setOpen(true)}>
                                    Add New
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ) : null}


                {/* Existing cocktails */}
                {
                    cocktails.length > 0 ?
                    cocktails.map((drink) => (
                        <Col xs={24} sm={12} lg={8} key={drink.id}>
                            <Card
                                cover={
                                    drink.images?.length && (
                                        <img
                                            src={drink.images[0].url}
                                            alt={drink.name}
                                            className="h-87.5 object-cover w-full"
                                        />
                                    )
                                }
                            >
                                <Flex align="center" gap={8}>
                                    <Rating
                                        id={drink.id}
                                        initialRating={drink.rating}
                                    />
                                </Flex>
                                <Title level={4}>{drink.name}</Title>

                                <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: "Show more" }}>
                                    {decodeText(drink.description)}
                                </Paragraph>

                                {drink.tags?.map((tag: { name: string }) => (
                                    <Tag key={tag.name}>{tag.name}</Tag>
                                ))}

                                <Divider />

                                <Text strong>Glass:</Text> {drink.glass?.name}<br />
                                <Text strong>Method:</Text> {drink.method?.name}<br />
                                <Text strong>ABV:</Text> {drink.abv}%<br />

                                <Divider />

                                <Title level={5}>Ingredients</Title>

                                <div className="flex flex-wrap gap-2">
                                    {drink.ingredients.map((ing, index) => (
                                        <Tag
                                            key={index}
                                            color={ing.optional ? 'orange' : 'blue'}
                                            style={{ marginBottom: 4 }}
                                        >
                                            {ing.ingredient.name}
                                        </Tag>
                                    ))}
                                </div>

                                <div className="flex justify-center mt-4">
                                    <Link href={`/cocktail/${drink.id}`} passHref>
                                        <Button type="primary">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </Col>
                    ))
                        : <Col xs={24}>
                            <div className="flex justify-center items-center h-64">
                                <p className="text-2xl text-center font-bold">{randomText}</p>
                            </div>
                        </Col>
                }
            </Row>
        </main>
    );
}