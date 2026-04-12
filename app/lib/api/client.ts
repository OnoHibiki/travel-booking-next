type RequestOptions = RequestInit & {
    headers?: HeadersInit;
};

async function request<T>(url: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if(!response.ok) {
        const message =
            data?.message || data?.error || 'リクエストに失敗しました';
        throw new Error(message);
    }

    return data as T; //Tがここで返る
}

// REST　
export const apiClient = {
    get: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, {
            ...options,
            method: 'GET',
        }),
    post:<T>(url: string, body?:unknown, options?: RequestOptions) =>
        request<T>(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),
    patch:<T>(url: string, body?:unknown, options?: RequestOptions) =>
        request<T>(url, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        }),
}