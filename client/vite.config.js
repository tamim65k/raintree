import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev middleware to expose /api/ipinfo and /api/run during development
function ipApiMiddleware() {
    return {
        name: 'ip-api-middleware',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url.startsWith('/api/')) return next()
                try {
                    if (req.url === '/api/ipinfo' && req.method === 'GET') {
                        // Get client IP from request headers
                        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() 
                                || req.headers['x-real-ip'] 
                                || req.socket.remoteAddress 
                                || '127.0.0.1'
                        
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
    plugins: [react(), ipApiMiddleware()],
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true
    }
})
