/* eslint-env node */
import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function startServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })

  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    try {
      const url = req.originalUrl
      const template = await vite.transformIndexHtml(
        url,
        path.resolve(__dirname, 'index.html'),
      )
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(5173, () => {
    console.log('Frontend running on http://localhost:5173')
  })
}

startServer()
