import {request} from "@/app/server";

class ApiRequests {
    public barID: string | undefined
    public rootToken: string | undefined
    public rootID: string | undefined

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
    // COCKTAILS
    // ===============================

    listCocktails(
        token: string,
        barId: number,
        page = 1
    ) {
        return request(
            `/api/cocktails?page=${page}&include=images`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Bar-Assistant-Bar-Id': String(barId),
                },
            }
        );
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