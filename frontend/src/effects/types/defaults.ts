export interface DefaultResponse {
  message: string;
}

export interface DataWrappedResponse<T> {
  data: T;
}
