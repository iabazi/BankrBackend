// Pagination utilities
export interface PaginationParams {
    limit: number;
    cursor?: string;
}

export function parsePaginationParams(
    limit?: string,
    cursor?: string
): PaginationParams {
    const parsedLimit = Math.min(parseInt(limit || '20', 10), 100);
    return {
        limit: parsedLimit < 1 ? 20 : parsedLimit,
        cursor,
    };
}

export function paginate<T extends { id: string }>(
    items: T[],
    limit: number,
    cursor?: string
): { data: T[]; nextCursor?: string; hasMore: boolean } {
    let startIndex = 0;

    if (cursor) {
        startIndex = items.findIndex((item) => item.id === cursor);
        if (startIndex === -1) startIndex = 0;
        else startIndex += 1;
    }

    const paginatedItems = items.slice(startIndex, startIndex + limit + 1);
    const hasMore = paginatedItems.length > limit;
    const data = paginatedItems.slice(0, limit);
    const nextCursor = hasMore ? data[data.length - 1]?.id : undefined;

    return {
        data,
        nextCursor,
        hasMore,
    };
}
