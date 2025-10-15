import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import PlanCreator from './PlanCreator'
import PlanTracker from './PlanTracker'
import NotificationManager from './NotificationManager'

export default function Dashboard({ user, onLogout }) {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreator, setShowCreator] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const [stats, setStats] = useState({ totalPlans: 0, activePlans: 0, totalProgress: 0, streak: 0 })

    useEffect(() => {
        loadPlans()
    }, [user])

    const loadPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            setPlans(data || [])
            calculateStats(data || [])
        } catch (err) {
            console.error('Error loading plans:', err)
        }
        setLoading(false)
    }

    const calculateStats = (plansData) => {
        const now = new Date()
        const activePlans = plansData.filter(p => {
            const endDate = new Date(p.end_date)
            return endDate >= now
        })

        const totalProgress = plansData.reduce((sum, p) => sum + (p.progress || 0), 0) / (plansData.length || 1)
        
        // Calculate streak (consecutive days with updates)
        const streak = calculateStreak(plansData)

        setStats({
            totalPlans: plansData.length,
            activePlans: activePlans.length,
            totalProgress: Math.round(totalProgress),
            streak
        })
    }

    const calculateStreak = (plansData) => {
        // Simple streak calculation - days with at least one progress update
        const today = new Date()
        let streak = 0
        
        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today)
            checkDate.setDate(checkDate.getDate() - i)
            const dateStr = checkDate.toISOString().split('T')[0]
            
            const hasUpdate = plansData.some(plan => {
                return plan.last_updated && plan.last_updated.startsWith(dateStr)
            })
            
            if (hasUpdate) {
                streak++
            } else if (i > 0) {
                break
            }
        }
        
        return streak
    }

    const handlePlanCreated = () => {
        setShowCreator(false)
        loadPlans()
    }

    const handlePlanUpdated = () => {
        loadPlans()
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                <span className="yellow">LOADING DASHBOARD...</span>
            </div>
        )
    }

    if (showCreator) {
        return (
            <PlanCreator 
                user={user} 
                onClose={() => setShowCreator(false)}
                onCreated={handlePlanCreated}
            />
        )
    }

    if (selectedPlan) {
        return (
            <PlanTracker
                user={user}
                plan={selectedPlan}
                onClose={() => setSelectedPlan(null)}
                onUpdated={handlePlanUpdated}
            />
        )
    }

    if (showNotifications) {
        return (
            <div className="dashboard">
                <NotificationManager user={user} />
                <div className="dashboard-actions">
                    <button className="action-btn secondary" onClick={() => setShowNotifications(false)}>
                        <span className="yellow">[BACK TO DASHBOARD]</span>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <span className="green">┌─[USER DASHBOARD]─[{user.password}]</span>
                <br />
                <span className="green">└──╼ $ </span>
                <span className="cyan">status</span>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label"><span className="yellow">TOTAL PLANS</span></div>
                    <div className="stat-value"><span className="green">{stats.totalPlans}</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-label"><span className="yellow">ACTIVE PLANS</span></div>
                    <div className="stat-value"><span className="green">{stats.activePlans}</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-label"><span className="yellow">AVG PROGRESS</span></div>
                    <div className="stat-value"><span className="green">{stats.totalProgress}%</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-label"><span className="yellow">STREAK</span></div>
                    <div className="stat-value"><span className="green">{stats.streak} days</span></div>
                </div>
            </div>

            <div className="dashboard-actions">
                <button className="action-btn primary" onClick={() => setShowCreator(true)}>
                    <span className="green">[+ CREATE NEW PLAN]</span>
                </button>
                <button className="action-btn primary" onClick={() => setShowNotifications(true)}>
                    <span className="cyan">[📬 NOTIFICATIONS]</span>
                </button>
                <button className="action-btn secondary" onClick={onLogout}>
                    <span className="red">[LOGOUT]</span>
                </button>
            </div>

            <div className="plans-section">
                <div className="section-header">
                    <span className="cyan">═══ YOUR PLANS ═══</span>
                </div>
                
                {plans.length === 0 ? (
                    <div className="empty-state">
                        <span className="yellow">NO PLANS YET. CREATE YOUR FIRST PLAN TO GET STARTED!</span>
                    </div>
                ) : (
                    <div className="plans-list">
                        {plans.map(plan => (
                            <div key={plan.id} className="plan-card" onClick={() => setSelectedPlan(plan)}>
                                <div className="plan-card-header">
                                    <span className="plan-name green">{plan.name}</span>
                                    <span className="plan-type cyan">[{plan.type}]</span>
                                </div>
                                <div className="plan-description yellow">{plan.description}</div>
                                <div className="plan-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${plan.progress || 0}%` }}></div>
                                    </div>
                                    <span className="progress-text green">{plan.progress || 0}%</span>
                                </div>
                                <div className="plan-dates">
                                    <span className="cyan">
                                        {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
