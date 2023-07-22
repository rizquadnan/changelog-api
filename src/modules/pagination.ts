import { query } from "express-validator";

export const validatePaginationQueryParam = () => [
  query("page").optional().isInt({ min: 1 }),
  query("pageSize").optional().isInt({ min: 1 }),
];

export const hasPagination = (
  page: string | undefined,
  pageSize: string | undefined
) => {
  return typeof page === "string" && typeof pageSize === "string";
};

export const paginationToSkipAndTake = (page: string, pageSize: string) => {
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  return {
    skip,
    take,
  };
};
