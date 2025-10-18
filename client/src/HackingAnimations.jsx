import React, { memo, useMemo, useState, useEffect } from 'react'

/**
 * HACKING ANIMATIONS LIBRARY
 * 
 * This file contains all the cyberpunk/hacking themed background animations
 * used throughout the application. Each animation is memoized for performance.
 * 
 * Available Animations:
 * - MatrixRain: Falling Matrix-style characters
 * - ScanLines: Horizontal scanning lines effect
 * - CodeStream: Scrolling code/terminal text
 * - HexGrid: Animated hexagonal grid pattern
 * - BinaryStream: Vertical streams of binary digits
 * - CircuitBoard: Circuit board line patterns
 * - DataPackets: Moving data packet elements
 * - GlitchEffect: Random glitch distortion effect
 * - NetworkNodes: Interconnected network nodes
 * - TerminalCursor: Blinking terminal cursor
 */

// ============================================================================
// MATRIX RAIN ANIMATION
// ============================================================================
/**
 * Matrix Rain Animation
 * Creates falling columns of random characters similar to The Matrix
 * Each column has randomized speed and delay for natural effect
 */
export const MatrixRain = memo(() => {
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

// ============================================================================
// SCAN LINES ANIMATION
// ============================================================================
/**
 * Scanning Lines Animation
 * Creates horizontal scan lines that move across the screen
 * Simulates CRT monitor or scanning effect
 */
export const ScanLines = memo(() => (
    <div className="scan-lines-container">
        <div className="scan-line scan-line-1"></div>
        <div className="scan-line scan-line-2"></div>
        <div className="scan-line scan-line-3"></div>
    </div>
))

// ============================================================================
// CODE STREAM ANIMATION
// ============================================================================
/**
 * Code Stream Animation
 * Displays scrolling terminal-style code messages
 * Each line appears with a staggered delay
 */
export const CodeStream = memo(() => {
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

// ============================================================================
// HEXAGONAL GRID ANIMATION
// ============================================================================
/**
 * Hexagonal Grid Background
 * Creates floating hexagons with pulse animations
 * Positions and timing are randomized for organic feel
 */
export const HexGrid = memo(() => {
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

// ============================================================================
// BINARY STREAM ANIMATION
// ============================================================================
/**
 * Binary Stream Animation
 * Creates vertical columns of binary digits (0s and 1s)
 * Each stream scrolls at different speeds
 */
export const BinaryStream = memo(() => {
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

// ============================================================================
// CIRCUIT BOARD PATTERN
// ============================================================================
/**
 * Circuit Board Pattern
 * Creates animated circuit board lines (horizontal and vertical)
 * Simulates electronic circuit pathways
 */
export const CircuitBoard = memo(() => {
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

// ============================================================================
// DATA PACKETS ANIMATION
// ============================================================================
/**
 * Data Packets Animation
 * Creates moving data packet elements across the screen
 * Each packet travels from random start to end position
 */
export const DataPackets = memo(() => {
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

// ============================================================================
// GLITCH EFFECT ANIMATION (NEW)
// ============================================================================
/**
 * Glitch Effect Animation
 * Creates random glitch distortions across the screen
 * Simulates digital interference or data corruption
 */
export const GlitchEffect = memo(() => {
    const glitches = useMemo(() => {
        return Array(5).fill('').map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            height: `${2 + Math.random() * 5}px`,
            delay: `${Math.random() * 3}s`,
            duration: `${0.5 + Math.random() * 1}s`
        }))
    }, [])

    return (
        <div className="glitch-effect">
            {glitches.map(glitch => (
                <div 
                    key={glitch.id} 
                    className="glitch-line"
                    style={{
                        top: glitch.top,
                        height: glitch.height,
                        animationDelay: glitch.delay,
                        animationDuration: glitch.duration
                    }}
                />
            ))}
        </div>
    )
})

// ============================================================================
// NETWORK NODES ANIMATION (NEW)
// ============================================================================
/**
 * Network Nodes Animation
 * Creates interconnected nodes with pulsing connections
 * Simulates network topology visualization
 */
export const NetworkNodes = memo(() => {
    const nodes = useMemo(() => {
        return Array(10).fill('').map((_, i) => ({
            id: i,
            x: `${10 + Math.random() * 80}%`,
            y: `${10 + Math.random() * 80}%`,
            size: `${4 + Math.random() * 8}px`,
            delay: `${Math.random() * 5}s`
        }))
    }, [])

    return (
        <div className="network-nodes">
            {nodes.map(node => (
                <div 
                    key={node.id} 
                    className="network-node"
                    style={{
                        left: node.x,
                        top: node.y,
                        width: node.size,
                        height: node.size,
                        animationDelay: node.delay
                    }}
                />
            ))}
        </div>
    )
})

// ============================================================================
// TERMINAL CURSOR ANIMATION (NEW)
// ============================================================================
/**
 * Terminal Cursor Animation
 * Creates a blinking cursor effect for terminal-style text
 */
export const TerminalCursor = memo(() => (
    <span className="cursor-blink">_</span>
))

// ============================================================================
// ANIMATED HACKING CONTENT
// ============================================================================
/**
 * Animated Hacking Content Component
 * Types out text character by character with typewriter effect
 * Used for displaying hacking messages with animation
 * 
 * @param {string} content - The text content to animate
 */
export const AnimatedHackingContent = memo(({ content }) => {
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
        <pre className="alert-content-text">{displayedText}<TerminalCursor /></pre>
    )
})

// ============================================================================
// LOGO WINDOW WITH ANIMATION
// ============================================================================
/**
 * Logo Window Component
 * Displays the RainTree logo with binary rain animation
 * Includes user system button
 * 
 * @param {Function} onUserSystemClick - Callback when user system button is clicked
 */
export const LogoWindow = memo(({ onUserSystemClick }) => {
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

// ============================================================================
// WEBSITE THEMES
// ============================================================================
/**
 * Theme configurations for entire website design and colors
 * Each theme changes colors, fonts, and overall aesthetic
 */
export const WEBSITE_THEMES = {
    matrix: {
        name: 'Classic Matrix',
        description: 'Original green matrix aesthetic',
        colors: {
            primary: '#00ff00',      // Main green
            secondary: '#00cc00',    // Darker green
            accent: '#00ff99',       // Bright cyan-green
            background: '#000000',   // Pure black
            surface: '#001a00',      // Very dark green
            text: '#00ff00',         // Green text
            textSecondary: '#00cc00',
            error: '#ff0000',
            warning: '#ffff00',
            success: '#00ff00',
            border: '#00ff00'
        },
        fonts: {
            primary: "'Courier New', monospace",
            secondary: "'Consolas', monospace"
        }
    },
    cyberpunk: {
        name: 'Cyberpunk Neon',
        description: 'Vibrant neon colors and effects',
        colors: {
            primary: '#ff00ff',      // Magenta
            secondary: '#00ffff',    // Cyan
            accent: '#ffff00',       // Yellow
            background: '#0a0a0a',   // Near black
            surface: '#1a0a1a',      // Dark purple
            text: '#ff00ff',         // Magenta text
            textSecondary: '#00ffff',
            error: '#ff0066',
            warning: '#ffff00',
            success: '#00ff99',
            border: '#ff00ff'
        },
        fonts: {
            primary: "'Orbitron', sans-serif",
            secondary: "'Rajdhani', sans-serif"
        }
    },
    terminal: {
        name: 'Terminal Green',
        description: 'Classic terminal phosphor green',
        colors: {
            primary: '#33ff33',      // Phosphor green
            secondary: '#00cc00',    // Dark green
            accent: '#66ff66',       // Light green
            background: '#0c0c0c',   // Terminal black
            surface: '#1a1a1a',      // Dark gray
            text: '#33ff33',         // Green text
            textSecondary: '#66ff66',
            error: '#ff3333',
            warning: '#ffff33',
            success: '#33ff33',
            border: '#33ff33'
        },
        fonts: {
            primary: "'IBM Plex Mono', monospace",
            secondary: "'Source Code Pro', monospace"
        }
    },
    ocean: {
        name: 'Deep Ocean',
        description: 'Cool blue underwater theme',
        colors: {
            primary: '#00ccff',      // Bright cyan
            secondary: '#0099cc',    // Medium blue
            accent: '#00ffff',       // Cyan
            background: '#001a1a',   // Deep blue-black
            surface: '#002633',      // Dark blue
            text: '#00ccff',         // Cyan text
            textSecondary: '#66d9ff',
            error: '#ff6666',
            warning: '#ffcc00',
            success: '#00ff99',
            border: '#00ccff'
        },
        fonts: {
            primary: "'Roboto Mono', monospace",
            secondary: "'Fira Code', monospace"
        }
    },
    sunset: {
        name: 'Sunset Hacker',
        description: 'Warm orange and red tones',
        colors: {
            primary: '#ff6600',      // Orange
            secondary: '#ff3300',    // Red-orange
            accent: '#ffcc00',       // Yellow
            background: '#1a0a00',   // Dark brown-black
            surface: '#331a00',      // Dark orange
            text: '#ff6600',         // Orange text
            textSecondary: '#ffaa00',
            error: '#ff0000',
            warning: '#ffcc00',
            success: '#00ff00',
            border: '#ff6600'
        },
        fonts: {
            primary: "'JetBrains Mono', monospace",
            secondary: "'Ubuntu Mono', monospace"
        }
    },
    purple: {
        name: 'Purple Haze',
        description: 'Deep purple and violet theme',
        colors: {
            primary: '#9933ff',      // Purple
            secondary: '#6600cc',    // Dark purple
            accent: '#cc66ff',       // Light purple
            background: '#0a000a',   // Very dark purple
            surface: '#1a001a',      // Dark purple
            text: '#9933ff',         // Purple text
            textSecondary: '#cc66ff',
            error: '#ff3366',
            warning: '#ffcc00',
            success: '#00ff99',
            border: '#9933ff'
        },
        fonts: {
            primary: "'Space Mono', monospace",
            secondary: "'Anonymous Pro', monospace"
        }
    }
}

// ============================================================================
// ANIMATION REGISTRY
// ============================================================================
/**
 * Registry of all available animations
 * Used for individual toggles
 */
export const ANIMATION_REGISTRY = {
    MatrixRain: { component: MatrixRain, name: 'Matrix Rain', category: 'Classic' },
    ScanLines: { component: ScanLines, name: 'Scan Lines', category: 'Classic' },
    CodeStream: { component: CodeStream, name: 'Code Stream', category: 'Classic' },
    HexGrid: { component: HexGrid, name: 'Hex Grid', category: 'Classic' },
    BinaryStream: { component: BinaryStream, name: 'Binary Stream', category: 'Classic' },
    CircuitBoard: { component: CircuitBoard, name: 'Circuit Board', category: 'Classic' },
    DataPackets: { component: DataPackets, name: 'Data Packets', category: 'Classic' },
    GlitchEffect: { component: GlitchEffect, name: 'Glitch Effect', category: 'Effects' },
    NetworkNodes: { component: NetworkNodes, name: 'Network Nodes', category: 'Network' }
}

// ============================================================================
// ANIMATION CONTAINER COMPONENT
// ============================================================================
/**
 * Animation Container Component
 * Wraps all animations and provides toggle functionality
 * 
 * @param {boolean} enabled - Whether animations are enabled
 * @param {Object} activeAnimations - Object with animation names as keys and boolean values
 */
export const AnimationContainer = memo(({ enabled, activeAnimations = {} }) => {
    if (!enabled) return null
    
    // Get animations to render based on individual toggles
    const animationsToRender = Object.keys(activeAnimations).filter(key => activeAnimations[key])
    
    // If no specific animations selected, show all
    const shouldRenderAll = animationsToRender.length === 0
    
    return (
        <>
            {Object.entries(ANIMATION_REGISTRY).map(([key, { component: Component }]) => {
                const shouldRender = shouldRenderAll || animationsToRender.includes(key)
                return shouldRender ? <Component key={key} /> : null
            })}
        </>
    )
})
