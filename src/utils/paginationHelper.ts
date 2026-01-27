interface PaginationInput {
  page?: string;
  limit?: string;
}

interface PaginationOutput {
  page: number;
  offset: number;
  limit: number;
}

export const paginationHelper = (
  options: PaginationInput,
): PaginationOutput => {
  const page = options.page ? Number(options.page as string) : 1;
  const limit = options.limit ? Number(options.limit as string) : 10;
  const offset = (page - 1) * limit;

  return { page, offset, limit };
};
