import React, { useState, useRef, useEffect } from 'react'

function Window({ id, title, children, x, y, width, height, onClose, onMinimize, zIndex, onFocus }) {
    const [pos, setPos] = useState({ x, y })
    const [drag, setDrag] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const ref = useRef(null)

    const onMouseDown = (e) => {
        if (e.target.classList.contains('window-titlebar') || e.target.classList.contains('window-title')) {
            setDrag(true)
            const rect = ref.current.getBoundingClientRect()
            setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
            onFocus()
        }
    }

    useEffect(() => {
        const onMove = (e) => drag && setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y })
        const onUp = () => setDrag(false)
        if (drag) {
            document.addEventListener('mousemove', onMove)
            document.addEventListener('mouseup', onUp)
        }
        return () => {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onUp)
        }
    }, [drag, offset])

    return (
        <div ref={ref} className="window" style={{ left: pos.x, top: pos.y, width, height, zIndex }} onClick={onFocus}>
            <div className="window-titlebar" onMouseDown={onMouseDown}>
                <span className="window-title">{title}</span>
                <div className="window-controls">
                    <button className="window-btn minimize" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>─</button>
                    <button className="window-btn maximize" onClick={(e) => e.stopPropagation()}>□</button>
                    <button className="window-btn close" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
                </div>
            </div>
            <div className="window-content">{children}</div>
        </div>
    )
}

const TerminalLine = ({ text }) => <div className="terminal-line" dangerouslySetInnerHTML={{ __html: text }} />

// Hacking data terminal component
function HackingTerminal({ windowId }) {
    const [lines, setLines] = useState([])
    const contentRef = useRef(null)

    const hackingData = {
        1: [
            '$ nmap -sV 192.168.1.0/24',
            'Starting Nmap 7.94 ( https://nmap.org )',
            'Nmap scan report for 192.168.1.1',
            'Host is up (0.0023s latency).',
            'PORT     STATE SERVICE    VERSION',
            '22/tcp   open  ssh        OpenSSH 8.2p1',
            '80/tcp   open  http       Apache httpd 2.4.41',
            '443/tcp  open  ssl/https',
            'Nmap scan report for 192.168.1.15',
            'Host is up (0.0041s latency).',
            'PORT     STATE SERVICE',
            '3306/tcp open  mysql',
            'Discovering network topology...',
            'Found 23 active hosts',
            'Scanning ports: 1-65535',
            'Detected services: HTTP, SSH, FTP, MySQL',
            '>> Vulnerability scan initiated',
            'CVE-2021-44228: Log4j vulnerability found',
            'CVE-2023-12345: Authentication bypass detected',
            'Analyzing traffic patterns...',
        ],
        2: [
            '<span class="green">EXPLOIT FRAMEWORK v3.14.159</span>',
            '',
            'Initializing Metasploit Framework...',
            'Loading 2,487 modules...',
            '+ exploit/multi/handler',
            '+ exploit/windows/smb/ms17_010_eternalblue',
            '+ payload/windows/meterpreter/reverse_tcp',
            '+ auxiliary/scanner/http/dir_scanner',
            'Framework initialized successfully',
            '',
            'msf6 > use exploit/multi/handler',
            'msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp',
            'msf6 exploit(multi/handler) > set LHOST 192.168.1.100',
            'msf6 exploit(multi/handler) > set LPORT 4444',
            'msf6 exploit(multi/handler) > exploit',
            '',
            '[*] Started reverse TCP handler on 192.168.1.100:4444',
            '[*] Sending stage (175174 bytes) to 192.168.1.50',
            '[*] Meterpreter session 1 opened',
            'meterpreter > sysinfo',
        ],
        3: [
            '<span class="green">NETWORK INTERFACE MONITOR</span>',
            '',
            'Interface: eth0',
            'IP Address: 192.168.1.100',
            'Netmask: 255.255.255.0',
            'Gateway: 192.168.1.1',
            'MAC: 00:0c:29:3a:5f:7b',
            'Status: CONNECTED',
            '',
            'Interface: wlan0',
            'IP Address: 10.0.0.25',
            'Netmask: 255.255.255.0',
            'Gateway: 10.0.0.1',
            'MAC: ac:de:48:00:11:22',
            'Status: CONNECTED',
            '',
            'Packet Capture Active...',
            'Monitoring traffic on eth0',
            'Captured: 15,847 packets',
            'HTTP requests: 432',
        ],
        4: [
            '<span class="green">SYSTEM MONITOR</span>',
            '',
            'CPU Usage: 47% [████████░░░░░░░░]',
            'Memory: 2.1GB / 8GB [████░░░░░░░░░░░░]',
            'Disk I/O: Read: 125 MB/s | Write: 89 MB/s',
            'Network: ↓ 1.2MB/s ↑ 450KB/s',
            'Processes: 127 running',
            'Uptime: 3 days 14 hours 23 minutes',
            '',
            'Active Processes:',
            'PID    USER     %CPU  %MEM  COMMAND',
            '1234   root     12.3  4.2   python3 exploit.py',
            '5678   hacker   8.9   2.1   nmap -sS',
            '9012   root     6.7   1.8   metasploit',
            '3456   hacker   5.4   3.2   wireshark',
            '7890   root     4.1   1.5   sqlmap',
            '',
            'Temperature: CPU 68°C | GPU 52°C',
            'Battery: 87% (Charging)',
        ],
    }

    useEffect(() => {
        let index = 0
        const data = hackingData[windowId] || []
        
        const interval = setInterval(() => {
            if (index < data.length) {
                setLines(prev => [...prev, data[index]])
                index++
            } else {
                // Add random hacking data
                const randomData = generateRandomHackingData(windowId)
                setLines(prev => [...prev, randomData])
            }

            // Auto-scroll to bottom
            if (contentRef.current) {
                contentRef.current.scrollTop = contentRef.current.scrollHeight
            }
        }, 800 + Math.random() * 400)

        return () => clearInterval(interval)
    }, [windowId])

    return (
        <div ref={contentRef} className="terminal-scroll">
            {lines.map((line, i) => <TerminalLine key={i} text={line} />)}
        </div>
    )
}

