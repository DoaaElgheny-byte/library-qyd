export class ResponseEnvelope<T> {
  data: T;
  message: string;
  success: boolean;
}

