import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function AuthWindow({ onSuccess, onClose }) {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [mode, setMode] = useState('login') // 'login' or 'signup'

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (mode === 'signup') {
                // Check if password exists in DB
                const { data: existingUser, error: checkError } = await supabase
                    .from('users')
                    .select('id, password')
                    .eq('password', password)
                    .single()

                if (existingUser) {
                    setError('This password already exists. Please choose a different password.')
                    setLoading(false)
                    return
                }

                // Create new user
                const { data, error } = await supabase
                    .from('users')
                    .insert([{ password, created_at: new Date().toISOString() }])
                    .select()
                    .single()

                if (error) throw error

                // Store user session
                localStorage.setItem('user_id', data.id)
                localStorage.setItem('user_password', password)
                onSuccess(data)
            } else {
                // Login: Find user by password
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('password', password)
                    .single()

                if (error || !data) {
                    setError('Invalid password. Please try again.')
                    setLoading(false)
                    return
                }

                // Store user session
                localStorage.setItem('user_id', data.id)
                localStorage.setItem('user_password', password)
                onSuccess(data)
            }
        } catch (err) {
            setError(err.message || 'An error occurred')
        }
        
        setLoading(false)
    }

    return (
        <div className="auth-container">
            <div className="auth-header">
                <span className="green">┌─[SECURE LOGIN]─[RAINTREE.WIKI]</span>
                <br />
                <span className="green">└──╼ $ </span>
                <span className="yellow">authenticate</span>
            </div>

            <form onSubmit={handleAuth} className="auth-form">
                <div className="auth-mode-selector">
                    <button
                        type="button"
                        className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => setMode('login')}
                    >
                        <span className="cyan">[LOGIN]</span>
                    </button>
                    <button
                        type="button"
                        className={`mode-btn ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => setMode('signup')}
                    >
                        <span className="cyan">[SIGNUP]</span>
                    </button>
                </div>

                <div className="auth-field">
                    <label className="yellow">PASSWORD:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        placeholder="Enter your unique password"
                        required
                        autoFocus
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="auth-error">
                        <span className="red">ERROR: {error}</span>
                    </div>
                )}

                <div className="auth-actions">
                    <button type="submit" className="auth-btn primary" disabled={loading}>
                        {loading ? (
                            <span className="yellow">PROCESSING...</span>
                        ) : (
                            <span className="green">{mode === 'login' ? 'LOGIN' : 'SIGNUP'}</span>
                        )}
                    </button>
                    <button type="button" className="auth-btn secondary" onClick={onClose} disabled={loading}>
                        <span className="red">CANCEL</span>
                    </button>
                </div>

                <div className="auth-info">
                    <span className="cyan">
                        {mode === 'login' 
                            ? '> New user? Switch to SIGNUP to create an account'
                            : '> Existing user? Switch to LOGIN to access your dashboard'
                        }
                    </span>
                </div>
            </form>
        </div>
    )
}