function generateRandomHackingData(windowId) {
    const random = [
        [
            `Scanning port ${Math.floor(Math.random() * 65535)}...`,
            `Host ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} is up`,
            `Service detected: ${['HTTP', 'SSH', 'FTP', 'SMTP', 'MySQL', 'PostgreSQL'][Math.floor(Math.random() * 6)]}`,
            `Analyzing packet ${Math.floor(Math.random() * 100000)}...`,
        ],
        [
            `[+] Exploit module loaded: ${['multi/handler', 'windows/smb', 'linux/ssh'][Math.floor(Math.random() * 3)]}`,
            `[*] Sending payload (${Math.floor(Math.random() * 50000)} bytes)...`,
            `[+] Session ${Math.floor(Math.random() * 100)} opened`,
            `meterpreter > ${['sysinfo', 'getuid', 'hashdump', 'screenshot'][Math.floor(Math.random() * 4)]}`,
        ],
        [
            `Packets captured: ${Math.floor(Math.random() * 100000)}`,
            `HTTP requests: ${Math.floor(Math.random() * 1000)}`,
            `DNS queries: ${Math.floor(Math.random() * 500)}`,
            `ARP packets: ${Math.floor(Math.random() * 200)}`,
        ],
        [
            `CPU Usage: ${Math.floor(Math.random() * 100)}% [${Array(16).fill('').map((_, i) => i < Math.random() * 16 ? '█' : '░').join('')}]`,
            `Memory: ${(Math.random() * 8).toFixed(1)}GB / 8GB`,
            `Network: ↓ ${(Math.random() * 5).toFixed(1)}MB/s ↑ ${(Math.random() * 2).toFixed(1)}MB/s`,
            `Active connections: ${Math.floor(Math.random() * 50)}`,
        ],
    ]

    return random[windowId - 1][Math.floor(Math.random() * 4)]
}

