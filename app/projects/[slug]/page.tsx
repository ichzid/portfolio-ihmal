import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjects } from '@/lib/projects'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'

// Wajib untuk static export: pre-render semua slug saat build
export async function generateStaticParams() {
    const projects = await getProjects()
    return projects.map((p) => ({ slug: p.slug }))
}


export default async function ProjectDetail(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params
    const project = await getProjectBySlug(slug)

    if (!project) {
        notFound()
    }

    const isLive = project.status === 'Live'
    const isInProgress = project.status === 'In Progress'

    const statusColor = isLive
        ? 'var(--green)'
        : isInProgress
            ? '#facc15'
            : 'var(--text-muted)'

    const statusBg = isLive
        ? 'rgba(74,222,128,0.1)'
        : isInProgress
            ? 'rgba(250,204,21,0.1)'
            : 'var(--surface2)'

    const statusBorder = isLive
        ? 'rgba(74,222,128,0.25)'
        : isInProgress
            ? 'rgba(250,204,21,0.25)'
            : 'var(--border)'

    return (
        <>
            <Navbar />

            {/* ── HERO PROJECT ── */}
            <section className="project-hero">
                <div className="project-hero-inner">
                    <div style={{ marginBottom: '40px' }}>
                        <BackButton />
                    </div>

                    {/* Meta badges */}
                    <div className="project-meta-top">
                        <span className="category-badge">{project.category}</span>

                        {project.featured && (
                            <span className="featured-badge">
                                <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Featured
                            </span>
                        )}

                        {project.status && (
                            <span style={{
                                fontSize: '0.72rem', fontWeight: 600,
                                color: statusColor,
                                background: statusBg,
                                border: `1px solid ${statusBorder}`,
                                padding: '4px 12px', borderRadius: '40px',
                                letterSpacing: '0.05em',
                                display: 'flex', alignItems: 'center', gap: '5px'
                            }}>
                                {isLive && (
                                    <span style={{
                                        width: '6px', height: '6px',
                                        background: 'var(--green)', borderRadius: '50%',
                                        flexShrink: 0, animation: 'pulseRing 2s infinite',
                                        display: 'inline-block'
                                    }} />
                                )}
                                {project.status}
                            </span>
                        )}
                    </div>

                    <h1 className="project-hero-title">{project.title}</h1>

                    <p className="project-hero-desc">{project.description}</p>

                    <div className="project-hero-actions">
                        {project.demoUrl && (
                            <a href={project.demoUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                </svg>
                                Live Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a href={project.githubUrl} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.1-.77.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* ── PROJECT IMAGE ── */}
            <div className="project-image-wrap">
                <div className="project-image-container">
                    {project.imageUrl && !project.imageUrl.includes('placeholder') ? (
                        <img src={project.imageUrl} alt={project.title} loading="lazy" />
                    ) : (
                        <div className="project-image-placeholder">
                            <div className="placeholder-grid"></div>
                            <div className="placeholder-mockup">
                                <div className="pm-header">
                                    <div className="pm-dots">
                                        <div className="pm-dot"></div>
                                        <div className="pm-dot"></div>
                                        <div className="pm-dot"></div>
                                    </div>
                                    <div className="pm-title-bar"></div>
                                </div>
                                <div className="pm-stats">
                                    <div className="pm-stat"><div className="pm-stat-val"></div><div className="pm-stat-lbl"></div></div>
                                    <div className="pm-stat"><div className="pm-stat-val"></div><div className="pm-stat-lbl"></div></div>
                                    <div className="pm-stat"><div className="pm-stat-val"></div><div className="pm-stat-lbl"></div></div>
                                </div>
                                <div className="pm-chart">
                                    <div className="pm-bar" style={{ height: '40%' }}></div>
                                    <div className="pm-bar" style={{ height: '70%' }}></div>
                                    <div className="pm-bar" style={{ height: '50%' }}></div>
                                    <div className="pm-bar" style={{ height: '85%' }}></div>
                                    <div className="pm-bar" style={{ height: '60%' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── DIVIDER ── */}
            <div className="divider-wrap">
                <hr className="divider" />
            </div>

            {/* ── MAIN CONTENT ── */}
            <section className="project-body">
                <div className="container">

                    {/* Left Column */}
                    <div className="project-main">

                        {project.longDescription && (
                            <div className="content-section">
                                <h2>Tentang Proyek</h2>
                                <p>{project.longDescription}</p>
                            </div>
                        )}

                        {project.challenge && (
                            <div className="content-section">
                                <h2>Tantangan</h2>
                                <p>{project.challenge}</p>
                            </div>
                        )}

                        {project.solution && (
                            <div className="content-section">
                                <h2>Solusi</h2>
                                <p>{project.solution}</p>
                            </div>
                        )}

                        {project.impact && (
                            <div className="content-section">
                                <h2>Dampak &amp; Hasil</h2>
                                <div className="impact-highlight">
                                    <span className="impact-icon">📈</span>
                                    <p>{project.impact}</p>
                                </div>
                            </div>
                        )}

                        {project.techStack && project.techStack.length > 0 && (
                            <div className="content-section">
                                <h2>Tech Stack</h2>
                                <p style={{ marginBottom: 0 }}>Teknologi dan tools yang digunakan dalam proyek ini:</p>
                                <div className="tech-stack">
                                    {project.techStack.map(t => (
                                        <span key={t} className="tech-badge">{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Sidebar */}
                    <aside className="project-sidebar">

                        {/* Project Info Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card-header">Detail Proyek</div>

                            <div className="sidebar-info-row">
                                <span className="info-label">Kategori</span>
                                <span className="info-value">{project.category}</span>
                            </div>

                            {project.status && (
                                <div className="sidebar-info-row">
                                    <span className="info-label">Status</span>
                                    <span className="info-value" style={{ color: statusColor, fontWeight: 500 }}>
                                        {isLive ? '✓ ' : isInProgress ? '⟳ ' : ''}{project.status}
                                    </span>
                                </div>
                            )}

                            {project.featured && (
                                <div className="sidebar-info-row">
                                    <span className="info-label">Featured</span>
                                    <span className="info-value">⭐ Ya — Project Unggulan</span>
                                </div>
                            )}

                            {project.role && (
                                <div className="sidebar-info-row">
                                    <span className="info-label">Role</span>
                                    <span className="info-value">{project.role}</span>
                                </div>
                            )}

                            {project.timeline && (
                                <div className="sidebar-info-row">
                                    <span className="info-label">Timeline</span>
                                    <span className="info-value muted">{project.timeline}</span>
                                </div>
                            )}

                            {project.year && (
                                <div className="sidebar-info-row">
                                    <span className="info-label">Tahun</span>
                                    <span className="info-value muted">{project.year}</span>
                                </div>
                            )}
                        </div>

                        {/* CTA Card */}
                        {(project.demoUrl || project.githubUrl) && (
                            <div className="sidebar-card">
                                <div className="sidebar-actions">
                                    {project.demoUrl && (
                                        <a href={project.demoUrl} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                            </svg>
                                            Lihat Live Demo
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
                                            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.1-.77.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                                            </svg>
                                            Source Code
                                        </a>
                                    )}
                                    <a href="/#contact" className="btn btn-outline btn-sm">
                                        💬 Diskusi Proyek Serupa
                                    </a>
                                </div>
                            </div>
                        )}

                    </aside>
                </div>
            </section>
        </>
    )
}