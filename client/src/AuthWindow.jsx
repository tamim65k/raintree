import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function AuthWindow({ onSuccess, onClose }) {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Login: Fetch all users and find by password client-side
            const { data: allUsers, error: fetchError } = await supabase
                .from('users')
                .select('*')

            if (fetchError) throw fetchError

            // Find user by password
            const user = allUsers?.find(u => u.password === password)
            if (!user) {
                setError('Invalid password. Please contact administrator for access.')
                setLoading(false)
                return
            }

            // Store user session
            localStorage.setItem('user_id', user.id)
            localStorage.setItem('user_password', password)
            onSuccess(user)
        } catch (err) {
            // Provide a clearer hint when Supabase reports an invalid API key
            let message = err.message || 'An error occurred'
            if (err && err.message && err.message.toLowerCase().includes('invalid api key')) {
                message = `${message}. Please verify your VITE_SUPABASE_ANON_KEY in client/.env is the public anon key from your Supabase project and restart the dev server.`
            }

            setError(message)
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
                <div className="auth-field">
                    <label className="yellow">PASSWORD:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        placeholder="Enter your password"
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
                            <span className="yellow">AUTHENTICATING...</span>
                        ) : (
                            <span className="green">LOGIN</span>
                        )}
                    </button>
                    <button type="button" className="auth-btn secondary" onClick={onClose} disabled={loading}>
                        <span className="red">CANCEL</span>
                    </button>
                </div>

                <div className="auth-info">
                    <span className="cyan">
                        {'> Contact administrator for access credentials'}
                    </span>
                </div>
            </form>
        </div>
    )
}