// IP Lookup Terminal Component
function IPTerminal() {
    const [lines, setLines] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const contentRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        // Get current public IP on mount
        fetchIPInfo()
    }, [])

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight
        }
    }, [lines])

    const fetchIPInfo = async (ip = null) => {
        setLoading(true)
        const targetIP = ip || 'current'
        
        try {
            // Using ipapi.co for IP geolocation
            const apiUrl = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/'
            const response = await fetch(apiUrl)
            const data = await response.json()

            if (data.error) {
                addLines([
                    `<span class="red">Error: ${data.reason || 'Invalid IP address'}</span>`,
                    ''
                ])
            } else {
                addLines([
                    `<span class="green">┌─[root@kali]─[~]</span>`,
                    `<span class="green">└──╼ $</span> whois ${ip || data.ip}`,
                    '',
                    '<span class="cyan">═══════════════════════════════════════════════════</span>',
                    `<span class="yellow">IP ADDRESS:</span>        ${data.ip}`,
                    `<span class="yellow">HOSTNAME:</span>          ${data.org || 'N/A'}`,
                    `<span class="yellow">COUNTRY:</span>           ${data.country_name || 'N/A'} (${data.country || 'N/A'})`,
                    `<span class="yellow">REGION:</span>            ${data.region || 'N/A'}`,
                    `<span class="yellow">CITY:</span>              ${data.city || 'N/A'}`,
                    `<span class="yellow">POSTAL CODE:</span>       ${data.postal || 'N/A'}`,
                    `<span class="yellow">COORDINATES:</span>       ${data.latitude || 'N/A'}, ${data.longitude || 'N/A'}`,
                    `<span class="yellow">TIMEZONE:</span>          ${data.timezone || 'N/A'}`,
                    `<span class="yellow">ISP:</span>               ${data.org || 'N/A'}`,
                    `<span class="yellow">ASN:</span>               ${data.asn || 'N/A'}`,
                    `<span class="yellow">CURRENCY:</span>          ${data.currency || 'N/A'}`,
                    `<span class="yellow">LANGUAGES:</span>         ${data.languages || 'N/A'}`,
                    '<span class="cyan">═══════════════════════════════════════════════════</span>',
                    ''
                ])
            }
        } catch (error) {
            addLines([
                `<span class="red">Error: Failed to fetch IP information</span>`,
                `<span class="red">${error.message}</span>`,
                ''
            ])
        }
        
        setLoading(false)
    }

    const addLines = (newLines) => {
        setLines(prev => [...prev, ...newLines])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim() && !loading) {
            const ip = input.trim()
            setInput('')
            fetchIPInfo(ip)
        }
    }

    return (
        <div className="ip-terminal" onClick={() => inputRef.current?.focus()}>
            <div ref={contentRef} className="terminal-scroll">
                {lines.map((line, i) => <TerminalLine key={i} text={line} />)}
                {loading && <TerminalLine text='<span class="yellow">Loading...</span>' />}
            </div>
            <form onSubmit={handleSubmit} className="terminal-input-form">
                <span className="terminal-prompt">
                    <span className="green">┌─[root@kali]─[~]</span><br />
                    <span className="green">└──╼ $ </span>
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="terminal-input"
                    placeholder="Enter IP address..."
                    disabled={loading}
                    autoFocus
                />
            </form>
        </div>
    )
}

