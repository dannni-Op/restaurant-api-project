export type ResponsePaging<T> = {
  data: T;
  paging: {
    totalPage: number;
    currentPage: number;
    size: number;
  };
};
