import {getCookie, request, setCookie} from "@/app/src/server";
import {Cocktail, Meta} from "@/app/src/types";

class ApiRequests {
    // ===============================
    // COCKTAILS
    // ===============================

    // This one has filters but requires admin's token or any other token
    async listCocktails(
        options: {
            page: number | string
            name?: string,
            ingredientIDs?: string
        } = {
            page: 1
        }
    ): Promise<{ data: Cocktail[], meta: Meta }> {
        const userToken = await getCookie('userToken')
        let root = await getCookie('root');
        if (!root && !userToken) {
            root = await this.getOrCreateBar()
        }

        let reqUrl = `/api/cocktails?page=${options.page.toString()}&include=images,glass,method,tags`
        if (options.name) {
            reqUrl += `&filter[name]=${options.name}`
        }

        if (options.ingredientIDs) {
            reqUrl += `&filter[specific_ingredients]=${options.ingredientIDs}`
        }

        return request(
            reqUrl,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userToken ?? root.rootToken}`,
                    'Bar-Assistant-Bar-Id': root.barID as string,
                },
            }
        );
    }

    async getCocktail(id: number | string): Promise<{ data: Cocktail }> {
        let root = await getCookie('root');
        if (!root) {
            root = await this.getOrCreateBar()
        }
        return request(
            `/api/cocktails/${String(id)}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${root.rootToken}`
                },
            }
        );
    }

    // ===============================
    // AUTH
    // ===============================

    async login(data: {
        email: string,
        password: string
    },
        isRoot = false) {

        // if (!isRoot) {
        //     const userToken = await getCookie('userToken')
        //     if (userToken) {
        //         throw new Error('Already logged in')
        //     }
        // }

        const result = await request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }, isRoot);
        if (!isRoot) {
            await setCookie('userToken', result.data.token)
            await this.joinBar(result.data.token);
        }

        return result;
    }

    register(
        data: {
            email: string,
            password: string,
            name: string
        },
        isRoot = false
    ) {
        return request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        },
        isRoot);
    }

    // ===============================
    // BARS
    // ===============================

    createBar(token: string, payload: object) {
        return request('/api/bars', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        }, true);
    }

    syncBar(
        token: string,
        barId: number
    ) {
        return request(
            `/api/bars/${barId}/sync-datapack`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            },
            true
        );
    }

    getBars(
        token: string
    ) {
        return request(
            `/api/bars`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            },
            true
        );
    }

    showProfile(token: string) {
        return request(
            `/api/profile`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
    }

    async getIngredients(name?: string) {
        const userToken = await getCookie('userToken')
        const root = await getCookie('root');

        let url = `/api/ingredients?per_page=100`;
        if (name) {
            url += `&filter[name]=${name}`
        }
        return request(
            url,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userToken ?? root.rootToken}`,
                    'Bar-Assistant-Bar-Id': String(root.barID),
                }
            }
        );
    }

    async getGlasses(name?: string) {
        const userToken = await getCookie('userToken')
        const root = await getCookie('root');

        let url = `/api/glasses?per_page=100`;
        if (name) {
            url += `&filter[name]=${name}`
        }
        return request(
            url,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userToken ?? root.rootToken}`,
                    'Bar-Assistant-Bar-Id': String(root.barID),
                }
            }
        );
    }

    async getMethods(name?: string) {
        const userToken = await getCookie('userToken')
        const root = await getCookie('root');

        let url = `/api/cocktail-methods?per_page=100`;
        if (name) {
            url += `&filter[name]=${name}`
        }
        return request(
            url,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userToken ?? root.rootToken}`,
                    'Bar-Assistant-Bar-Id': String(root.barID),
                }
            }
        );
    }

    private async joinBar(token?: string) {
        const userToken = await getCookie('userToken')
        let root = await getCookie('root');
        if (!root) {
            root = await this.getOrCreateBar()
        }
        const profile = await this.showProfile(userToken)

        const memberships = profile.data.memberships.find((membership: any) => membership.bar_id == root.barID)

        if (!memberships) {
            await request(
                `/api/bars/join`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        invite_code: root.barInviteCode,
                    }),
                }
            );
        }
    }

    private rootEmail = process.env.ROOT_EMAIL as string
    private rootPass = process.env.ROOT_PASSWORD as string
    private rootBarSlug = process.env.NEXT_PUBLIC_ROOT_BAR_SLUG as string
    private rootName = process.env.NEXT_PUBLIC_ROOT_NAME as string


    /**
     * This function is needed for initial setup of backend.
     * Here the root user and bar with cocktails data are being created.
     * */
    private async getOrCreateBar() {

        const root = await getCookie('root')
        if (root) {
            return
        }

        // LOGIN
        let loginRes = await api.login({
            email: this.rootEmail,
            password: this.rootPass
        }, true)

        let loginData

        if (!loginRes.ok) {
            // Register a user
            await api.register({
                email: this.rootEmail,
                name: this.rootName,
                password: this.rootPass
            }, true)

            // Login again in a new account
            loginRes = await api.login({
                email: this.rootEmail,
                password: this.rootPass
            }, true)

            loginData = await loginRes.json()

            // Create new bar
            const barRes = await api.createBar(loginData.data.token, {
                name: this.rootBarSlug,
                subtitle: "A short subtitle of a bar",
                description: "Bar description",
                slug: this.rootBarSlug,
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

        const bar = barsData.data.find((bar) => bar.slug === this.rootBarSlug)

        if (!bar) {
            throw new Error('getOrCreateBar - Unable to get bar')
        }
        const result = {
            barID: bar.id,
            rootToken: loginData.data.token,
            rootID: bar.created_user.id,
            barInviteCode: bar.invite_code
        }

        setCookie('root', result)
        return result
    }
}

export const api = new ApiRequests();