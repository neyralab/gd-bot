import { AxiosError } from 'axios';

export interface DefaultResponse {
  message: string;
}

export interface DataWrappedResponse<T> {
  data: T;
}

export type DefaultError<T> = AxiosError<{ errors: T }>;
