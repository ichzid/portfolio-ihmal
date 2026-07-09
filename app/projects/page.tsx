'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import type { Project } from '@/lib/project-types'

import BackButton from '@/components/BackButton'
import SiteLoader from '@/components/SiteLoader'

const ITEMS_PER_PAGE = 9

type ViewMode = 'grid' | 'list'

export default function ProjectsPage() {
    const [allProjects, setAllProjects] = useState<Project[]>([])
    const [activeFilter, setActiveFilter] = useState('All')
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<ViewMode>('grid')

    useEffect(() => {
        async function loadProjects() {
            setLoading(true)
            try {
                const res = await fetch('/api/projects', { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to fetch')
                const { projects } = await res.json()
                setAllProjects(projects || [])
            } catch (err) {
                console.error('Load projects error:', err)
                setAllProjects([])
            } finally {
                setLoading(false)
            }
        }
        loadProjects()
    }, [])

    const categories = ['All', ...Array.from(new Set(allProjects.map(p => p.category)))]

    const filtered = activeFilter === 'All'
        ? allProjects
        : allProjects.filter(p => p.category === activeFilter)

    const visibleProjects = filtered.slice(0, visibleCount)
    const remainingCount = filtered.length - visibleCount

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE)
    }, [activeFilter])

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filtered.length))
    }

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

                {/* ── FILTER + VIEW TOGGLE ── */}
                <div className="filter-toolbar">
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

                    <div className="view-toggle" role="tablist" aria-label="Toggle view mode">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={viewMode === 'grid'}
                            aria-label="Grid view"
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={viewMode === 'list'}
                            aria-label="List view"
                            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="8" y1="6" x2="21" y2="6" />
                                <line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" />
                                <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                                <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                                <circle cx="4" cy="18" r="1.5" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── PROJECTS ── */}
                {loading ? (
                    <SiteLoader fullscreen label="Loading" />
                ) : viewMode === 'grid' ? (
                    <div key="view-grid" className="projects-grid view-anim">
                        {visibleProjects.map(project => (
                            <div key={project.id} className="project-grid-card">
                                <div className="project-grid-visual">
                                    {project.imageUrls?.[0] ? (
                                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={project.imageUrls[0]}
                                                alt={project.title}
                                                loading="lazy"
                                                decoding="async"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
                ) : (
                    <div key="view-list" className="projects-listview view-anim">
                        {visibleProjects.map(project => (
                            <div key={project.id} className="project-listrow">
                                <div className="project-listrow-visual">
                                    {project.imageUrls?.[0] ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={project.imageUrls[0]}
                                                alt={project.title}
                                                loading="lazy"
                                                decoding="async"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                        </>
                                    ) : (
                                        <div className="project-listrow-mockup">No Image Available</div>
                                    )}
                                </div>
                                <div className="project-listrow-content">
                                    <div className="project-listrow-meta">
                                        <span className="project-listrow-cat">{project.category}</span>
                                        {project.year && <span className="project-listrow-year">{project.year}</span>}
                                        {project.status && (
                                            <span className={`project-listrow-status ${project.status === 'Live' ? 'live' : project.status === 'In Progress' ? 'progress' : ''}`}>
                                                {project.status}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="project-listrow-title">{project.title}</h3>
                                    <p className="project-listrow-desc">{project.description}</p>

                                    <div className="project-listrow-tech">
                                        {project.techStack.map(t => (
                                            <span key={t} className="tech-badge-sm">{t}</span>
                                        ))}
                                    </div>

                                    <div className="project-listrow-actions">
                                        <Link href={`/projects/${project.slug}`} className="btn btn-primary btn-sm">
                                            View Details
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                        {project.demoUrl && (
                                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {!loading && visibleCount < filtered.length && (
                    <div className="load-more-wrap">
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="btn btn-ghost load-more-btn"
                        >
                            Load More
                            <span className="load-more-count">
                                +{Math.min(ITEMS_PER_PAGE, remainingCount)} of {remainingCount}
                            </span>
                        </button>
                    </div>
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
                .load-more-wrap {
                    display: flex;
                    justify-content: center;
                    margin: 48px 0 20px;
                }
                .load-more-btn {
                    padding: 14px 32px;
                    font-size: 0.9rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                }
                .load-more-count {
                    font-size: 0.75rem;
                    opacity: 0.7;
                    padding: 3px 10px;
                    border-radius: 40px;
                    background: rgba(240, 165, 0, 0.12);
                    color: var(--accent);
                    font-weight: 600;
                }

                /* ── View transition animation ── */
                .view-anim {
                    animation: viewFade 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                .view-anim > :global(.project-grid-card),
                .view-anim > :global(.project-listrow) {
                    animation: itemRise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                .view-anim > :global(.project-grid-card:nth-child(1)),
                .view-anim > :global(.project-listrow:nth-child(1)) { animation-delay: 0.05s; }
                .view-anim > :global(.project-grid-card:nth-child(2)),
                .view-anim > :global(.project-listrow:nth-child(2)) { animation-delay: 0.10s; }
                .view-anim > :global(.project-grid-card:nth-child(3)),
                .view-anim > :global(.project-listrow:nth-child(3)) { animation-delay: 0.15s; }
                .view-anim > :global(.project-grid-card:nth-child(4)),
                .view-anim > :global(.project-listrow:nth-child(4)) { animation-delay: 0.20s; }
                .view-anim > :global(.project-grid-card:nth-child(5)),
                .view-anim > :global(.project-listrow:nth-child(5)) { animation-delay: 0.25s; }
                .view-anim > :global(.project-grid-card:nth-child(6)),
                .view-anim > :global(.project-listrow:nth-child(6)) { animation-delay: 0.30s; }
                .view-anim > :global(.project-grid-card:nth-child(n+7)),
                .view-anim > :global(.project-listrow:nth-child(n+7)) { animation-delay: 0.35s; }

                @keyframes viewFade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes itemRise {
                    from {
                        opacity: 0;
                        transform: translateY(14px) scale(0.98);
                        filter: blur(4px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        filter: blur(0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .view-anim,
                    .view-anim > :global(.project-grid-card),
                    .view-anim > :global(.project-listrow) {
                        animation: none !important;
                    }
                }
            `}</style>
        </>
    )
}
