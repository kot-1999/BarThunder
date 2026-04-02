'use client'

import {message} from "antd";
import { decode } from "he";


export const showError = (data: any) => {
    if (data?.messages) {
        data.messages.forEach((m: string) => {
            message.error(m);
        })
    } else {
        message.error(data?.messages ?? 'Something went wrong')
    }
}

export const saveScroll = () => {
    sessionStorage.setItem('scrollY', String(window.scrollY));
};

export const setScroll  = () => {
    const scrollY = sessionStorage.getItem('scrollY');
    if (scrollY) {
        window.scrollTo(0, Number(scrollY));
    }
}
export const decodeText = (text: string) => decode(text);