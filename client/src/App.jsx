import React, { useEffect, useState, useRef } from 'react'

function Terminal({ lines }) {
    const ref = useRef()
    useEffect(() => { if (ref.current) { ref.current.scrollTop = ref.current.scrollHeight; } }, [lines])
    return (
        <div className="terminal" ref={ref}>
            {lines.map((l, i) => (
                <div key={i} className="line" dangerouslySetInnerHTML={{ __html: l }} />
            ))}
        </div>
    )
}

export default function App() {
    const [lines, setLines] = useState([`<span class='hacker-glow'>[boot] Initializing network scanner...</span>`])
    const [input, setInput] = useState('')
    const inputRef = useRef(null)

    useEffect(() => {
        // On mount, detect public IP and run lookup (use dev-server proxy/middleware)
        fetch('/api/ipinfo')
            .then(r => r.json())
            .then(async (j) => {
                if (j.error) { setLines(prev => prev.concat(`<span class='red hacker-glow'>[error] ${j.error}</span>`)); return }
                const ip = j.ip || (j.info && j.info.query) || null
                if (!ip) { setLines(prev => prev.concat(`<span class='red hacker-glow'>[error] Could not determine public IP.</span>`)); return }
                setLines(prev => prev.concat(`<span class='hacker-glow'>[info] Public IP: <span class='green'>${ip}</span></span>`))
                runLookup(ip)
            })
            .catch(e => setLines(prev => prev.concat(`<span class='red hacker-glow'>[error] ${e.message}</span>`)))
    }, [])

    function appendInfo(j) {
        if (!j) return
        if (j.info && typeof j.info === 'object') {
            const infoLines = Object.entries(j.info).map(([k, v]) => `<span class='hacker-glow'>${k}: <span class='green'>${v}</span></span>`)
            setLines(prev => prev.concat(infoLines))
        } else {
            setLines(prev => prev.concat(`<span class='red hacker-glow'>[error] No data returned</span>`))
        }
    }

    function runLookup(ip) {
        fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ip }) })
            .then(r => r.json())
            .then(j => appendInfo(j))
            .catch(e => setLines(prev => prev.concat(`<span class='red hacker-glow'>[error] ${e.message}</span>`)))
    }

    function onInputKeyDown(e) {
        if (e.key === 'Enter') {
            const ip = input.trim()
            if (!ip) return
            setLines(prev => prev.concat(`<span class='kali-prompt'><span class='kali-user'>kali</span><span class='kali-at'>@</span><span class='kali-root'>root</span><span class='kali-path'>:~$</span></span> <span class='hacker-glow'>${ip}</span>`))
            setInput('')
            runLookup(ip)
        }
    }

    useEffect(() => { if (inputRef.current) inputRef.current.focus() }, [])

    return (
        <div className="hacker-bg">
            <div className="hacker-overlay" />
            <img src="/raintree.png" alt="logo" className="logo" />
            <div className="hacker-container">
                <Terminal lines={lines} />
                <div className="terminal-input-row">
                    <span className="kali-prompt">
                        <span className="kali-user">kali</span>
                        <span className="kali-at">@</span>
                        <span className="kali-root">root</span>
                        <span className="kali-path">:~$</span>
                    </span>
                    <input
                        className="terminal-input hacker-glow"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={onInputKeyDown}
                        ref={inputRef}
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                        placeholder="Enter IP address and press Enter"
                    />
                </div>
            </div>
        </div>
    )
}
