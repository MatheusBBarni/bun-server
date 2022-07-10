import App from './app'

const PORT = 3000
const BASE_URI = `http://localhost:${PORT}`

const app = new App(BASE_URI)

console.log('Starting Server...')

// Start a fast HTTP server from a function
// @ts-expect-error
Bun.serve({
  async fetch(serverRequest: Request) {

    app.post('/test', async (request) => {
      const body = request.body
      console.log(`URL: ${request.url}`)
      console.log(body)
      
      return new Response(JSON.stringify({ test: "test123"}), { status: 201 })
    })

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

  port: PORT, // number or string
});