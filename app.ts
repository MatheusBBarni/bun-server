import { Route, HandlerFn, HttpMethods, AppRequest, Routes } from './types/app-types'
import { httpMethodToEnum } from './utils/app-utils'

export default class App {
  private baseURI: string
  private routes: Routes

  constructor(baseURI: string) {
    this.routes = {
      [HttpMethods.GET]: [],
      [HttpMethods.POST]: [],
      [HttpMethods.PUT]: [],
      [HttpMethods.DELETE]: [],
      [HttpMethods.PATCH]: [],
    }
    this.baseURI = baseURI
  }

  private addRoute(method: HttpMethods, path: string, handler: HandlerFn) {
    this.routes[method].push({
      path,
      handler
    })
  }

  get(path: string, handler: HandlerFn): this {
    this.addRoute(HttpMethods.GET, path, handler)

    return this
  }

  post(path: string, handler: HandlerFn): this {
    this.addRoute(HttpMethods.POST, path, handler)

    return this
  }

  async start(req: Request): Promise<Response> {
    // Destructuring is causing segfault - weird
    // const { url, method, headers, mode, redirect, formData, text, blob } = request
    
    const httpMethod = httpMethodToEnum(req.method)
    const path = req.url.split(this.baseURI)[1]
    const appRequest = {
      url: req.url, 
      headers: req.headers,
      mode: req.mode,
      redirect: req.redirect,
      body: await req.json()
    } as AppRequest

    const routes = this.routes[httpMethod]
    const route = routes.find((r) => r.path === path)

    if (!route) {
      return new Response(`Error: path -> ${path}, not found`, { status: 404 });
    }

    return route.handler(appRequest)
  }
}