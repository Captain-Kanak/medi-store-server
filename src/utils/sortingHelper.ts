interface Sorting {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export const sortingHelper = (options: Sorting): Sorting => {
  const sortBy = options.sortBy ? options.sortBy : "createdAt";
  const sortOrder = options.sortOrder ? options.sortOrder : "desc";

  return {
    sortBy,
    sortOrder,
  };
};
