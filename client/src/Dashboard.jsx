import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Dashboard({ user, onLogout }) {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeView, setActiveView] = useState('dashboard')
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [editingPlan, setEditingPlan] = useState(null)
    const [draggedTask, setDraggedTask] = useState(null)
    const [showPlanForm, setShowPlanForm] = useState(false)
    const [stats, setStats] = useState({
        totalPlans: 0,
        activePlans: 0,
        completedPlans: 0,
        totalProgress: 0,
        streak: 0,
        weeklyCompletion: 0,
        dailyCompletion: 0,
        timeSpent: 0,
        priorityBreakdown: { high: 0, medium: 0, low: 0 }
    })
    
    // Generate hacker name from user ID
    const getHackerName = (userId) => {
        const prefixes = ['SHADOW', 'GHOST', 'PHANTOM', 'CYBER', 'DARK', 'NEO', 'ZERO', 'ALPHA', 'OMEGA', 'VIPER']
        const suffixes = ['HAWK', 'WOLF', 'DRAGON', 'BLADE', 'STORM', 'REAPER', 'HUNTER', 'KNIGHT', 'NINJA', 'ROGUE']
        const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const prefix = prefixes[hash % prefixes.length]
        const suffix = suffixes[(hash * 7) % suffixes.length]
        const number = (hash % 900) + 100
        return `${prefix}_${suffix}${number}`
    }
    
    const hackerName = getHackerName(user.id)

    useEffect(() => {
        loadPlans()
        const interval = setInterval(loadPlans, 5000) // Realtime updates every 5s
        return () => clearInterval(interval)
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
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

        const activePlans = plansData.filter(p => {
            const endDate = new Date(p.end_date)
            return endDate >= now && (p.progress || 0) < 100
        })

        const completedPlans = plansData.filter(p => (p.progress || 0) >= 100)
        const totalProgress = plansData.reduce((sum, p) => sum + (p.progress || 0), 0) / (plansData.length || 1)

        // Calculate completion rates
        const dailyCompleted = plansData.filter(p => {
            const updated = new Date(p.last_updated || p.created_at)
            return updated >= today && (p.progress || 0) >= 100
        }).length

        const weeklyCompleted = plansData.filter(p => {
            const updated = new Date(p.last_updated || p.created_at)
            return updated >= weekAgo && (p.progress || 0) >= 100
        }).length

        // Priority breakdown
        const priorityBreakdown = {
            high: plansData.filter(p => p.priority === 'high').length,
            medium: plansData.filter(p => p.priority === 'medium').length,
            low: plansData.filter(p => p.priority === 'low').length
        }

        // Calculate streak
        const streak = calculateStreak(plansData)

        // Calculate time spent (from plan data)
        const timeSpent = plansData.reduce((sum, p) => sum + (p.time_spent || 0), 0)

        setStats({
            totalPlans: plansData.length,
            activePlans: activePlans.length,
            completedPlans: completedPlans.length,
            totalProgress: Math.round(totalProgress),
            streak,
            weeklyCompletion: Math.round((weeklyCompleted / (plansData.length || 1)) * 100),
            dailyCompletion: Math.round((dailyCompleted / (plansData.length || 1)) * 100),
            timeSpent,
            priorityBreakdown
        })
    }

    const calculateStreak = (plansData) => {
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

    const createPlan = async (planData) => {
        try {
            const { data, error } = await supabase
                .from('plans')
                .insert([{
                    user_id: user.id,
                    name: planData.name,
                    description: planData.description || '',
                    category: planData.category || 'Personal',
                    priority: planData.priority || 'medium',
                    tags: planData.tags || [],
                    start_date: planData.start_date,
                    end_date: planData.end_date,
                    progress: 0,
                    tasks: [],
                    notes: planData.notes || '',
                    time_spent: 0,
                    recurrence: planData.recurrence || 'none'
                }])
                .select()

            if (error) {
                console.error('Supabase error:', error)
                alert('Error creating plan: ' + error.message)
                return
            }
            await loadPlans()
            setShowPlanForm(false)
            setEditingPlan(null)
        } catch (err) {
            console.error('Error creating plan:', err)
            alert('Failed to create plan. Please try again.')
        }
    }

    const updatePlan = async (planId, updates) => {
        try {
            const { error } = await supabase
                .from('plans')
                .update({ ...updates, last_updated: new Date().toISOString() })
                .eq('id', planId)

            if (error) throw error
            loadPlans()
            if (selectedPlan && selectedPlan.id === planId) {
                setSelectedPlan({ ...selectedPlan, ...updates })
            }
        } catch (err) {
            console.error('Error updating plan:', err)
        }
    }

    const deletePlan = async (planId) => {
        if (!confirm('Are you sure you want to delete this plan?')) return

        try {
            const { error } = await supabase
                .from('plans')
                .delete()
                .eq('id', planId)

            if (error) throw error
            loadPlans()
            if (selectedPlan && selectedPlan.id === planId) {
                setSelectedPlan(null)
                setActiveView('dashboard')
            }
        } catch (err) {
            console.error('Error deleting plan:', err)
        }
    }

    const duplicatePlan = async (plan) => {
        const newPlan = {
            ...plan,
            name: `${plan.name} (Copy)`,
            progress: 0,
            tasks: (plan.tasks || []).map(t => ({ ...t, completed: false }))
        }
        delete newPlan.id
        delete newPlan.created_at
        delete newPlan.last_updated
        await createPlan(newPlan)
    }

    const addTask = async (planId, taskData) => {
        const plan = plans.find(p => p.id === planId)
        if (!plan) return

        const newTask = {
            id: Date.now(),
            title: taskData.title,
            completed: false,
            order: (plan.tasks || []).length,
            created_at: new Date().toISOString()
        }

        const updatedTasks = [...(plan.tasks || []), newTask]
        await updatePlan(planId, { tasks: updatedTasks })
    }

    const updateTask = async (planId, taskId, updates) => {
        const plan = plans.find(p => p.id === planId)
        if (!plan) return

        const updatedTasks = (plan.tasks || []).map(t =>
            t.id === taskId ? { ...t, ...updates } : t
        )

        const completedCount = updatedTasks.filter(t => t.completed).length
        const progress = Math.round((completedCount / updatedTasks.length) * 100)

        await updatePlan(planId, { tasks: updatedTasks, progress })
    }

    const deleteTask = async (planId, taskId) => {
        const plan = plans.find(p => p.id === planId)
        if (!plan) return

        const updatedTasks = (plan.tasks || []).filter(t => t.id !== taskId)
        const completedCount = updatedTasks.filter(t => t.completed).length
        const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0

        await updatePlan(planId, { tasks: updatedTasks, progress })
    }

    const reorderTasks = async (planId, startIndex, endIndex) => {
        const plan = plans.find(p => p.id === planId)
        if (!plan) return

        const tasks = [...(plan.tasks || [])]
        const [removed] = tasks.splice(startIndex, 1)
        tasks.splice(endIndex, 0, removed)

        const reorderedTasks = tasks.map((t, idx) => ({ ...t, order: idx }))
        await updatePlan(planId, { tasks: reorderedTasks })
    }

    if (loading) {
        return (
            <div className="dashboard-new">
                <div className="dashboard-loading">
                    <div className="loading-spinner-dash"></div>
                    <span className="yellow">⚡ LOADING DASHBOARD...</span>
                </div>
            </div>
        )
    }

    if (activeView === 'plan-detail' && selectedPlan) {
        return <PlanDetailView
            plan={selectedPlan}
            onBack={() => { setActiveView('dashboard'); setSelectedPlan(null) }}
            onUpdate={updatePlan}
            onDelete={deletePlan}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onReorderTasks={reorderTasks}
            draggedTask={draggedTask}
            setDraggedTask={setDraggedTask}
        />
    }

    if (showPlanForm) {
        return <PlanForm
            onSave={editingPlan ? (planData) => {
                updatePlan(editingPlan.id, planData)
                setShowPlanForm(false)
                setEditingPlan(null)
            } : createPlan}
            onCancel={() => { setShowPlanForm(false); setEditingPlan(null) }}
            editingPlan={editingPlan}
        />
    }

    return (
        <div className="dashboard-new">
            <div className="dashboard-header">
                <span className="green">┌─[DASHBOARD]─[{hackerName}]</span>
                <button className="logout-btn" onClick={onLogout}>
                    <span className="red">[LOGOUT]</span>
                </button>
            </div>

            <div className="stats-grid-new">
                <StatCard label="Total Plans" value={stats.totalPlans} color="green" />
                <StatCard label="Active" value={stats.activePlans} color="cyan" />
                <StatCard label="Completed" value={stats.completedPlans} color="yellow" />
                <StatCard label="Avg Progress" value={`${stats.totalProgress}%`} color="green" />
                <StatCard label="Streak" value={`${stats.streak} days`} color="cyan" />
                <StatCard label="Weekly %" value={`${stats.weeklyCompletion}%`} color="yellow" />
                <StatCard label="Daily %" value={`${stats.dailyCompletion}%`} color="green" />
                <StatCard label="Time Spent" value={`${Math.round(stats.timeSpent / 60)}h`} color="cyan" />
            </div>

            <div className="priority-breakdown">
                <span className="section-title cyan">PRIORITY BREAKDOWN</span>
                <div className="priority-bars">
                    <div className="priority-item">
                        <span className="red">HIGH: {stats.priorityBreakdown.high}</span>
                        <div className="priority-bar">
                            <div className="priority-fill red-bg" style={{ width: `${(stats.priorityBreakdown.high / (stats.totalPlans || 1)) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="priority-item">
                        <span className="yellow">MEDIUM: {stats.priorityBreakdown.medium}</span>
                        <div className="priority-bar">
                            <div className="priority-fill yellow-bg" style={{ width: `${(stats.priorityBreakdown.medium / (stats.totalPlans || 1)) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="priority-item">
                        <span className="green">LOW: {stats.priorityBreakdown.low}</span>
                        <div className="priority-bar">
                            <div className="priority-fill green-bg" style={{ width: `${(stats.priorityBreakdown.low / (stats.totalPlans || 1)) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-actions-new">
                <button className="action-btn-new primary" onClick={() => setShowPlanForm(true)}>
                    <span className="green">+ CREATE PLAN</span>
                </button>
            </div>

            <div className="plans-section-new">
                <span className="section-title cyan">YOUR PLANS</span>
                {plans.length === 0 ? (
                    <div className="empty-state">
                        <span className="yellow">NO PLANS YET. CREATE YOUR FIRST PLAN!</span>
                    </div>
                ) : (
                    <div className="plans-grid">
                        {plans.map(plan => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                onClick={() => { setSelectedPlan(plan); setActiveView('plan-detail') }}
                                onEdit={() => { setEditingPlan(plan); setShowPlanForm(true) }}
                                onDuplicate={() => duplicatePlan(plan)}
                                onDelete={() => deletePlan(plan.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ label, value, color }) {
    return (
        <div className="stat-card-new">
            <div className="stat-label-new"><span className="yellow">{label}</span></div>
            <div className="stat-value-new"><span className={color}>{value}</span></div>
        </div>
    )
}

function PlanCard({ plan, onClick, onEdit, onDuplicate, onDelete }) {
    const priorityColors = { high: 'red', medium: 'yellow', low: 'green' }
    const color = priorityColors[plan.priority] || 'cyan'

    return (
        <div className="plan-card-new" onClick={onClick}>
            <div className="plan-card-header-new">
                <span className={`plan-name-new ${color}`}>{plan.name}</span>
                <span className="plan-priority cyan">[{plan.priority?.toUpperCase()}]</span>
            </div>
            <div className="plan-category yellow">{plan.category}</div>
            {plan.description && <div className="plan-desc">{plan.description}</div>}
            <div className="plan-progress-new">
                <div className="progress-bar-new">
                    <div className="progress-fill-new" style={{ width: `${plan.progress || 0}%` }}></div>
                </div>
                <span className="progress-text-new green">{plan.progress || 0}%</span>
            </div>
            <div className="plan-tasks-count cyan">
                {(plan.tasks || []).filter(t => t.completed).length} / {(plan.tasks || []).length} tasks
            </div>
            {plan.tags && plan.tags.length > 0 && (
                <div className="plan-tags">
                    {plan.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="tag-chip cyan">#{tag}</span>
                    ))}
                </div>
            )}
            <div className="plan-actions-new" onClick={e => e.stopPropagation()}>
                <button className="plan-action-btn" onClick={onEdit} title="Edit">
                    <span className="yellow">✏️</span>
                </button>
                <button className="plan-action-btn" onClick={onDuplicate} title="Duplicate">
                    <span className="cyan">📋</span>
                </button>
                <button className="plan-action-btn" onClick={onDelete} title="Delete">
                    <span className="red">🗑️</span>
                </button>
            </div>
        </div>
    )
}

function PlanForm({ onSave, onCancel, editingPlan }) {
    const [formData, setFormData] = useState(editingPlan ? {
        name: editingPlan.name || '',
        description: editingPlan.description || '',
        category: editingPlan.category || 'Personal',
        priority: editingPlan.priority || 'medium',
        tags: Array.isArray(editingPlan.tags) ? editingPlan.tags.join(', ') : '',
        start_date: editingPlan.start_date || new Date().toISOString().split('T')[0],
        end_date: editingPlan.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        recurrence: editingPlan.recurrence || 'none',
        notes: editingPlan.notes || ''
    } : {
        name: '',
        description: '',
        category: 'Personal',
        priority: 'medium',
        tags: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        recurrence: 'none',
        notes: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const planData = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        }
        onSave(planData)
    }

    return (
        <div className="plan-form">
            <div className="form-header">
                <span className="green">{editingPlan ? 'EDIT PLAN' : 'CREATE NEW PLAN'}</span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="yellow">Plan Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="yellow">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="form-textarea"
                        rows="3"
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="yellow">Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="form-select"
                        >
                            <option value="Personal">Personal</option>
                            <option value="Work">Work</option>
                            <option value="Study">Study</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="yellow">Priority</label>
                        <select
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                            className="form-select"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label className="yellow">Tags (comma separated)</label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        className="form-input"
                        placeholder="work, urgent, project"
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="yellow">Start Date</label>
                        <input
                            type="date"
                            value={formData.start_date}
                            onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="yellow">End Date</label>
                        <input
                            type="date"
                            value={formData.end_date}
                            onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="yellow">Recurrence</label>
                    <select
                        value={formData.recurrence}
                        onChange={e => setFormData({ ...formData, recurrence: e.target.value })}
                        className="form-select"
                    >
                        <option value="none">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="yellow">Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="form-textarea"
                        rows="4"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="form-btn primary">
                        <span className="green">{editingPlan ? 'UPDATE' : 'CREATE'}</span>
                    </button>
                    <button type="button" className="form-btn secondary" onClick={onCancel}>
                        <span className="red">CANCEL</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

function PlanDetailView({ plan, onBack, onUpdate, onDelete, onAddTask, onUpdateTask, onDeleteTask, onReorderTasks, draggedTask, setDraggedTask }) {
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [showTimer, setShowTimer] = useState(false)
    const [timerSeconds, setTimerSeconds] = useState(0)
    const [timerRunning, setTimerRunning] = useState(false)

    useEffect(() => {
        let interval
        if (timerRunning) {
            interval = setInterval(() => {
                setTimerSeconds(s => s + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timerRunning])

    const handleAddTask = (e) => {
        e.preventDefault()
        if (newTaskTitle.trim()) {
            onAddTask(plan.id, { title: newTaskTitle })
            setNewTaskTitle('')
        }
    }

    const handleDragStart = (e, taskIndex) => {
        setDraggedTask(taskIndex)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e, dropIndex) => {
        e.preventDefault()
        if (draggedTask !== null && draggedTask !== dropIndex) {
            onReorderTasks(plan.id, draggedTask, dropIndex)
        }
        setDraggedTask(null)
    }

    const saveTimer = () => {
        const currentTime = plan.time_spent || 0
        onUpdate(plan.id, { time_spent: currentTime + timerSeconds })
        setTimerSeconds(0)
        setTimerRunning(false)
        setShowTimer(false)
    }

    const tasks = plan.tasks || []
    const completedTasks = tasks.filter(t => t.completed).length

    return (
        <div className="plan-detail-view">
            <div className="detail-header">
                <button className="back-btn" onClick={onBack}>
                    <span className="cyan">← BACK</span>
                </button>
                <span className="green">{plan.name}</span>
                <button className="delete-btn" onClick={() => onDelete(plan.id)}>
                    <span className="red">DELETE</span>
                </button>
            </div>

            <div className="detail-info">
                <div className="info-row">
                    <span className="yellow">Category:</span>
                    <span className="cyan">{plan.category}</span>
                </div>
                <div className="info-row">
                    <span className="yellow">Priority:</span>
                    <span className={plan.priority === 'high' ? 'red' : plan.priority === 'medium' ? 'yellow' : 'green'}>
                        {plan.priority?.toUpperCase()}
                    </span>
                </div>
                <div className="info-row">
                    <span className="yellow">Progress:</span>
                    <span className="green">{plan.progress || 0}%</span>
                </div>
                <div className="info-row">
                    <span className="yellow">Tasks:</span>
                    <span className="cyan">{completedTasks} / {tasks.length}</span>
                </div>
                {plan.description && (
                    <div className="info-row">
                        <span className="yellow">Description:</span>
                        <span className="white">{plan.description}</span>
                    </div>
                )}
            </div>

            <div className="timer-section">
                {!showTimer ? (
                    <button className="timer-btn" onClick={() => setShowTimer(true)}>
                        <span className="cyan">⏱️ START TIMER</span>
                    </button>
                ) : (
                    <div className="timer-active">
                        <span className="green">{Math.floor(timerSeconds / 3600)}h {Math.floor((timerSeconds % 3600) / 60)}m {timerSeconds % 60}s</span>
                        <button className="timer-control" onClick={() => setTimerRunning(!timerRunning)}>
                            <span className="yellow">{timerRunning ? '⏸️ PAUSE' : '▶️ START'}</span>
                        </button>
                        <button className="timer-control" onClick={saveTimer}>
                            <span className="green">💾 SAVE</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="tasks-section">
                <div className="tasks-header">
                    <span className="cyan">TASKS</span>
                </div>
                <form onSubmit={handleAddTask} className="add-task-form">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        placeholder="Add new task..."
                        className="task-input"
                    />
                    <button type="submit" className="add-task-btn">
                        <span className="green">+ ADD</span>
                    </button>
                </form>

                <div className="tasks-list">
                    {tasks.map((task, index) => (
                        <div
                            key={task.id}
                            className={`task-item ${task.completed ? 'completed' : ''} ${draggedTask === index ? 'dragging' : ''}`}
                            draggable
                            onDragStart={e => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={e => handleDrop(e, index)}
                        >
                            <span className="drag-handle">⋮⋮</span>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={e => onUpdateTask(plan.id, task.id, { completed: e.target.checked })}
                                className="task-checkbox"
                            />
                            <span className={`task-title ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                            </span>
                            <button
                                className="task-delete"
                                onClick={() => onDeleteTask(plan.id, task.id)}
                            >
                                <span className="red">✕</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {plan.notes && (
                <div className="notes-section">
                    <span className="section-title cyan">NOTES</span>
                    <div className="notes-content white">{plan.notes}</div>
                </div>
            )}
        </div>
    )
}
