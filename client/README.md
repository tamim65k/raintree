This folder contains the Vite + React client.

Vercel build: the root `vercel.json` is configured to use `@vercel/static-build` and set the `distDir` to `client/dist`.

Commands:
- npm run dev (from project root will run the client dev server)
- npm run build (from project root will run `cd client && npm install && npm run build`)

After build, the static output will be in `client/dist` which Vercel will serve.