// Logo window with hacking animation
function LogoWindow() {
    const [glitch, setGlitch] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true)
            setTimeout(() => setGlitch(false), 150)
        }, 3000 + Math.random() * 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`logo-content ${glitch ? 'glitch' : ''}`}>
            <div className="tree-logo-animated">
                <svg viewBox="0 0 200 200" width="140" height="140">
                    <circle cx="100" cy="100" r="95" fill="none" stroke="#00ff99" strokeWidth="2" className="pulse-ring"/>
                    <rect x="92" y="130" width="16" height="40" fill="#00ff99"/>
                    <path d="M 85 170 Q 70 175 60 180 M 115 170 Q 130 175 140 180 M 100 170 L 100 180" stroke="#00ff99" strokeWidth="2" fill="none"/>
                    <ellipse cx="100" cy="90" rx="50" ry="35" fill="#00ff99" className="tree-part"/>
                    <ellipse cx="75" cy="100" rx="35" ry="30" fill="#00ff99" className="tree-part"/>
                    <ellipse cx="125" cy="100" rx="35" ry="30" fill="#00ff99" className="tree-part"/>
                    <ellipse cx="100" cy="70" rx="30" ry="25" fill="#00ff99" className="tree-part"/>
                    <circle cx="80" cy="95" r="3" fill="#050d0d" className="tree-eye"/>
                    <circle cx="120" cy="95" r="3" fill="#050d0d" className="tree-eye"/>
                    <circle cx="100" cy="85" r="3" fill="#050d0d" className="tree-eye"/>
                </svg>
            </div>
            <div className="raintree-title-animated">RAINTREE.WIKI</div>
            <div className="binary-rain">
                {Array(20).fill('').map((_, i) => (
                    <span key={i} className="binary-digit" style={{ left: `${i * 5}%`, animationDelay: `${Math.random() * 2}s` }}>
                        {Math.random() > 0.5 ? '1' : '0'}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default function App() {
    const [wins, setWins] = useState([1, 2, 3, 4, 5, 6].map(id => ({ id, visible: true })))
    const [focused, setFocused] = useState(5)

    useEffect(() => {
        const updateCursor = (e) => {
            document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px')
            document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px')
        }
        document.addEventListener('mousemove', updateCursor)
        return () => document.removeEventListener('mousemove', updateCursor)
    }, [])

    const close = (id) => setWins(wins.map(w => w.id === id ? { ...w, visible: false } : w))
    const minimize = (id) => setWins(wins.map(w => w.id === id ? { ...w, visible: false } : w))
    const getZ = (id) => id === focused ? 1000 : 100 + id

    // Grid layout: 2x2 on left, IP terminal on right, logo at top right
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const gridWidth = windowWidth * 0.65
    const gridHeight = windowHeight - 40
    const cellWidth = gridWidth / 2
    const cellHeight = gridHeight / 2
    const rightColWidth = windowWidth * 0.35
    const logoHeight = 250

    const data = [
        { id: 1, title: 'NETWORK SCANNER', x: 20, y: 20, w: cellWidth - 30, h: cellHeight - 30 },
        { id: 2, title: 'EXPLOIT FRAMEWORK', x: cellWidth + 10, y: 20, w: cellWidth - 30, h: cellHeight - 30 },
        { id: 3, title: 'NETWORK MONITOR', x: 20, y: cellHeight + 10, w: cellWidth - 30, h: cellHeight - 30 },
        { id: 4, title: 'SYSTEM MONITOR', x: cellWidth + 10, y: cellHeight + 10, w: cellWidth - 30, h: cellHeight - 30 },
        { id: 5, title: 'IP LOOKUP TERMINAL - ROOT@KALI', x: gridWidth + 20, y: logoHeight + 30, w: rightColWidth - 40, h: gridHeight - logoHeight - 40 },
        { id: 6, title: 'RAINTREE.WIKI', x: gridWidth + 20, y: 20, w: rightColWidth - 40, h: logoHeight },
    ]

    return (
        <div className="desktop">
            <div className="star-cursor"></div>
            {wins.filter(w => w.visible).map(w => {
                const cfg = data.find(d => d.id === w.id)
                if (!cfg) return null
                return (
                    <Window
                        key={w.id}
                        id={w.id}
                        title={cfg.title}
                        x={cfg.x}
                        y={cfg.y}
                        width={cfg.w}
                        height={cfg.h}
                        zIndex={getZ(w.id)}
                        onClose={() => close(w.id)}
                        onMinimize={() => minimize(w.id)}
                        onFocus={() => setFocused(w.id)}
                    >
                        {w.id === 6 ? (
                            <LogoWindow />
                        ) : w.id === 5 ? (
                            <IPTerminal />
                        ) : (
                            <HackingTerminal windowId={w.id} />
                        )}
                    </Window>
                )
            })}
        </div>
    )
}