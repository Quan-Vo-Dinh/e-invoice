export class Request<T> {
  processId?: string;
  data?: T;

  constructor(data?: Partial<Request<T>>) {
    if (data) Object.assign(this, data);
  }
}

export type RequestType<T> = Request<T>;
