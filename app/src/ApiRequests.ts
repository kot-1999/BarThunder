import {getCookie, IError, request, setCookie} from "@/app/src/server";
import {Cocktail, Meta} from "@/app/src/types";

class ApiRequests {

    // ===============================
    // COLLECTION
    // ===============================
    async addIngredientsToBarShelfBatch(ingredientIds: number[]) {
        let root = await getCookie('root');
        if (!root) {
            root = await this.getOrCreateBar()
        }

        return request(
            `/api/bars/${root.barID}/ingredients/batch-store`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${root.rootToken}`,
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    ingredients: ingredientIds
                }),
            },
            true
        );
    }

    async createCollection(userID: string, userToken: string) {
        let root = await getCookie('root');

        if (!root) {
            root = await this.getOrCreateBar()
        }
        return request(`/api/collections`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Bar-Assistant-Bar-Id': root.barID,
            },
            body: JSON.stringify({
                name: 'collection-' + userID,
                description: '',
                is_bar_shared: true,
                cocktails: [],
            }),
        });
    }

    async updateCollection(
        cocktailIDs: string[],
    ) {
        let [userToken, root, userData] = await Promise.all([
            getCookie('userToken'),
            getCookie('root'),
            getCookie('userData'),
        ]);

        if (!userData || !userToken) {
            throw new IError(401, ['Not Authorized']);
        }

        if (!root) {
            root = await this.getOrCreateBar()
        }

        return request(`/api/collections/${userData.collectionID}/cocktails`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Bar-Assistant-Bar-Id': String(root.barID),
            },
            body: JSON.stringify({
                cocktails: cocktailIDs,
            }),
        });
    }

    async getCollection() {
        const userToken = await getCookie('userToken');
        const userData = await getCookie('userData');
        let root = await getCookie('root');

        if (!root) {
            root = await this.getOrCreateBar()
        }
        if (!userToken){
            throw new IError(401, ['Not Authorized']);
        }

        return request(`/api/collections/${userData.collectionID}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Bar-Assistant-Bar-Id': String(root.barID),
            },
        });
    }

    async getCollections(name?: string, token?: string) {
        const userToken = token ?? await getCookie('userToken');
        let root = await getCookie('root');
        if (!root) {
            root = await this.getOrCreateBar()
        }

        let url = `/api/collections?per_page=100`;

        if (name) {
            url += `&filter[name]=${name}`;
        }

        return request(
            url,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken ?? root.rootToken}`,
                    'Bar-Assistant-Bar-Id': String(root.barID),
                }
            }
        );
    }

    // ===============================
    // COCKTAILS
    // ===============================

    // This one has filters but requires admin's token or any other token
    async listCocktails(
        options: {
            page: number | string
            name?: string,
            ingredientIDs?: string
            ownCollection?: string
            sort?: string,
            maxAbv?: string,
            minAbv?: string,
            perPage?: string,
            minRating?: string,
            maxRating?: string,
        } = {
            page: 1
        }
    ): Promise<{ data: Cocktail[], meta: Meta }> {
        const userToken = await getCookie('userToken')
        const userData = await getCookie('userData')
        let root = await getCookie('root');

        if (!root) {
            root = await this.getOrCreateBar()
        }

        let reqUrl = `/api/cocktails?user_shelves=true&per_page=24&page=${options.page.toString()}&include=images,glass,method,tags,ratings`

        if (options.name) {
            reqUrl += `&filter[name]=${options.name}`
        }

        if (options.ingredientIDs) {
            reqUrl += `&filter[specific_ingredients]=${options.ingredientIDs}`
        }

        if (options.perPage) {
            reqUrl += `&per_page=${options.perPage}`
        }

        if (options.sort) {
            reqUrl += `&sort=${options.sort}`
        }

        if (options.ownCollection) {
            reqUrl += `&filter[collection_id]=${userData.collectionID}`
        }

        if (options.maxAbv) {
            reqUrl += `&filter[abv_max]=${options.maxAbv}`
        }

        if (options.minAbv) {
            reqUrl += `&filter[abv_min]=${options.minAbv}`
        }

        if (options.minRating && options.minRating !== '0') {
            reqUrl += `&filter[average_rating_min]=${options.minRating}`
        }

        if (options.maxRating) {
            reqUrl += `&filter[average_rating_max]=${options.maxRating}`
        }


        return request(
            reqUrl,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${root.rootToken ?? userToken}`,
                    'Bar-Assistant-Bar-Id': root.barID as string,
                },
            }
        );
    }

    async getCocktail(id: number | string): Promise<{ data: Cocktail }> {
        const userToken = await getCookie('userToken');
        let root = await getCookie('root');
        if (!root) {
            root = await this.getOrCreateBar()
        }
        return request(
            `/api/cocktails/${String(id)}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userToken ?? root.rootToken}`
                },
            }
        );
    }

    async deleteCocktail(id: number | string): Promise<{ data: Cocktail }> {
        const userToken = await getCookie('userToken');
        if (!userToken) {
            throw new IError(401, ['Not Authorized']);
        }


        return request(
            `/api/cocktails/${String(id)}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
            }
        );
    }

    async rateCocktail(id: number | string, rating: string): Promise<{ data: Cocktail }> {
        const userToken = await getCookie('userToken');
        if (!userToken) {
            throw new IError(401, ['Not Authorized']);
        }


        return request(
            `/api/cocktails/${String(id)}/ratings`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: JSON.stringify({ rating })
            }, true
        );
    }

    async createCocktail(data: any) {

        let root = await getCookie('root');
        const userToken = await getCookie('userToken');

        if (!userToken) {
            throw new IError(401, ['Authentication is required'])
        }

        if (!root) {
            root = await this.getOrCreateBar()
        }

        // const res = await this.addIngredientsToBarShelfBatch(data.ingredients.map((ingredient: any) => ingredient.ingredient_id))
        return request('/api/cocktails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Bar-Assistant-Bar-Id': String(root.barID),

            },
            body: JSON.stringify({
                ...data,
                in_bar_shelf: true,
                tags: [],
                utensils: [],
                ingredients: data.ingredients.map((item: any, index: number) => ({
                    ...item,
                    sort: index,
                    substitutes: [],
                    is_specified: false
                }))
            }),
        });
    }

    // ===============================
    // AUTH
    // ===============================

    async login(data: {
        email: string,
        password: string
    },
        isRoot = false) {

        const result = await request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }, isRoot);

        if (!isRoot) {
            await setCookie('userToken', result.data.token)
            const { data } = await this.getProfile()

            await Promise.all([
                this.joinBar(result.data.token),
                this.updateUserRole(data.name, data.email, data.id),
            ])
            const collections = await this.getCollections('collection-' + data.id, result.data.token)

            let collection
            if (!collections.data.length) {
                collection = await this.createCollection(data.id, result.data.token)
            } else {
                collection = collections.data[0]
            }
            await setCookie('userData', {
                id: data.id,
                email: data.email,
                name: data.name,
                collectionID: collection.id
            })


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
        let root = await getCookie('root');

        if (!root) {
            root = await this.getOrCreateBar()
        }
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
        let root = await getCookie('root');

        if (!root) {
            root = await this.getOrCreateBar()
        }
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
        let root = await getCookie('root');

        if (!root) {
            root = await this.getOrCreateBar()
        }
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

    async getProfile(token?: string) {
        const userToken = await getCookie('userToken');
        if (!userToken && !token) {
            throw new IError(401, ['Authentication is required'])
        }

        return request(`/api/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token ?? userToken}`,
            }
        });
    }

    async updateUserRole(name: string, email: string, userId: number) {
        let root = await getCookie('root');

        if (!root) {
            root = await this.getOrCreateBar()
        }
        return request(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${root.rootToken}`,
                'Bar-Assistant-Bar-Id': String(root.barID)
            },
            body: JSON.stringify({
                name,
                email,
                role_id: 1
            }),
        });
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