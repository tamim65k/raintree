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

export default function App() {
    const [wins, setWins] = useState([1, 2, 3, 4, 5, 6].map(id => ({ id, visible: true })))
    const [focused, setFocused] = useState(4)

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

    const data = [
        { id: 1, title: '1st', x: 40, y: 20, w: 320, h: 380, 
          lines: ['$ nmap -sV 192.168.1.0/24', 'Scanning network...', 'Host 192.168.1.1 is up', 'Port 80: HTTP service detected'] },
        { id: 2, title: '2nd', x: 370, y: 20, w: 300, h: 200, 
          lines: ['<span class="green">Hacker Tache Macker</span>', '', 'Initializing exploit framework...', 'Loading modules: 247', 'System ready'] },
        { id: 3, title: '3rd', x: 690, y: 20, w: 280, h: 200, 
          lines: ['<span class="green">TERMINAL</span>', '', '<span class="green">Interface: eth0</span>', '<span class="green">IP Address: 251.0.113.7</span>', '<span class="green">Netmask: 255.0.113.0</span>', '<span class="green">Subnetmask: 255.0.113.0</span>', '<span class="green">Gateway: 203.0.1</span>', '<span class="green">Status: CONNECTED</span>'] },
        { id: 5, title: '4nd', x: 370, y: 240, w: 300, h: 280, 
          lines: ['<span class="green">System Monitor</span>', '', 'CPU Usage: 47%', 'Memory: 2.1GB / 8GB', 'Network: ↓ 1.2MB/s ↑ 450KB/s', 'Processes: 127', 'Uptime: 3 days 14 hours'] },
        { id: 6, title: '4th', x: 370, y: 540, w: 300, h: 220, 
          lines: ['<span class="green">Hacker Tache Macker</span>', '', '$ python exploit.py', 'Loading payload...', '>> File: project.db'] }
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
                        {w.id === 4 ? (
                            <div className="raintree-content">
                                <div className="tree-logo">
                                    <svg viewBox="0 0 200 200" width="110" height="110">
                                        <circle cx="100" cy="100" r="95" fill="none" stroke="#00ff99" strokeWidth="2"/>
                                        <rect x="92" y="130" width="16" height="40" fill="#00ff99"/>
                                        <path d="M 85 170 Q 70 175 60 180 M 115 170 Q 130 175 140 180 M 100 170 L 100 180" stroke="#00ff99" strokeWidth="2" fill="none"/>
                                        <ellipse cx="100" cy="90" rx="50" ry="35" fill="#00ff99"/>
                                        <ellipse cx="75" cy="100" rx="35" ry="30" fill="#00ff99"/>
                                        <ellipse cx="125" cy="100" rx="35" ry="30" fill="#00ff99"/>
                                        <ellipse cx="100" cy="70" rx="30" ry="25" fill="#00ff99"/>
                                        <circle cx="80" cy="95" r="3" fill="#050d0d"/>
                                        <circle cx="120" cy="95" r="3" fill="#050d0d"/>
                                        <circle cx="100" cy="85" r="3" fill="#050d0d"/>
                                    </svg>
                                </div>
                                <div className="raintree-title">raintree.wiki</div>
                            </div>
                        ) : (
                            cfg.lines && cfg.lines.map((line, i) => <TerminalLine key={i} text={line} />)
                        )}
                    </Window>
                )
            })}
        </div>
    )
}