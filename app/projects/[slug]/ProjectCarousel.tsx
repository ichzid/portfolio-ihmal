'use client'

import { useState } from 'react'

export default function ProjectCarousel({
    images,
    title,
    imageUrl,
}: {
    images?: string[] | null,
    title: string,
    imageUrl?: string | null,
}) {
    // Merge imageUrls array + fallback single imageUrl
    const rawImages = (images && images.length > 0)
        ? images
        : imageUrl
            ? [imageUrl]
            : []

    const validImages = rawImages.filter(url =>
        url && url.trim() !== '' && !url.includes('/placeholder')
    )

    const [currentIndex, setCurrentIndex] = useState(0)

    // No valid images → show graphical placeholder
    if (validImages.length === 0) {
        return (
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
        )
    }

    const goTo = (idx: number) => setCurrentIndex(idx)
    const prev = () => setCurrentIndex(i => (i - 1 + validImages.length) % validImages.length)
    const next = () => setCurrentIndex(i => (i + 1) % validImages.length)
    const hasMultiple = validImages.length > 1

    return (
        <div className="carousel-root">
            {/* Main image */}
            <img
                key={currentIndex}
                src={validImages[currentIndex]}
                alt={`${title} — foto ${currentIndex + 1}`}
                className="carousel-img"
            />

            {hasMultiple && (
                <>
                    {/* Left arrow */}
                    <button onClick={prev} aria-label="Foto sebelumnya" className="carousel-btn carousel-btn-left">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Right arrow */}
                    <button onClick={next} aria-label="Foto berikutnya" className="carousel-btn carousel-btn-right">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    {/* Dots + counter */}
                    <div className="carousel-footer">
                        <div className="carousel-dots">
                            {validImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goTo(idx)}
                                    aria-label={`Foto ${idx + 1}`}
                                    className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="carousel-counter">{currentIndex + 1} / {validImages.length}</span>
                    </div>
                </>
            )}

            <style jsx>{`
                .carousel-root {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: inherit;
                    background: var(--surface2);
                }
                .carousel-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                    animation: fadeIn 0.25s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .carousel-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.55);
                    border: 1px solid rgba(255,255,255,0.15);
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                    z-index: 10;
                    backdrop-filter: blur(6px);
                }
                .carousel-btn:hover { background: rgba(0,0,0,0.8); }
                .carousel-btn-left  { left: 14px; }
                .carousel-btn-right { right: 14px; }
                .carousel-footer {
                    position: absolute;
                    bottom: 14px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                }
                .carousel-dots {
                    display: flex;
                    gap: 6px;
                    background: rgba(0,0,0,0.45);
                    padding: 6px 10px;
                    border-radius: 20px;
                    backdrop-filter: blur(4px);
                }
                .carousel-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.4);
                    border: none;
                    cursor: pointer;
                    transition: background 0.25s, transform 0.25s;
                    padding: 0;
                }
                .carousel-dot.active {
                    background: var(--accent, #38bdf8);
                    transform: scale(1.3);
                }
                .carousel-counter {
                    font-size: 0.72rem;
                    color: rgba(255,255,255,0.7);
                    letter-spacing: 0.05em;
                }
            `}</style>
        </div>
    )
}
