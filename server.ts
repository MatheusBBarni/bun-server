import App from './app'

const PORT = 3000
const BASE_URI = `http://localhost:${PORT}`

const app = new App(BASE_URI)

app.post('/test', async (request) => {
  const body = request.body
  console.log(`URL: ${request.url}`)
  console.log(body)
  
  return new Response(JSON.stringify({ test: "test123"}), { status: 201 })
})

app.serve(PORT)