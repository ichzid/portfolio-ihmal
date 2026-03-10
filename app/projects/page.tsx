'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getProjects, Project } from '@/lib/projects'
import Image from 'next/image'

import BackButton from '@/components/BackButton'

const ITEMS_PER_PAGE = 6

export default function ProjectsPage() {
    const [allProjects, setAllProjects] = useState<Project[]>([])
    const [activeFilter, setActiveFilter] = useState('All')
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
    const [loading, setLoading] = useState(true)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function loadProjects() {
            setLoading(true)
            const data = await getProjects()
            setAllProjects(data)
            setLoading(false)
        }
        loadProjects()
    }, [])

    const categories = ['All', ...Array.from(new Set(allProjects.map(p => p.category)))]

    const filtered = activeFilter === 'All'
        ? allProjects
        : allProjects.filter(p => p.category === activeFilter)

    const visibleProjects = filtered.slice(0, visibleCount)

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE)
    }, [activeFilter])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filtered.length))
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        )

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => observer.disconnect()
    }, [activeFilter, filtered.length])

    return (
        <>
            <Navbar />

            {/* ── PAGE HERO ── */}
            <div className="container">
                <div style={{ paddingTop: '160px', paddingBottom: '80px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <BackButton href="/">Back to Home</BackButton>
                    </div>
                    <h1 className="section-title">All Projects</h1>
                    <p className="page-subtitle">
                        A curated collection of my work, ranging from complex enterprise applications to experimental open-source tools.
                    </p>
                </div>

                {/* ── FILTER ── */}
                <div className="filter-bar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── GRID ── */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--accent)' }}>
                        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                        </svg>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {visibleProjects.map(project => (
                            <div key={project.id} className="project-grid-card">
                                <div className="project-grid-visual">
                                    {project.imageUrl ? (
                                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                            <Image
                                                src={project.imageUrl}
                                                alt={project.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="project-grid-mockup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, var(--surface) 0%, var(--border) 100%)', color: 'var(--text-muted)' }}>
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                                <div className="project-grid-content">
                                    <div className="project-grid-header">
                                        <h3 className="project-grid-title">{project.title}</h3>
                                    </div>
                                    <p className="project-grid-desc">{project.description}</p>

                                    <div className="tech-stack-row">
                                        {project.techStack.slice(0, 3).map(t => (
                                            <span key={t} className="tech-badge-sm">{t}</span>
                                        ))}
                                        {project.techStack.length > 3 && (
                                            <span className="tech-badge-sm">+{project.techStack.length - 3}</span>
                                        )}
                                    </div>

                                    <div className="project-grid-footer">
                                        <Link href={`/projects/${project.slug}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Trigger */}
                {visibleCount < filtered.length && (
                    <div ref={loadMoreRef} style={{ height: '20px', margin: '20px 0' }}></div>
                )}

                {/* CTA Footer */}
                <div className="projects-footer-cta">
                    <h3>Have a project in mind?</h3>
                    <p>Let's discuss how we can work together to build something great.</p>
                    <div className="cta-btn-row">
                        <Link href="/#contact" className="btn btn-primary">Start a Project</Link>
                        <a href="mailto:ichmal.alazid@gmail.com" className="btn btn-outline">Email Me</a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tech-stack-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: auto;
                }
                .tech-badge-sm {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    background: rgba(255, 255, 255, 0.05);
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                
                .projects-footer-cta {
                    margin-top: 100px;
                    margin-bottom: 60px;
                    padding: 60px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    text-align: center;
                }
                .projects-footer-cta h3 {
                    font-size: 2rem;
                    margin-bottom: 16px;
                }
                .projects-footer-cta p {
                    color: var(--text-muted);
                    margin-bottom: 32px;
                    font-size: 1.1rem;
                }
                .cta-btn-row {
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                }
            `}</style>
        </>
    )
}
