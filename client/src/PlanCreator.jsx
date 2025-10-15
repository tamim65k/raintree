import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function PlanCreator({ user, onClose, onCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'daily habit',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        target_value: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const planTypes = [
        'daily habit',
        'project',
        'study plan',
        'fitness goal',
        'reading challenge',
        'skill development',
        'other'
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase
                .from('plans')
                .insert([{
                    user_id: user.id,
                    name: formData.name,
                    description: formData.description,
                    type: formData.type,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                    target_value: formData.target_value,
                    progress: 0,
                    created_at: new Date().toISOString(),
                    last_updated: new Date().toISOString()
                }])
                .select()

            if (error) throw error

            onCreated()
        } catch (err) {
            setError(err.message || 'Failed to create plan')
        }

        setLoading(false)
    }

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
    }

    return (
        <div className="plan-creator">
            <div className="creator-header">
                <span className="green">┌─[PLAN CREATOR]─[NEW MISSION]</span>
                <br />
                <span className="green">└──╼ $ </span>
                <span className="yellow">initialize</span>
            </div>

            <form onSubmit={handleSubmit} className="creator-form">
                <div className="form-field">
                    <label className="yellow">PLAN NAME:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="form-input"
                        placeholder="e.g., Learn Python Programming"
                        required
                    />
                </div>

                <div className="form-field">
                    <label className="yellow">DESCRIPTION / GOAL:</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="form-textarea"
                        placeholder="Describe your goal and what you want to achieve..."
                        rows="3"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label className="yellow">TYPE:</label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            className="form-select"
                            required
                        >
                            {planTypes.map(type => (
                                <option key={type} value={type}>{type.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="yellow">TARGET VALUE (Optional):</label>
                        <input
                            type="text"
                            value={formData.target_value}
                            onChange={(e) => handleChange('target_value', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 50 hours, 10 chapters"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label className="yellow">START DATE:</label>
                        <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => handleChange('start_date', e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label className="yellow">END DATE:</label>
                        <input
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => handleChange('end_date', e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="form-error">
                        <span className="red">ERROR: {error}</span>
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="action-btn primary" disabled={loading}>
                        {loading ? (
                            <span className="yellow">CREATING...</span>
                        ) : (
                            <span className="green">[CREATE PLAN]</span>
                        )}
                    </button>
                    <button type="button" className="action-btn secondary" onClick={onClose} disabled={loading}>
                        <span className="red">[CANCEL]</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
