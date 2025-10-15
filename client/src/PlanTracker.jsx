import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PlanTracker({ user, plan, onClose, onUpdated }) {
    const [progress, setProgress] = useState([])
    const [newProgress, setNewProgress] = useState('')
    const [loading, setLoading] = useState(false)
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        loadProgress()
    }, [plan])

    const loadProgress = async () => {
        try {
            const { data, error } = await supabase
                .from('progress')
                .select('*')
                .eq('plan_id', plan.id)
                .order('created_at', { ascending: true })

            if (error) throw error

            setProgress(data || [])
            prepareChartData(data || [])
        } catch (err) {
            console.error('Error loading progress:', err)
        }
    }

    const prepareChartData = (progressData) => {
        // Group by date and sum progress
        const grouped = {}
        progressData.forEach(p => {
            const date = new Date(p.created_at).toLocaleDateString()
            if (!grouped[date]) {
                grouped[date] = { date, value: 0, count: 0 }
            }
            grouped[date].value += parseFloat(p.value) || 1
            grouped[date].count++
        })

        const data = Object.values(grouped).map((item, index) => ({
            date: item.date,
            progress: item.value,
            index: index + 1
        }))

        setChartData(data)
    }

    const handleAddProgress = async (e) => {
        e.preventDefault()
        if (!newProgress.trim()) return

        setLoading(true)

        try {
            // Add progress entry
            const { error: progressError } = await supabase
                .from('progress')
                .insert([{
                    plan_id: plan.id,
                    user_id: user.id,
                    description: newProgress,
                    value: 1, // Default value, can be customized
                    created_at: new Date().toISOString()
                }])

            if (progressError) throw progressError

            // Update plan progress
            const newProgressPercentage = Math.min(100, (plan.progress || 0) + 5)
            const { error: updateError } = await supabase
                .from('plans')
                .update({ 
                    progress: newProgressPercentage,
                    last_updated: new Date().toISOString()
                })
                .eq('id', plan.id)

            if (updateError) throw updateError

            setNewProgress('')
            loadProgress()
            onUpdated()
        } catch (err) {
            console.error('Error adding progress:', err)
        }

        setLoading(false)
    }

    const handleMarkComplete = async () => {
        setLoading(true)

        try {
            const { error } = await supabase
                .from('plans')
                .update({ 
                    progress: 100,
                    last_updated: new Date().toISOString()
                })
                .eq('id', plan.id)

            if (error) throw error

            onUpdated()
            onClose()
        } catch (err) {
            console.error('Error marking complete:', err)
        }

        setLoading(false)
    }

    return (
        <div className="plan-tracker">
            <div className="tracker-header">
                <span className="green">┌─[PLAN TRACKER]─[{plan.name}]</span>
                <br />
                <span className="green">└──╼ $ </span>
                <span className="yellow">monitor</span>
            </div>

            <div className="plan-info">
                <div className="info-row">
                    <span className="yellow">TYPE:</span>
                    <span className="cyan">{plan.type}</span>
                </div>
                <div className="info-row">
                    <span className="yellow">DESCRIPTION:</span>
                    <span className="green">{plan.description}</span>
                </div>
                <div className="info-row">
                    <span className="yellow">DURATION:</span>
                    <span className="cyan">
                        {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                    </span>
                </div>
                {plan.target_value && (
                    <div className="info-row">
                        <span className="yellow">TARGET:</span>
                        <span className="green">{plan.target_value}</span>
                    </div>
                )}
            </div>

            <div className="progress-overview">
                <span className="yellow">CURRENT PROGRESS:</span>
                <div className="progress-bar large">
                    <div className="progress-fill" style={{ width: `${plan.progress || 0}%` }}></div>
                </div>
                <span className="progress-text green">{plan.progress || 0}%</span>
            </div>

            {chartData.length > 0 && (
                <div className="chart-section">
                    <div className="section-header">
                        <span className="cyan">═══ PROGRESS GRAPH ═══</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 153, 0.2)" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#00ff99"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                                stroke="#00ff99"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(0, 20, 20, 0.95)',
                                    border: '1px solid #00ff99',
                                    color: '#00ff99'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="progress" 
                                stroke="#00ff99" 
                                strokeWidth={2}
                                dot={{ fill: '#00ff99', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="add-progress-section">
                <div className="section-header">
                    <span className="cyan">═══ ADD DAILY PROGRESS ═══</span>
                </div>
                <form onSubmit={handleAddProgress} className="progress-form">
                    <textarea
                        value={newProgress}
                        onChange={(e) => setNewProgress(e.target.value)}
                        className="progress-input"
                        placeholder="What did you accomplish today? (e.g., Studied 2 hours, Completed chapter 3)"
                        rows="2"
                        disabled={loading}
                    />
                    <button type="submit" className="action-btn primary" disabled={loading || !newProgress.trim()}>
                        <span className="green">[ADD PROGRESS]</span>
                    </button>
                </form>
            </div>

            <div className="progress-history">
                <div className="section-header">
                    <span className="cyan">═══ HISTORY ═══</span>
                </div>
                {progress.length === 0 ? (
                    <div className="empty-state">
                        <span className="yellow">NO PROGRESS ENTRIES YET. ADD YOUR FIRST ENTRY ABOVE!</span>
                    </div>
                ) : (
                    <div className="progress-list">
                        {progress.slice().reverse().map((entry, index) => (
                            <div key={entry.id} className="progress-entry">
                                <div className="entry-date cyan">
                                    [{new Date(entry.created_at).toLocaleDateString()} {new Date(entry.created_at).toLocaleTimeString()}]
                                </div>
                                <div className="entry-description green">{entry.description}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="tracker-actions">
                <button className="action-btn primary" onClick={handleMarkComplete} disabled={loading}>
                    <span className="green">[MARK AS COMPLETE]</span>
                </button>
                <button className="action-btn secondary" onClick={onClose} disabled={loading}>
                    <span className="yellow">[BACK TO DASHBOARD]</span>
                </button>
            </div>
        </div>
    )
}
