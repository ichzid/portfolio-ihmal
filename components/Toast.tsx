'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

type ToastType = 'success' | 'error'

interface ToastData {
    id: number
    type: ToastType
    title: string
    message: string
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message: string) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => { } })

export function useToast() {
    return useContext(ToastContext)
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: number) => void }) {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), 4500)
        return () => clearTimeout(timer)
    }, [toast.id, onRemove])

    const isSuccess = toast.type === 'success'

    return (
        <div className={`toast-item toast-${toast.type}`} onClick={() => onRemove(toast.id)}>
            <div className="toast-icon">
                {isSuccess ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                )}
            </div>
            <div className="toast-body">
                <div className="toast-title">{toast.title}</div>
                <div className="toast-msg">{toast.message}</div>
            </div>
            <div className="toast-progress">
                <div className={`toast-progress-bar toast-progress-${toast.type}`}></div>
            </div>
        </div>
    )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([])

    const showToast = useCallback((type: ToastType, title: string, message: string) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, type, title, message }])
    }, [])

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container" aria-live="polite">
                {toasts.map(t => (
                    <ToastItem key={t.id} toast={t} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}
