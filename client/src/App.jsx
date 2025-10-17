import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react'
import AuthWindow from './AuthWindow'
import Dashboard from './Dashboard'

function Window({ id, title, children, x, y, width, height, onClose, onMinimize, zIndex, onFocus, glitch }) {
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
        <div ref={ref} className={`window ${glitch ? 'glitch' : ''}`} style={{ left: pos.x, top: pos.y, width, height, zIndex }} onClick={onFocus}>
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

const TerminalLine = memo(({ text }) => <div className="terminal-line" dangerouslySetInnerHTML={{ __html: text }} />)

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
                setLines(prev => {
                    // Limit lines to prevent memory issues
                    const newLines = [...prev, data[index]]
                    return newLines.length > 100 ? newLines.slice(-100) : newLines
                })
                index++
            } else {
                // Add random hacking data
                const randomData = generateRandomHackingData(windowId)
                setLines(prev => {
                    const newLines = [...prev, randomData]
                    return newLines.length > 100 ? newLines.slice(-100) : newLines
                })
            }

            // Auto-scroll to bottom
            if (contentRef.current) {
                contentRef.current.scrollTop = contentRef.current.scrollHeight
            }
        }, 1000 + Math.random() * 500)

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
        // Show welcome message and get current public IP on mount
        addLines([
            '<span class="cyan">═══════════════════════════════════════════════════</span>',
            '<span class="green bold">IP LOOKUP TERMINAL - INITIALIZING...</span>',
            '<span class="yellow">Fetching your public IP address...</span>',
            '<span class="cyan">═══════════════════════════════════════════════════</span>',
            ''
        ])
        fetchIPInfo()
    }, [])

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight
        }
    }, [lines])

    const fetchIPInfo = async (ip = null) => {
        setLoading(true)
        
        try {
            let response, data
            
            if (ip) {
                // Lookup specific IP using /api/run
                response = await fetch('/api/run', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ip })
                })
                data = await response.json()
            } else {
                // Get current public IP using /api/ipinfo
                response = await fetch('/api/ipinfo')
                data = await response.json()
            }

            if (data.error || !data.info) {
                addLines([
                    `<span class="red">Error: ${data.error || 'Invalid IP address'}</span>`,
                    ''
                ])
            } else {
                const info = data.info
                const isOwnIP = !ip // If no IP was provided, this is the user's own IP
                addLines([
                    `<span class="kali-prompt"><span class="red bold">(root💀HackWare-Kali)</span><span class="cyan">-[~]</span></span>`,
                    `<span class="red bold">#</span> whois ${data.ip}`,
                    '',
                    '<span class="cyan">═══════════════════════════════════════════════════</span>',
                    isOwnIP ? '<span class="green bold">YOUR PUBLIC IP INFORMATION:</span>' : '<span class="yellow bold">IP LOOKUP RESULT:</span>',
                    `<span class="yellow">IP ADDRESS:</span>        ${data.ip}`,
                    `<span class="yellow">HOSTNAME:</span>          ${info.org || info.isp || 'N/A'}`,
                    `<span class="yellow">COUNTRY:</span>           ${info.country || 'N/A'}`,
                    `<span class="yellow">REGION:</span>            ${info.regionName || info.region || 'N/A'}`,
                    `<span class="yellow">CITY:</span>              ${info.city || 'N/A'}`,
                    `<span class="yellow">POSTAL CODE:</span>       ${info.zip || 'N/A'}`,
                    `<span class="yellow">COORDINATES:</span>       ${info.lat || 'N/A'}, ${info.lon || 'N/A'}`,
                    `<span class="yellow">TIMEZONE:</span>          ${info.timezone || 'N/A'}`,
                    `<span class="yellow">ISP:</span>               ${info.isp || 'N/A'}`,
                    `<span class="yellow">ORG:</span>               ${info.org || 'N/A'}`,
                    `<span class="yellow">AS:</span>                ${info.as || 'N/A'}`,
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
                <div className="terminal-prompt-wrapper">
                    <div className="kali-prompt-line">
                        <span className="green">┌─</span>
                        <span className="kali-prompt"><span className="red bold">(root💀HackWare-Kali)</span><span className="cyan">-[~]</span></span>
                    </div>
                    <div className="terminal-input-line">
                        <span className="green">└──╼ $ </span>
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
                    </div>
                </div>
            </form>
        </div>
    )
}

// Matrix Rain Animation
const MatrixRain = memo(() => {
    const columns = useMemo(() => {
        const cols = Math.floor(window.innerWidth / 20)
        return Array(cols).fill('').map((_, i) => ({
            id: i,
            left: `${i * 20}px`,
            delay: `${Math.random() * 5}s`,
            duration: `${10 + Math.random() * 10}s`
        }))
    }, [])

    return (
        <div className="matrix-rain">
            {columns.map(col => (
                <div 
                    key={col.id} 
                    className="matrix-column" 
                    style={{ 
                        left: col.left, 
                        animationDelay: col.delay,
                        animationDuration: col.duration
                    }}
                >
                    {Array(20).fill('').map((_, i) => (
                        <span key={i}>{String.fromCharCode(0x30A0 + Math.random() * 96)}</span>
                    ))}
                </div>
            ))}
        </div>
    )
})

// Scanning Lines Animation
const ScanLines = memo(() => (
    <div className="scan-lines-container">
        <div className="scan-line scan-line-1"></div>
        <div className="scan-line scan-line-2"></div>
        <div className="scan-line scan-line-3"></div>
    </div>
))

// Code Stream Animation
const CodeStream = memo(() => {
    const codeLines = useMemo(() => [
        '> Initializing neural network...',
        '> Loading quantum algorithms...',
        '> Establishing secure connection...',
        '> Decrypting data stream...',
        '> Analyzing network topology...',
        '> Compiling exploit modules...',
        '> Scanning for vulnerabilities...',
        '> Injecting payload...',
        '> Bypassing firewall...',
        '> Access granted...'
    ], [])

    return (
        <div className="code-stream">
            {codeLines.map((line, i) => (
                <div 
                    key={i} 
                    className="code-line" 
                    style={{ animationDelay: `${i * 2}s` }}
                >
                    <span className="green">{line}</span>
                </div>
            ))}
        </div>
    )
})

// Hexagonal Grid Background
const HexGrid = memo(() => {
    const hexagons = useMemo(() => {
        const count = 15
        return Array(count).fill('').map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 10}s`,
            duration: `${15 + Math.random() * 10}s`
        }))
    }, [])

    return (
        <div className="hex-grid">
            {hexagons.map(hex => (
                <div 
                    key={hex.id} 
                    className="hexagon" 
                    style={{ 
                        top: hex.top, 
                        left: hex.left,
                        animationDelay: hex.delay,
                        animationDuration: hex.duration
                    }}
                >
                    <div className="hex-inner"></div>
                </div>
            ))}
        </div>
    )
})

// Binary Stream Animation
const BinaryStream = memo(() => {
    const streams = useMemo(() => {
        return Array(8).fill('').map((_, i) => ({
            id: i,
            left: `${10 + i * 12}%`,
            delay: `${Math.random() * 5}s`,
            binary: Array(30).fill('').map(() => Math.random() > 0.5 ? '1' : '0').join('')
        }))
    }, [])

    return (
        <div className="binary-stream-bg">
            {streams.map(stream => (
                <div 
                    key={stream.id} 
                    className="binary-column-bg" 
                    style={{ left: stream.left, animationDelay: stream.delay }}
                >
                    {stream.binary}
                </div>
            ))}
        </div>
    )
})

// Circuit Board Pattern
const CircuitBoard = memo(() => {
    const lines = useMemo(() => {
        return Array(20).fill('').map((_, i) => ({
            id: i,
            type: Math.random() > 0.5 ? 'horizontal' : 'vertical',
            position: `${Math.random() * 100}%`,
            length: `${30 + Math.random() * 40}%`,
            delay: `${Math.random() * 10}s`
        }))
    }, [])

    return (
        <div className="circuit-board">
            {lines.map(line => (
                <div 
                    key={line.id} 
                    className={`circuit-line ${line.type}`}
                    style={{
                        [line.type === 'horizontal' ? 'top' : 'left']: line.position,
                        [line.type === 'horizontal' ? 'width' : 'height']: line.length,
                        animationDelay: line.delay
                    }}
                />
            ))}
        </div>
    )
})

// Data Packets Animation
const DataPackets = memo(() => {
    const packets = useMemo(() => {
        return Array(12).fill('').map((_, i) => ({
            id: i,
            startX: `${Math.random() * 100}%`,
            startY: `${Math.random() * 100}%`,
            endX: `${Math.random() * 100}%`,
            endY: `${Math.random() * 100}%`,
            delay: `${Math.random() * 8}s`,
            duration: `${5 + Math.random() * 5}s`
        }))
    }, [])

    return (
        <div className="data-packets">
            {packets.map(packet => (
                <div 
                    key={packet.id} 
                    className="data-packet"
                    style={{
                        '--start-x': packet.startX,
                        '--start-y': packet.startY,
                        '--end-x': packet.endX,
                        '--end-y': packet.endY,
                        animationDelay: packet.delay,
                        animationDuration: packet.duration
                    }}
                />
            ))}
        </div>
    )
})

// Animated Hacking Content Component
const AnimatedHackingContent = memo(({ content }) => {
    const [displayedText, setDisplayedText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    
    useEffect(() => {
        if (currentIndex < content.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + content[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, 20) // Type speed: 20ms per character
            
            return () => clearTimeout(timeout)
        }
    }, [currentIndex, content])
    
    return (
        <pre className="alert-content-text">{displayedText}<span className="cursor-blink">_</span></pre>
    )
})

// Logo window with hacking animation
const LogoWindow = memo(({ onUserSystemClick }) => {
    // Memoize binary digits to prevent re-generation
    const binaryDigits = useMemo(() => 
        Array(15).fill('').map((_, i) => ({
            key: i,
            left: `${i * 6.67}%`,
            delay: `${Math.random() * 2}s`,
            digit: Math.random() > 0.5 ? '1' : '0'
        }))
    , [])

    return (
        <div className="logo-content">
            <div className="tree-logo-animated">
                <svg viewBox="0 0 200 200" width="70" height="70">
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
            <div className="logo-buttons-row">
                <button className="user-system-btn" onClick={onUserSystemClick}>
                    <span className="green">► USER SYSTEM</span>
                </button>
            </div>
            <div className="binary-rain">
                {binaryDigits.map(({ key, left, delay, digit }) => (
                    <span key={key} className="binary-digit" style={{ left, animationDelay: delay }}>
                        {digit}
                    </span>
                ))}
            </div>
        </div>
    )
})

export default function App() {
    const [wins, setWins] = useState([1, 2, 3, 4, 5, 6, 7].map(id => ({ id, visible: id !== 7, glitch: false })))
    const [focused, setFocused] = useState(1)
    const [user, setUser] = useState(null)
    const [showAuth, setShowAuth] = useState(false)
    const [authKey, setAuthKey] = useState(0)
    const [hackingWindows, setHackingWindows] = useState([])
    const [nextHackingId, setNextHackingId] = useState(1000)
    const [isCreatingHackWindow, setIsCreatingHackWindow] = useState(false)
    const [globalGlitch, setGlobalGlitch] = useState(false)
    const windowTimeoutsRef = useRef(new Map())
    const windowCreationTimesRef = useRef(new Map())

    // Check for existing session on mount
    useEffect(() => {
        const userId = localStorage.getItem('user_id')
        const userPassword = localStorage.getItem('user_password')
        if (userId && userPassword) {
            setUser({ id: userId, password: userPassword })
        }
    }, [])

    // Individual window glitch effect
    useEffect(() => {
        const isDashboardOpen = wins.find(w => w.id === 7)?.visible
        
        if (isDashboardOpen) {
            return // No glitches when dashboard is open
        }
        
        const glitchRandomWindow = () => {
            const visibleWindows = wins.filter(w => w.visible && w.id !== 7)
            if (visibleWindows.length === 0) return
            
            const randomWindow = visibleWindows[Math.floor(Math.random() * visibleWindows.length)]
            
            setWins(prev => prev.map(w => 
                w.id === randomWindow.id ? { ...w, glitch: true } : w
            ))
            
            setTimeout(() => {
                setWins(prev => prev.map(w => 
                    w.id === randomWindow.id ? { ...w, glitch: false } : w
                ))
            }, 150 + Math.random() * 150)
        }
        
        const interval = setInterval(glitchRandomWindow, 800 + Math.random() * 1200)
        return () => clearInterval(interval)
    }, [wins])
    
    // Random hacking window system
    useEffect(() => {
        const isDashboardOpen = wins.find(w => w.id === 7)?.visible
        
        if (isDashboardOpen) {
            // Clear all hacking windows when dashboard opens
            setHackingWindows([])
            setIsCreatingHackWindow(false)
            // Clear all timeouts
            windowTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
            windowTimeoutsRef.current.clear()
            return
        }
        
        const messages = [
            { title: '⚠ SYSTEM BREACH DETECTED', content: 'Unauthorized access detected\n━━━━━━━━━━━━━━━━━━━━━━\nIP Address: 192.168.1.1\nPort: 8080\nProtocol: TCP\nStatus: COMPROMISED\n━━━━━━━━━━━━━━━━━━━━━━\nAction: Monitoring...', type: 'alert' },
            { title: '🔓 DECRYPTION IN PROGRESS', content: 'Breaking encryption...\n━━━━━━━━━━━━━━━━━━━━━━\nAlgorithm: AES-256\nProgress: 87%\nKeys tested: 2,847,392\nTime remaining: 23s\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'info' },
            { title: '📡 PACKET SNIFFER ACTIVE', content: 'Capturing network traffic...\n━━━━━━━━━━━━━━━━━━━━━━\nPackets captured: 1,247\nProtocol: TCP/IP\nBandwidth: 2.4 Mbps\nTarget: 10.0.0.1\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: MONITORING', type: 'scan' },
            { title: '🔥 FIREWALL BYPASS', content: 'Exploiting vulnerability...\n━━━━━━━━━━━━━━━━━━━━━━\nCVE: 2024-1337\nExploit: Buffer Overflow\nSuccess rate: 94%\nAttempts: 3/5\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: IN PROGRESS', type: 'exploit' },
            { title: '💉 SQL INJECTION SUCCESS', content: 'Database compromised!\n━━━━━━━━━━━━━━━━━━━━━━\nTables found: 12\nRecords: 45,892\nAdmin access: GRANTED\nPrivileges: FULL\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: COMPLETE', type: 'success' },
            { title: '🔨 BRUTE FORCE ATTACK', content: 'Cracking passwords...\n━━━━━━━━━━━━━━━━━━━━━━\nAttempts: 45,892\nSpeed: 1,200/sec\nMatch found: ********\nHash: MD5\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: SUCCESS', type: 'crack' },
            { title: '🚪 BACKDOOR INSTALLED', content: 'Remote access enabled\n━━━━━━━━━━━━━━━━━━━━━━\nPort: 4444\nConnection: STABLE\nEncryption: None\nPersistence: YES\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'success' },
            { title: '🌐 DNS SPOOFING', content: 'Redirecting traffic...\n━━━━━━━━━━━━━━━━━━━━━━\nTarget: bank.com\nProxy: 10.0.0.1\nRequests: 247\nSuccess: 100%\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'exploit' },
            { title: '⌨️ KEYLOGGER RUNNING', content: 'Recording keystrokes...\n━━━━━━━━━━━━━━━━━━━━━━\nBuffer: 2.4 KB\nKeys logged: 1,847\nUpload: PENDING\nTarget: admin\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'alert' },
            { title: '👑 PRIVILEGE ESCALATION', content: 'Gaining root access...\n━━━━━━━━━━━━━━━━━━━━━━\nUser: admin\nPrivileges: ELEVATED\nMethod: Exploit\nAccess: FULL\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: COMPLETE', type: 'success' },
            { title: '🎯 DDoS ATTACK INITIATED', content: 'Flooding target server...\n━━━━━━━━━━━━━━━━━━━━━━\nTarget: 203.0.113.0\nBots: 10,000\nRequests/sec: 50,000\nServer status: OVERLOADED\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'alert' },
            { title: '🦠 MALWARE DEPLOYED', content: 'Trojan injection successful\n━━━━━━━━━━━━━━━━━━━━━━\nPayload: Ransomware\nFiles encrypted: 2,847\nDemand: 5 BTC\nSpread: Network-wide\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: DEPLOYED', type: 'alert' },
            { title: '🔍 PORT SCANNING', content: 'Scanning target ports...\n━━━━━━━━━━━━━━━━━━━━━━\nTarget: 192.168.0.0/24\nPorts scanned: 65,535\nOpen ports: 23\nVulnerable: 5\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: COMPLETE', type: 'scan' },
            { title: '💾 DATA EXFILTRATION', content: 'Stealing sensitive data...\n━━━━━━━━━━━━━━━━━━━━━━\nFiles copied: 1,247\nSize: 2.4 GB\nDestination: 10.0.0.1\nProgress: 78%\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: IN PROGRESS', type: 'exploit' },
            { title: '🛡️ ANTIVIRUS DISABLED', content: 'Security bypassed\n━━━━━━━━━━━━━━━━━━━━━━\nTarget: Windows Defender\nMethod: Registry edit\nReal-time protection: OFF\nFirewall: DISABLED\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: SUCCESS', type: 'success' },
            { title: '📧 PHISHING CAMPAIGN', content: 'Sending malicious emails...\n━━━━━━━━━━━━━━━━━━━━━━\nEmails sent: 10,000\nOpened: 3,247\nClicked: 892\nCredentials stolen: 247\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'exploit' },
            { title: '🔐 CERTIFICATE FORGED', content: 'SSL certificate cloned\n━━━━━━━━━━━━━━━━━━━━━━\nTarget: paypal.com\nValidity: 365 days\nSigned: Self-signed\nTrust: Bypassed\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'success' },
            { title: '🎭 IDENTITY SPOOFED', content: 'Impersonating user...\n━━━━━━━━━━━━━━━━━━━━━━\nTarget: admin@company.com\nSession hijacked: YES\nCookies stolen: 15\nAccess level: FULL\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'exploit' },
            { title: '⚡ ZERO-DAY EXPLOIT', content: 'Using unknown vulnerability\n━━━━━━━━━━━━━━━━━━━━━━\nCVE: UNKNOWN\nAffected: All versions\nPatch available: NO\nExploit success: 100%\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: CRITICAL', type: 'alert' },
            { title: '🌊 BUFFER OVERFLOW', content: 'Memory corruption detected\n━━━━━━━━━━━━━━━━━━━━━━\nBuffer size: 256 bytes\nOverflow: 1024 bytes\nShellcode injected: YES\nExecution: SUCCESSFUL\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: EXPLOITED', type: 'success' },
            { title: '🎪 MAN-IN-THE-MIDDLE', content: 'Intercepting communications\n━━━━━━━━━━━━━━━━━━━━━━\nTarget: 192.168.1.100\nProxy: Transparent\nData captured: 2.1 MB\nCredentials: 12\n━━━━━━━━━━━━━━━━━━━━━━\nStatus: ACTIVE', type: 'exploit' }
        ]
        
        const createHackingWindow = () => {
            const message = messages[Math.floor(Math.random() * messages.length)]
            const windowId = nextHackingId
            setNextHackingId(prev => prev + 1)
            
            const windowWidth = 400
            const windowHeight = 280
            const maxX = window.innerWidth - windowWidth - 50
            const maxY = window.innerHeight - windowHeight - 50
            
            // Calculate typing duration (20ms per character)
            const typingDuration = message.content.length * 20
            // Window stays for: typing time + 2 seconds after typing completes
            const windowLifetime = typingDuration + 2000
            
            const hackWindow = {
                id: windowId,
                title: message.title,
                content: message.content,
                type: message.type,
                x: Math.max(50, Math.random() * maxX),
                y: Math.max(50, Math.random() * maxY),
                width: windowWidth,
                height: windowHeight,
                visible: true,
                glitch: false,
                lifetime: windowLifetime
            }
            
            // Add new window (can have multiple on screen)
            setHackingWindows(prev => [...prev, hackWindow])
            
            // Track creation time
            windowCreationTimesRef.current.set(windowId, Date.now())
            
            // Auto-close after typing completes + 2 seconds
            const timeoutId = setTimeout(() => {
                setHackingWindows(prev => {
                    const filtered = prev.filter(w => w.id !== windowId)
                    console.log(`[AUTO-CLOSE] Window ${windowId} closed after ${windowLifetime}ms, remaining: ${filtered.length}`)
                    return filtered
                })
                // Remove from tracking
                windowTimeoutsRef.current.delete(windowId)
                windowCreationTimesRef.current.delete(windowId)
            }, windowLifetime)
            
            // Track timeout in ref for cleanup
            windowTimeoutsRef.current.set(windowId, timeoutId)
            console.log(`[CREATED] Window ${windowId}, lifetime: ${windowLifetime}ms, total windows: ${windowCreationTimesRef.current.size}`)
        }
        
        // Create first window after 1 second
        const initialTimeout = setTimeout(createHackingWindow, 1000)
        
        // Create new window every 2 seconds
        const interval = setInterval(createHackingWindow, 2000)
        
        return () => {
            clearTimeout(initialTimeout)
            clearInterval(interval)
            // Clear all pending timeouts
            windowTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
            windowTimeoutsRef.current.clear()
            console.log('[CLEANUP] All window timeouts cleared')
        }
    }, [wins, nextHackingId, isCreatingHackWindow])
    
    const closeHackingWindow = (id) => {
        // Clear the timeout if it exists
        const timeoutId = windowTimeoutsRef.current.get(id)
        if (timeoutId) {
            clearTimeout(timeoutId)
            windowTimeoutsRef.current.delete(id)
            windowCreationTimesRef.current.delete(id)
            console.log(`[MANUAL-CLOSE] Window ${id} closed manually, timeout cleared`)
        }
        setHackingWindows(prev => prev.filter(w => w.id !== id))
    }
    
    // Full cleanup every 10 seconds - removes ALL windows
    useEffect(() => {
        console.log('[FULL-CLEANUP] 10-second cleanup timer started')
        
        const fullCleanupInterval = setInterval(() => {
            console.log(`[FULL-CLEANUP] Force removing ALL windows at ${new Date().toLocaleTimeString()}`)
            
            // Force clear state
            setHackingWindows([])
            
            // Clear all timeouts and tracking
            windowTimeoutsRef.current.forEach(timeoutId => {
                try {
                    clearTimeout(timeoutId)
                } catch (e) {
                    console.error('Error clearing timeout:', e)
                }
            })
            windowTimeoutsRef.current.clear()
            windowCreationTimesRef.current.clear()
            
            // Force re-render to ensure DOM cleanup
            setTimeout(() => {
                setHackingWindows(prev => {
                    if (prev.length > 0) {
                        console.log(`[FULL-CLEANUP] Secondary cleanup removed ${prev.length} remaining windows`)
                        return []
                    }
                    return prev
                })
            }, 100)
        }, 10000) // Full cleanup every 10 seconds
        
        return () => {
            console.log('[FULL-CLEANUP] Cleanup timer stopped')
            clearInterval(fullCleanupInterval)
        }
    }, []) // Empty dependency - runs once and never resets

    useEffect(() => {
        let rafId = null
        let mouseX = 0
        let mouseY = 0

        const updateCursor = (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
            
            if (!rafId) {
                rafId = requestAnimationFrame(() => {
                    document.documentElement.style.setProperty('--mouse-x', mouseX + 'px')
                    document.documentElement.style.setProperty('--mouse-y', mouseY + 'px')
                    rafId = null
                })
            }
        }
        
        document.addEventListener('mousemove', updateCursor, { passive: true })
        return () => {
            document.removeEventListener('mousemove', updateCursor)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [])

    const close = (id) => {
        setWins(prev => prev.map(w => w.id === id ? { ...w, visible: false } : w))
        if (id === 7) {
            setShowAuth(false)
        }
    }
    const minimize = (id) => setWins(prev => prev.map(w => w.id === id ? { ...w, visible: false } : w))
    const getZ = (id) => {
        // Window 7 (auth/dashboard) should always be on top when visible
        if (id === 7 && wins.find(w => w.id === 7)?.visible) return 2000
        // Window 6 (logo) should be on top when focused
        if (id === 6 && focused === 6) return 1500
        return id === focused ? 1000 : 100 + id
    }

    const handleAuthSuccess = (userData) => {
        setUser(userData)
        setShowAuth(false)
        // Keep window 7 open to show dashboard
    }

    const handleLogout = () => {
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_password')
        setUser(null)
        setAuthKey(prev => prev + 1) // Force AuthWindow to reset
    }

    const openUserSystem = () => {
        // Hide all hacking windows when opening dashboard
        setHackingWindows([])
        // Clear all timeouts
        windowTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
        windowTimeoutsRef.current.clear()
        windowCreationTimesRef.current.clear()
        
        if (user) {
            // User already logged in, open dashboard in window 7
            setWins(prev => prev.map(w => w.id === 7 ? { ...w, visible: true } : w))
            setFocused(7)
        } else {
            // Show auth
            setShowAuth(true)
            setWins(prev => prev.map(w => w.id === 7 ? { ...w, visible: true } : w))
            setFocused(7)
        }
    }


    // Add user system button to logo window
    const UserSystemButton = () => (
        <button className="user-system-btn" onClick={openUserSystem}>
            <span className="green">{user ? '[DASHBOARD]' : '[USER SYSTEM]'}</span>
        </button>
    )

    // Responsive grid layout
    const [dimensions, setDimensions] = useState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
    })

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                windowHeight: window.innerHeight,
                windowWidth: window.innerWidth
            })
            // Force window positions to update on resize
            setWins(prev => [...prev])
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const windowHeight = dimensions.windowHeight
    const windowWidth = dimensions.windowWidth
    
    // Responsive layout: stack vertically on mobile, grid on desktop
    const isMobile = windowWidth < 768
    const isTablet = windowWidth >= 768 && windowWidth < 1200
    
    let data
    if (isMobile) {
        // Mobile: stack all windows vertically
        const winHeight = Math.max(250, windowHeight * 0.3)
        const logoHeight = 320 // Increased to show all logo content including button
        const ipTerminalHeight = 550 // Increased to show all IP details without scrolling
        const gap = 10 // Consistent gap between windows
        let currentY = 10
        
        // Check if User Dashboard is open
        const isDashboardOpen = wins.find(w => w.id === 7)?.visible
        
        if (isDashboardOpen) {
            // When dashboard is open, only show it and make it full height
            data = [
                { id: 7, title: user ? 'USER DASHBOARD' : 'USER SYSTEM - AUTHENTICATE', x: 10, y: 10, w: windowWidth - 20, h: windowHeight - 20 }
            ]
        } else {
            // Normal layout when dashboard is closed
            // Logo window
            data = [
                { id: 6, title: 'RAINTREE.WIKI', x: 10, y: currentY, w: windowWidth - 20, h: logoHeight },
            ]
            currentY += logoHeight + gap
            
            // IP Terminal - taller to show all IP details without scrolling
            data.push({ id: 5, title: 'IP LOOKUP TERMINAL - ROOT@KALI', x: 10, y: currentY, w: windowWidth - 20, h: ipTerminalHeight })
            currentY += ipTerminalHeight + gap
            
            // Hacking terminals (1-4) - these are always visible
            data.push({ id: 1, title: 'NETWORK SCANNER', x: 10, y: currentY, w: windowWidth - 20, h: winHeight })
            currentY += winHeight + gap
            
            data.push({ id: 2, title: 'EXPLOIT FRAMEWORK', x: 10, y: currentY, w: windowWidth - 20, h: winHeight })
            currentY += winHeight + gap
            
            data.push({ id: 3, title: 'NETWORK MONITOR', x: 10, y: currentY, w: windowWidth - 20, h: winHeight })
            currentY += winHeight + gap
            
            data.push({ id: 4, title: 'SYSTEM MONITOR', x: 10, y: currentY, w: windowWidth - 20, h: winHeight })
            currentY += winHeight + gap
            
            // User Dashboard at the end (may be hidden)
            data.push({ id: 7, title: user ? 'USER DASHBOARD' : 'USER SYSTEM - AUTHENTICATE', x: 10, y: currentY, w: windowWidth - 20, h: winHeight })
        }
    } else if (isTablet) {
        // Tablet: 2 columns
        const gridHeight = windowHeight - 40
        const cellWidth = (windowWidth - 40) / 2
        const cellHeight = gridHeight / 3
        data = [
            { id: 6, title: 'RAINTREE.WIKI', x: 10, y: 10, w: cellWidth - 10, h: 200 },
            { id: 5, title: 'IP LOOKUP TERMINAL - ROOT@KALI', x: cellWidth + 10, y: 10, w: cellWidth - 20, h: 200 },
            { id: 7, title: user ? 'USER DASHBOARD' : 'USER SYSTEM - AUTHENTICATE', x: 10, y: 220, w: windowWidth - 20, h: 400 },
            { id: 1, title: 'NETWORK SCANNER', x: 10, y: 630, w: cellWidth - 10, h: cellHeight - 20 },
            { id: 2, title: 'EXPLOIT FRAMEWORK', x: cellWidth + 10, y: 630, w: cellWidth - 20, h: cellHeight - 20 },
            { id: 3, title: 'NETWORK MONITOR', x: 10, y: 630 + cellHeight, w: cellWidth - 10, h: cellHeight - 20 },
            { id: 4, title: 'SYSTEM MONITOR', x: cellWidth + 10, y: 630 + cellHeight, w: cellWidth - 20, h: cellHeight - 20 },
        ]
    } else {
        // Desktop: 2x2 grid on left, IP terminal and logo on right, user system overlay
        const gridWidth = windowWidth * 0.65
        const gridHeight = windowHeight - 40
        const cellWidth = gridWidth / 2
        const cellHeight = gridHeight / 2
        const rightColWidth = windowWidth * 0.35
        const logoHeight = 250
        data = [
            { id: 1, title: 'NETWORK SCANNER', x: 20, y: 20, w: cellWidth - 30, h: cellHeight - 30 },
            { id: 2, title: 'EXPLOIT FRAMEWORK', x: cellWidth + 10, y: 20, w: cellWidth - 30, h: cellHeight - 30 },
            { id: 3, title: 'NETWORK MONITOR', x: 20, y: cellHeight + 10, w: cellWidth - 30, h: cellHeight - 30 },
            { id: 4, title: 'SYSTEM MONITOR', x: cellWidth + 10, y: cellHeight + 10, w: cellWidth - 30, h: cellHeight - 30 },
            { id: 5, title: 'IP LOOKUP TERMINAL - ROOT@KALI', x: gridWidth + 20, y: logoHeight + 30, w: rightColWidth - 40, h: gridHeight - logoHeight - 40 },
            { id: 6, title: 'RAINTREE.WIKI', x: gridWidth + 20, y: 20, w: rightColWidth - 40, h: logoHeight },
            { id: 7, title: user ? 'USER DASHBOARD' : 'USER SYSTEM - AUTHENTICATE', x: windowWidth / 2 - 400, y: 50, w: 800, h: windowHeight - 100 },
        ]
    }

    return (
        <div className="desktop">
            <div className="star-cursor"></div>
            <MatrixRain />
            <ScanLines />
            <CodeStream />
            <HexGrid />
            <BinaryStream />
            <CircuitBoard />
            <DataPackets />
            
            {/* Regular Windows */}
            {wins.filter(w => w.visible).map(w => {
                const cfg = data.find(d => d.id === w.id)
                if (!cfg) return null
                
                // On mobile, hide all other windows when User Dashboard (id: 7) is open
                const isDashboardOpen = isMobile && wins.find(win => win.id === 7)?.visible
                if (isMobile && isDashboardOpen && w.id !== 7) {
                    return null // Hide all other windows
                }
                
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
                        glitch={w.glitch}
                    >
                        {w.id === 6 ? (
                            <LogoWindow onUserSystemClick={openUserSystem} />
                        ) : w.id === 5 ? (
                            <IPTerminal />
                        ) : w.id === 7 ? (
                            user ? (
                                <Dashboard user={user} onLogout={handleLogout} />
                            ) : (
                                <AuthWindow key={authKey} onSuccess={handleAuthSuccess} onClose={() => close(7)} />
                            )
                        ) : (
                            <HackingTerminal windowId={w.id} />
                        )}
                    </Window>
                )
            })}
            
            {/* Hacking Alert Windows - Custom Design */}
            {hackingWindows.map(hw => (
                <div
                    key={`hack-${hw.id}`}
                    className="hacking-alert-box"
                    style={{
                        left: `${hw.x}px`,
                        top: `${hw.y}px`,
                        width: `${hw.width}px`,
                        zIndex: 10000 + hw.id
                    }}
                    data-window-id={hw.id}
                >
                    <div className="alert-box-header">
                        <span className="alert-box-title">{hw.title}</span>
                        <button 
                            className="alert-box-close" 
                            onClick={() => closeHackingWindow(hw.id)}
                        >
                            ×
                        </button>
                    </div>
                    <div className="alert-box-body">
                        <AnimatedHackingContent content={hw.content} />
                    </div>
                    <div className="alert-box-footer">
                        <div className="alert-progress-bar">
                            <div className="alert-progress-fill"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}