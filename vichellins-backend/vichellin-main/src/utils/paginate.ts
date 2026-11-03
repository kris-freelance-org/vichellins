export const paginateQuery = (query: any, { page = 1, size = 10 }: { page: number; size: number }) => {
  return {
    ...query,
    offset: (page - 1) * size,
    limit: size
  };
};

export const paginateResult = (result: { count: number; rows: any[] }, { page = 1, size = 10 }: { page: number; size: number }) => {
  const itemsReturned = result.rows.length;
  const totalItems = result.count;
  const currentPage = page;
  const totalPages = Math.ceil(result.count / size);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;
  const nextPage = hasNext ? currentPage + 1 : null;
  const prevPage = hasPrev ? currentPage - 1 : null;

  return {
    data: result.rows,
    itemsReturned,
    totalItems,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage
  };
};
