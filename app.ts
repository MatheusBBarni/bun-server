import { httpMethodToEnum } from './utils/app-utils'
import { HandlerFn, HttpMethods, AppRequest, Routes } from './types/app-types'

export default class App {
  private port: number
  private routes: Routes
  private baseURI: string

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

  private async start(req: Request): Promise<Response> {
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

  async serve(port: number) {
    this.port = port
    console.log('Started server!')
    const app = this
    // Start a fast HTTP server from a function
    // @ts-expect-error
    Bun.serve({
      async fetch(serverRequest: Request) {

        return app.start(serverRequest)
      },
      // baseURI: "http://localhost:3000",
      // error(err: Error) {
      //   return new Response("uh oh! :(\n" + err.toString(), { status: 500 });
      // },

      // this boolean enables bun's default error handler
      // development: process.env.NODE_ENV !== "production",
      // certFile: './cert.pem',
      // keyFile: './key.pem',

      port: this.port, // number or string
    });
  }
}