'use server'

import { api } from "@/app/ApiRequests"

export async function getOrCreateBar() {

    // LOGIN
    let loginRes = await api.login({
        email: 'bar-13@gmail.com',
        password: 'test123'
    }, true)

    let loginData

    if (!loginRes.ok) {
        // REGISTER
        await api.register({
            email: 'bar-13@gmail.com',
            name: 'bar-thunder-02',
            password: 'test123'
        }, true)

        loginRes = await api.login({
            email: 'bar-13@gmail.com',
            password: 'test123'
        }, true)

        loginData = await loginRes.json()

        const barRes = await api.createBar(loginData.data.token, {
            name: "bar-13",
            subtitle: "A short subtitle of a bar",
            description: "Bar description",
            slug: "bar-13",
            default_units: "ml",
            default_currency: "GBP",
            enable_invites: true,
            options: "ingredients",
            images: [],
            is_public: true
        })

        const barData = await barRes.json()

        await api.syncBar(loginData.data.token, barData.data.id)
    } else {
        loginData = await loginRes.json()
    }

    const barsRes = await api.getBars(loginData.data.token)
    const barsData: {
        data: { id: string, slug: string, created_user: { id: string } }[]
    } = await barsRes.json()

    const bar = barsData.data.find((bar) => bar.slug === 'bar-13')

    if (!bar) {
        throw new Error('getOrCreateBar - Unable to get bar')
    }

    // await setCookie('root', {
    //     token: loginData.data.token,
    //     bardID: bar.id,
    // })

    api.barID = bar.id
    api.rootToken = loginData.data.token
    api.rootID = bar.created_user.id

    return {
        token: loginData.data.token,
        bardID: bar.id,
    }
}