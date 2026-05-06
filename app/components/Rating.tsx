'use client'

import { Rate, message, Typography } from 'antd';
import { useState, useEffect } from 'react';
import { showError } from '@/app/src/helpers';
import {useRouter} from "next/navigation";

const { Text } = Typography;

interface CocktailRatingProps {
    id: number;
    initialRating: {
        average: number;
        total_votes: number;
    };
}

export default function Rating({ id, initialRating }: CocktailRatingProps) {
    const [rating, setRating] = useState(initialRating);
    const [mounted, setMounted] = useState(false);
    const router = useRouter()

    // Only render after the client mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = async (value: number) => {
        try {
            const res = await fetch(`/api/cocktails/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: value }),
            });
            if (!res.ok) {
                router.replace('/login')
                message.error('Authorization is required');
            } else {
                const cocktail = await res.json();
                setRating(cocktail.data.rating)
                message.success('Rated successfully');
            }
        } catch (error) {
            showError(error);
        }
    };

    if (!mounted) return <Text>Loading rating…</Text>; // placeholder for SSR

    return (
        <div>
            <Rate
                size="large"
                allowClear
                value={rating?.average}
                onChange={handleChange}
            />
            <Text type="secondary" style={{ marginLeft: 8 }}>
                {rating?.average} / Total {rating?.total_votes}
            </Text>
        </div>
    );
}