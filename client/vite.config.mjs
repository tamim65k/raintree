import { defineConfig } from 'vite'

// Dev middleware to expose /api/ipinfo and /api/run during development
function ipApiMiddleware() {
    return {
        name: 'ip-api-middleware',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url.startsWith('/api/')) return next()
                try {
                    if (req.url === '/api/ipinfo' && req.method === 'GET') {
                        const r1 = await fetch('https://api.ipify.org?format=json')
                        const j1 = await r1.json()
                        const ip = j1.ip
                        const r2 = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}`)
                        const info = await r2.json()
                        res.setHeader('content-type', 'application/json')
                        res.end(JSON.stringify({ source: 'dev-middleware', ip, info }))
                        return
                    }

                    if (req.url === '/api/run' && req.method === 'POST') {
                        let body = ''
                        for await (const chunk of req) body += chunk
                        const data = JSON.parse(body || '{}')
                        const ip = data.ip
                        const ipRegex = /\b\d{1,3}(?:\.\d{1,3}){3}\b/
                        if (!ip || !ipRegex.test(ip)) {
                            res.statusCode = 400
                            res.end(JSON.stringify({ error: 'invalid or missing ip' }))
                            return
                        }
                        const r = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}`)
                        const info = await r.json()
                        res.setHeader('content-type', 'application/json')
                        res.end(JSON.stringify({ source: 'dev-middleware', ip, info }))
                        return
                    }

                    // not handled
                    next()
                } catch (err) {
                    res.statusCode = 500
                    res.end(JSON.stringify({ error: err.message }))
                }
            })
        }
    }
}

export default defineConfig({
    plugins: [ipApiMiddleware()],
})
