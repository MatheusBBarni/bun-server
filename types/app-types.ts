export enum HttpMethods {
  GET,
  POST,
  PATCH,
  PUT,
  DELETE
}

export type AppRequest = Pick<
  Request, 
  | 'headers' 
  | 'mode' 
  | 'redirect' 
  | 'url'
> & {
  body: any
}

export type HandlerFn = (request: AppRequest) => Promise<Response>

export type Route = {
  path: string
  handler: HandlerFn
}

export type Routes = {
  [key in HttpMethods]: Array<Route>
}