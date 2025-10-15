const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/ipinfo - determine caller public IP and return ip-api info for it
app.get('/api/ipinfo', async (req, res) => {
    try {
        const r1 = await fetch('https://api.ipify.org?format=json');
        const j1 = await r1.json();
        const ip = j1.ip;
        const r2 = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}`);
        const info = await r2.json();
        res.json({ source: 'fallback', ip, info });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/run - run a lookup for supplied IP using ip-api.com
app.post('/api/run', async (req, res) => {
    const ip = req.body && req.body.ip ? String(req.body.ip).trim() : (req.query && req.query.ip ? String(req.query.ip) : null);
    const ipRegex = /\b\d{1,3}(?:\.\d{1,3}){3}\b/;
    if (!ip || !ipRegex.test(ip)) return res.status(400).json({ error: 'invalid or missing ip' });

    try {
        const r = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}`);
        const info = await r.json();
        res.json({ source: 'fallback', ip, info });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Serve client in production
app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.get('*', (req, res) => {
    const index = path.join(__dirname, 'client', 'dist', 'index.html');
    if (fs.existsSync(index)) res.sendFile(index);
    else res.status(404).send('Not found');
});

// Export for Vercel serverless
module.exports = app;

// Local development server
if (require.main === module) {
    const port = process.env.PORT || 5174;
    app.listen(port, () => console.log(`Server listening on ${port}`));
}
