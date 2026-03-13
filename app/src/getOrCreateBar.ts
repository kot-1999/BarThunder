'use server'

import { api } from "@/app/src/ApiRequests"

const rootEmail = process.env.ROOT_EMAIL as string
const rootPass = process.env.ROOT_PASSWORD as string
const rootBarSlug = process.env.NEXT_PUBLIC_ROOT_BAR_SLUG as string
const rootName = process.env.NEXT_PUBLIC_ROOT_NAME as string


/**
 * This function is needed for initial setup of backend.
 * Here the root user and bar with cocktails data are being created.
 * */
export async function getOrCreateBar() {

    if (!!api.barID || !!api.rootID || !!api.rootToken || !!api.barInviteCode) {
        console.info('Bar exists')
        return
    }

    // LOGIN
    let loginRes = await api.login({
        email: rootEmail,
        password: rootPass
    }, true)

    let loginData

    if (!loginRes.ok) {
        // Register a user
        await api.register({
            email: rootEmail,
            name: rootName,
            password: rootPass
        }, true)

        // Login again in a new account
        loginRes = await api.login({
            email: rootEmail,
            password: rootPass
        }, true)

        loginData = await loginRes.json()

        // Create new bar
        const barRes = await api.createBar(loginData.data.token, {
            name: rootBarSlug,
            subtitle: "A short subtitle of a bar",
            description: "Bar description",
            slug: rootBarSlug,
            default_units: "ml",
            default_currency: "GBP",
            enable_invites: true,
            options: "ingredients",
            images: [],
            is_public: true
        })

        const barData = await barRes.json()

        // Synchronize bar data
        await api.syncBar(loginData.data.token, barData.data.id)

        console .info('Bar was created')
    } else {
        loginData = await loginRes.json()
    }

    const barsRes = await api.getBars(loginData.data.token)

    const barsData: {
        data: { id: string, invite_code: string, slug: string, created_user: { id: string } }[]
    } = await barsRes.json()

    const bar = barsData.data.find((bar) => bar.slug === rootBarSlug)

    if (!bar) {
        throw new Error('getOrCreateBar - Unable to get bar')
    }

    api.barID = bar.id
    api.rootToken = loginData.data.token
    api.rootID = bar.created_user.id
    api.barInviteCode = bar.invite_code

    console.info('Bar was initialized successfully: ', api.barID, api.barInviteCode)
}