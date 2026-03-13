import {request} from "@/app/src/server";
import {Cocktail, Meta} from "@/app/src/types";

class ApiRequests {
    public barID: string | undefined
    public rootToken: string | undefined
    public rootID: string | undefined
    public barInviteCode: string | undefined
    // ===============================
    // COCKTAILS
    // ===============================

    publicListCocktails(slugOrgID: string): Promise<{ data: {
            name: string,
            instructions: string,
            garnish: string,
            description: string,
            images: {
                placeholder_hash: string,
                url: string,
                copyright: string,
            }[],
            tags: string[],
            glass: string,
            method: string,
            method_dilution_percentage: number,
            volume_ml: string,
            abv: number,
            ingredients: {
                name: string,
                amount: number,
                units: string,
                optional: boolean
            }[]
        }}> {
        return request(
            `/api/public/${slugOrgID}/cocktails`,
            {
                method: 'GET'
            }
        )
    }

    // This one has filters but requires admin's token or any other token
    listCocktails(
        options: {
            page: number | string
            name?: string,
            ingredientName?: string
        } = {
            page: 1
        }
    ): Promise<{ data: Cocktail[], meta: Meta }> {
        let reqUrl = `/api/cocktails?page=${options.page.toString()}&include=images,glass,method,tags`
        if (options.name) {
            reqUrl += `&filter[name]=${options.name}`
        }

        if (options.ingredientName) {
            reqUrl += `&filter[ingredient_name]=${options.ingredientName}`
        }

        return request(
            reqUrl,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.rootToken}`,
                    'Bar-Assistant-Bar-Id': this.barID as string,
                },
            }
        );
    }

    getCocktail(id: number | string): Promise<{ data: Cocktail }> {
        return request(
            `/api/cocktails/${String(id)}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.rootToken}`
                },
            }
        );
    }

    // ===============================
    // AUTH
    // ===============================

    login(data: {
        email: string,
        password: string
    },
        isRoot = false) {
        return request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }, isRoot);
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
}

export const api = new ApiRequests();