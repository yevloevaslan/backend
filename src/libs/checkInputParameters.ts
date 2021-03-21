const paginationParams = (page: unknown, limit: unknown): {page: number, limit: number, skip: number} => {
    let pageNumber: number = page ? (Number(page) || 1) : 1;
    let limitNumber: number = limit ? (Number(limit) || 20) : 20;
    if (pageNumber < 1) pageNumber = 1;
    if (limitNumber < 1) limitNumber = 20;
    const skip: number = limitNumber * (pageNumber - 1);

    return {
        page: pageNumber,
        limit: limitNumber,
        skip,
    };
};

export {
    paginationParams,
};