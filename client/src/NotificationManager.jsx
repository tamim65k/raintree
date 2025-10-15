import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function NotificationManager({ user }) {
    const [notifications, setNotifications] = useState([])
    const [settings, setSettings] = useState({
        dailyReminders: true,
        weeklyReport: true,
        monthlyReport: true
    })

    useEffect(() => {
        checkForNotifications()
        const interval = setInterval(checkForNotifications, 60000) // Check every minute
        return () => clearInterval(interval)
    }, [user])

    const checkForNotifications = async () => {
        try {
            // Get user's plans
            const { data: plans, error } = await supabase
                .from('plans')
                .select('*')
                .eq('user_id', user.id)

            if (error) throw error

            const now = new Date()
            const today = now.toISOString().split('T')[0]
            const newNotifications = []

            // Check for plans without updates today
            for (const plan of plans) {
                const endDate = new Date(plan.end_date)
                
                // Skip completed or expired plans
                if (plan.progress >= 100 || endDate < now) continue

                // Check if updated today
                const lastUpdate = plan.last_updated ? plan.last_updated.split('T')[0] : null
                
                if (lastUpdate !== today && settings.dailyReminders) {
                    newNotifications.push({
                        id: `daily-${plan.id}`,
                        type: 'reminder',
                        planId: plan.id,
                        planName: plan.name,
                        message: `You haven't updated "${plan.name}" today!`,
                        timestamp: now.toISOString()
                    })
                }

                // Check if plan is ending soon (within 3 days)
                const daysUntilEnd = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
                if (daysUntilEnd <= 3 && daysUntilEnd > 0) {
                    newNotifications.push({
                        id: `ending-${plan.id}`,
                        type: 'warning',
                        planId: plan.id,
                        planName: plan.name,
                        message: `"${plan.name}" ends in ${daysUntilEnd} days!`,
                        timestamp: now.toISOString()
                    })
                }
            }

            setNotifications(newNotifications)
        } catch (err) {
            console.error('Error checking notifications:', err)
        }
    }

    const dismissNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const toggleSetting = (setting) => {
        setSettings({ ...settings, [setting]: !settings[setting] })
    }

    return (
        <div className="notification-manager">
            <div className="notification-header">
                <span className="green">┌─[NOTIFICATION CENTER]</span>
                <br />
                <span className="green">└──╼ $ </span>
                <span className="yellow">status</span>
            </div>

            <div className="notification-settings">
                <div className="section-header">
                    <span className="cyan">═══ SETTINGS ═══</span>
                </div>
                <div className="settings-list">
                    <label className="setting-item">
                        <input
                            type="checkbox"
                            checked={settings.dailyReminders}
                            onChange={() => toggleSetting('dailyReminders')}
                            className="setting-checkbox"
                        />
                        <span className="yellow">Daily Reminders</span>
                    </label>
                    <label className="setting-item">
                        <input
                            type="checkbox"
                            checked={settings.weeklyReport}
                            onChange={() => toggleSetting('weeklyReport')}
                            className="setting-checkbox"
                        />
                        <span className="yellow">Weekly Progress Report</span>
                    </label>
                    <label className="setting-item">
                        <input
                            type="checkbox"
                            checked={settings.monthlyReport}
                            onChange={() => toggleSetting('monthlyReport')}
                            className="setting-checkbox"
                        />
                        <span className="yellow">Monthly Progress Summary</span>
                    </label>
                </div>
            </div>

            <div className="notifications-list">
                <div className="section-header">
                    <span className="cyan">═══ ACTIVE NOTIFICATIONS ({notifications.length}) ═══</span>
                </div>
                
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <span className="green">ALL CAUGHT UP! NO PENDING NOTIFICATIONS.</span>
                    </div>
                ) : (
                    <div className="notification-items">
                        {notifications.map(notif => (
                            <div key={notif.id} className={`notification-item ${notif.type}`}>
                                <div className="notification-content">
                                    <span className={notif.type === 'warning' ? 'yellow' : 'cyan'}>
                                        [{notif.type.toUpperCase()}]
                                    </span>
                                    <span className="green">{notif.message}</span>
                                </div>
                                <button 
                                    className="dismiss-btn"
                                    onClick={() => dismissNotification(notif.id)}
                                >
                                    <span className="red">✕</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="notification-info">
                <div className="section-header">
                    <span className="cyan">═══ INFO ═══</span>
                </div>
                <div className="info-text">
                    <span className="yellow">
                        • Notifications are checked every minute
                        <br />
                        • Daily reminders appear if you haven't updated a plan today
                        <br />
                        • Warnings appear when plans are ending soon
                        <br />
                        • Email notifications can be configured via Supabase triggers
                    </span>
                </div>
            </div>
        </div>
    )
}
