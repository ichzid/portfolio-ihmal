import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import ScrollReveal from '@/components/ScrollReveal'
import ContactForm from '@/components/ContactForm'
import { getFeaturedProjects } from '@/lib/projects'
import {
    SiNextdotjs, SiVuedotjs, SiTypescript, SiTailwindcss, SiBootstrap,
    SiNodedotjs, SiLaravel, SiCodeigniter, SiMysql, SiPostgresql,
    SiGraphql, SiDocker, SiGit, SiFigma, SiLighthouse
} from 'react-icons/si'
import { FaCogs } from 'react-icons/fa'

export default async function Home() {
    const featured = await getFeaturedProjects()

    const skills = [
        { name: 'React / Next.js', icon: <SiNextdotjs /> },
        { name: 'Vue.js', icon: <SiVuedotjs /> },
        { name: 'TypeScript', icon: <SiTypescript /> },
        { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
        { name: 'Bootstrap', icon: <SiBootstrap /> },
        { name: 'Node.js', icon: <SiNodedotjs /> },
        { name: 'Laravel', icon: <SiLaravel /> },
        { name: 'CodeIgniter', icon: <SiCodeigniter /> },
        { name: 'MySQL', icon: <SiMysql /> },
        { name: 'PostgreSQL', icon: <SiPostgresql /> },
        { name: 'REST & GraphQL', icon: <SiGraphql /> },
        { name: 'Docker', icon: <SiDocker /> },
        { name: 'Git & CI/CD', icon: <SiGit /> },
        { name: 'n8n Automation', icon: <FaCogs /> },
        { name: 'Figma', icon: <SiFigma /> },
        { name: 'Web Performance', icon: <SiLighthouse /> },
    ]

    return (
        <>
            <Navbar />

            {/* ── HERO ── */}
            <section id="home">
                <div className="hero-background">
                    <div className="hero-glow hero-glow-1"></div>
                    <div className="hero-glow hero-glow-2"></div>
                </div>

                <h1 className="hero-name">
                    Building Digital<br />
                    <span className="outline">Experiences<span className="accent-dot">.</span></span>
                </h1>

                <p className="hero-headline">Fullstack Developer &mdash; From complexity to intuitive interfaces and reliable systems.</p>

                <p className="hero-sub">
                    With over 4 years of experience, I specialize in crafting modern web applications. My focus is on high performance, clean code, and solutions that drive business growth.
                </p>

                <div className="hero-actions">
                    <Link href="#projects" className="btn btn-primary">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M15 10l5 5-5 5" />
                            <path d="M4 4v7a4 4 0 004 4h12" />
                        </svg>
                        View Portfolio
                    </Link>
                    <Link href="#contact" className="btn btn-outline">
                        Discuss an Idea
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: '4px' }}>
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

                <div className="hero-scroll">
                    <span className="bounce">↓</span>
                    <span className="hero-scroll-text">Scroll to explore</span>
                </div>
            </section>





            {/* ── PROJECTS ── */}
            <section id="projects">
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header-row">
                            <div className="section-header-text">
                                <span className="section-tag">Selected Work</span>
                                <h2 className="section-title">Projects that <em>Speak</em></h2>
                                <p className="section-desc">More than just a portfolio—this is tangible proof. Real challenges, measurable solutions, and impact you can see for yourself.</p>
                            </div>
                            <Link href="/projects" className="see-all-link">
                                View All Projects
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </ScrollReveal>

                    <div className="projects-list">
                        {featured.map((project, i) => (
                            <ScrollReveal key={project.id}>
                                <div className={`project-card${i % 2 === 1 ? ' reverse' : ''}`}>
                                    <div className="project-visual">
                                        <div className="project-visual-bg"></div>
                                        <div className="project-mockup-stack" style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--surface) 0%, var(--border) 100%)', color: 'var(--text-muted)' }}>
                                            {project.imageUrl ? (
                                                <Image src={project.imageUrl} alt={project.title} fill style={{ objectFit: 'cover', borderRadius: 'inherit' }} />
                                            ) : (
                                                <span style={{ margin: 'auto' }}>No Image Available</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="project-content">

                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-desc">{project.description}</p>
                                        <div className="tech-stack">
                                            {project.techStack.map(t => (
                                                <span key={t} className="tech-badge">{t}</span>
                                            ))}
                                        </div>
                                        <div className="project-actions">
                                            <Link href={`/projects/${project.slug}`} className="btn btn-primary btn-sm">
                                                Detail
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <ScrollReveal>
                        <div className="projects-footer-cta">
                            <p className="cta-eyebrow">Portfolio Overview</p>
                            <h3>Explore More Case Studies</h3>
                            <p>Review my technical capabilities in managing project complexity and product architecture through the complete portfolio.</p>
                            <div className="cta-btn-row">
                                <Link href="/projects" className="btn btn-ghost">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                                        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                                    </svg>
                                    View All Projects
                                </Link>
                                <a href="https://github.com/ihmal-alazid" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.1-.77.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    GitHub Profile
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <div className="divider-wrap"><div className="divider"></div></div>

            {/* ── ABOUT ── */}
            <section id="about">
                <div className="container">
                    <div className="about-grid">
                        <ScrollReveal>
                            <div className="about-photo-wrap">
                                <div className="about-photo">
                                    <Image
                                        src="/images/profile.jpg"
                                        alt="Ihmal Al Azid"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 320px"
                                        priority
                                    />
                                </div>
                                <div className="about-photo-badge">4+ Years<br />Experience</div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={1}>
                            <div className="about-content">
                                <span className="section-tag">About Profile</span>
                                <h2 className="section-title">
                                    Business Value-Oriented<br /><em>Software Engineering</em>
                                </h2>
                                <p className="about-bio">
                                    Hello, I'm <strong>Ihmal Al Azid</strong>. As a Fullstack Developer with over 4 years of experience, I am dedicated to designing web applications that combine the aesthetics of an intuitive interface with a robust backend architecture.
                                    <br /><br />
                                    My main focus is on creating solutions that align with client business objectives. For me, technical excellence is not about code complexity, but about smart, efficient, and maintainable integration. My commitment is to ensure that every project delivers real impact and functional sustainability for users.
                                </p>
                                <div className="skills-title">Tools &amp; Technologies</div>
                                <div className="skills-grid">
                                    {skills.map(skill => (
                                        <span key={skill.name} className="skill-tag">
                                            <span style={{ fontSize: '1.1em', opacity: 0.8 }}>{skill.icon}</span>
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="about-interests">
                                    <h4>Beyond coding</h4>
                                    <div className="interests-list">
                                        {['✈️ Traveling', '⚽ Football', '☕ Coffee', '🏔️ Hiking', '🎵 Music'].map(i => (
                                            <span key={i} className="interest-item">{i}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <div className="divider-wrap"><div className="divider"></div></div>



            {/* ── CONTACT ── */}
            <section id="contact">
                <div className="container">
                    <ScrollReveal>
                        <div className="contact-header">
                            <span className="section-tag">Get in Touch</span>
                            <h2 className="section-title">Let's Discuss <em>Collaboration Opportunities</em></h2>
                            <p className="section-desc">I am always open to discussing various technical solutions and potential professional collaborations. Please leave your business narrative, and I will respond within 24-48 business hours.</p>
                        </div>
                    </ScrollReveal>
                    <div className="contact-grid">
                        <ScrollReveal>
                            <div className="contact-info">
                                <h3>Contact me directly</h3>
                                <a href="mailto:ichmal.alazid@gmail.com" className="contact-email">ichmal.alazid@gmail.com</a>
                                <div className="social-links">
                                    <a href="https://github.com/ichzid" className="social-link" target="_blank" rel="noopener noreferrer">
                                        <div className="social-icon">
                                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.1-.77.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                                            </svg>
                                        </div>
                                        GitHub — @ichzid
                                    </a>
                                    <a href="https://www.linkedin.com/in/ihmal-al-azid-59507415b/" className="social-link" target="_blank" rel="noopener noreferrer">
                                        <div className="social-icon">
                                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM6.62 20.45H4.05V9h2.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.22 0z" />
                                            </svg>
                                        </div>
                                        LinkedIn — ihmal-al-azid
                                    </a>
                                    <a href="https://www.instagram.com/ichzid_/" className="social-link" target="_blank" rel="noopener noreferrer">
                                        <div className="social-icon">
                                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                            </svg>
                                        </div>
                                        Instagram — @ichzid_
                                    </a>
                                    <a href="https://wa.me/6285362741943" className="social-link" target="_blank" rel="noopener noreferrer">
                                        <div className="social-icon">
                                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </div>
                                        WhatsApp — 085362741943
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={1}>
                            <div className="contact-form-card">
                                <ContactForm />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </>
    )
}
