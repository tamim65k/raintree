import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function FileManager({ user }) {
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [editingMeta, setEditingMeta] = useState(null)
    const [metaName, setMetaName] = useState('')

    const BUCKET_NAME = 'user-files'
    const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB in bytes

    useEffect(() => {
        loadFiles()
    }, [user])

    const loadFiles = async () => {
        try {
            setLoading(true)
            const userFolder = `${user.id}/`
            
            const { data, error: listError } = await supabase
                .storage
                .from(BUCKET_NAME)
                .list(userFolder, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' }
                })

            if (listError) throw listError

            setFiles(data || [])
        } catch (err) {
            setError('Failed to load files: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            setError('File size exceeds 1GB limit')
            return
        }

        try {
            setUploading(true)
            setError('')
            setUploadProgress(0)

            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}_${file.name}`
            const filePath = `${user.id}/${fileName}`

            const { data, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    onUploadProgress: (progress) => {
                        const percent = (progress.loaded / progress.total) * 100
                        setUploadProgress(Math.round(percent))
                    }
                })

            if (uploadError) throw uploadError

            await loadFiles()
            e.target.value = '' // Reset input
        } catch (err) {
            setError('Upload failed: ' + err.message)
        } finally {
            setUploading(false)
            setUploadProgress(0)
        }
    }

    const handleDelete = async (fileName) => {
        if (!confirm(`Delete ${fileName}?`)) return

        try {
            const filePath = `${user.id}/${fileName}`
            
            const { error: deleteError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([filePath])

            if (deleteError) throw deleteError

            await loadFiles()
            setSelectedFile(null)
        } catch (err) {
            setError('Delete failed: ' + err.message)
        }
    }

    const handleDownload = async (fileName) => {
        try {
            const filePath = `${user.id}/${fileName}`
            
            const { data, error: downloadError } = await supabase.storage
                .from(BUCKET_NAME)
                .download(filePath)

            if (downloadError) throw downloadError

            // Create download link
            const url = URL.createObjectURL(data)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            setError('Download failed: ' + err.message)
        }
    }

    const handleUpdateMetadata = async () => {
        if (!editingMeta || !metaName.trim()) return

        try {
            const oldPath = `${user.id}/${editingMeta}`
            const fileExt = editingMeta.split('.').pop()
            const newFileName = `${metaName.trim()}.${fileExt}`
            const newPath = `${user.id}/${newFileName}`

            // Supabase doesn't support rename, so we need to copy and delete
            const { data: fileData, error: downloadError } = await supabase.storage
                .from(BUCKET_NAME)
                .download(oldPath)

            if (downloadError) throw downloadError

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(newPath, fileData, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { error: deleteError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([oldPath])

            if (deleteError) throw deleteError

            await loadFiles()
            setEditingMeta(null)
            setMetaName('')
        } catch (err) {
            setError('Update failed: ' + err.message)
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const getFileNameWithoutTimestamp = (fileName) => {
        // Remove timestamp prefix (13 digits + underscore)
        return fileName.replace(/^\d{13}_/, '')
    }

    if (loading) {
        return (
            <div className="file-manager-loading">
                <span className="yellow">LOADING FILES...</span>
            </div>
        )
    }

    return (
        <div className="file-manager">
            <div className="file-manager-header">
                <span className="green">┌─[FILE STORAGE]─[{user.password}]</span>
                <br />
                <span className="green">└──╼ $ </span>
                <span className="cyan">ls -la</span>
            </div>

            {error && (
                <div className="file-error">
                    <span className="red">ERROR: {error}</span>
                    <button onClick={() => setError('')} className="error-close">✕</button>
                </div>
            )}

            <div className="file-upload-section">
                <label className="file-upload-btn">
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                    <span className="green">{uploading ? 'UPLOADING...' : '[+ UPLOAD FILE]'}</span>
                </label>
                <span className="file-limit cyan">Max: 1GB per file</span>
            </div>

            {uploading && (
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <span className="progress-text yellow">{uploadProgress}%</span>
                </div>
            )}

            <div className="files-list">
                {files.length === 0 ? (
                    <div className="empty-state">
                        <span className="yellow">NO FILES UPLOADED YET</span>
                    </div>
                ) : (
                    files.map((file) => (
                        <div 
                            key={file.name} 
                            className={`file-item ${selectedFile === file.name ? 'selected' : ''}`}
                            onClick={() => setSelectedFile(file.name)}
                        >
                            <div className="file-info">
                                {editingMeta === file.name ? (
                                    <div className="file-edit-meta">
                                        <input
                                            type="text"
                                            value={metaName}
                                            onChange={(e) => setMetaName(e.target.value)}
                                            className="meta-input"
                                            placeholder="New file name"
                                            autoFocus
                                        />
                                        <button onClick={handleUpdateMetadata} className="meta-save">
                                            <span className="green">SAVE</span>
                                        </button>
                                        <button onClick={() => { setEditingMeta(null); setMetaName('') }} className="meta-cancel">
                                            <span className="red">CANCEL</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="file-name green">{getFileNameWithoutTimestamp(file.name)}</span>
                                        <span className="file-size cyan">{formatFileSize(file.metadata?.size || 0)}</span>
                                        <span className="file-date yellow">
                                            {new Date(file.created_at).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                            {selectedFile === file.name && !editingMeta && (
                                <div className="file-actions">
                                    <button onClick={() => handleDownload(file.name)} className="file-btn">
                                        <span className="cyan">DOWNLOAD</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setEditingMeta(file.name)
                                            setMetaName(getFileNameWithoutTimestamp(file.name).replace(/\.[^/.]+$/, ''))
                                        }} 
                                        className="file-btn"
                                    >
                                        <span className="yellow">RENAME</span>
                                    </button>
                                    <button onClick={() => handleDelete(file.name)} className="file-btn">
                                        <span className="red">DELETE</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="file-stats">
                <span className="cyan">Total Files: {files.length}</span>
                <span className="cyan"> | </span>
                <span className="cyan">
                    Total Size: {formatFileSize(files.reduce((sum, f) => sum + (f.metadata?.size || 0), 0))}
                </span>
            </div>
        </div>
    )
}
