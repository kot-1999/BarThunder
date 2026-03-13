'use client'

import {message} from "antd";

export const showError = (data: any) => {
    if (data?.messages) {
        data.messages.forEach((m: string) => {
            message.error(m);
        })
    } else {
        message.error(data?.messages ?? 'Something went wrong')
    }
}