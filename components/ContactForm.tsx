'use client'

import { useState } from 'react'
import { useToast } from './Toast'
import { supabase } from '@/lib/supabaseClient'

export default function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
    const { showToast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')

        try {
            const { name, email, message } = form

            if (!name || !email || !message) {
                showToast('error', 'Gagal', 'Semua field wajib diisi.')
                setStatus('idle')
                return
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                showToast('error', 'Gagal', 'Format email tidak valid.')
                setStatus('idle')
                return
            }

            // Langsung ke Supabase (kompatibel dengan static hosting)
            const { error } = await supabase
                .from('messages')
                .insert([{ name, email, message }])

            if (error) throw error

            setStatus('success')
            setForm({ name: '', email: '', message: '' })
            showToast('success', 'Message Sent! 🎉', 'Thank you! I will reply within 1–2 business days.')

            setTimeout(() => setStatus('idle'), 3000)

        } catch (err: unknown) {
            setStatus('idle')
            const msg = err instanceof Error ? err.message : 'An error occurred. Please try again.'
            showToast('error', 'Failed to Send', msg)
        }
    }

    const isLoading = status === 'loading'
    const isSuccess = status === 'success'

    return (
        <form className="contact-form" onSubmit={handleSubmit} id="contactForm">
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    required
                    value={form.name}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                    id="message"
                    placeholder="Tell me about your project or idea..."
                    required
                    value={form.message}
                    onChange={handleChange}
                    disabled={isLoading}
                ></textarea>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                id="submitBtn"
                disabled={isLoading || isSuccess}
                style={{ alignSelf: 'flex-start' }}
            >
                {isLoading ? (
                    <>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                        </svg>
                        Sending...
                    </>
                ) : isSuccess ? (
                    <>✅ Sent!</>
                ) : (
                    <>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                        Send Message
                    </>
                )}
            </button>
        </form>
    )
}