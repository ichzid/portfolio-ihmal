'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const closeNav = () => setOpen(false)

    return (
        <nav className={`main-nav${scrolled ? ' scrolled' : ''}`} id="navbar">
            <Link href="/" className="nav-logo" onClick={closeNav}>
                Ihmal<span className="dot">.</span>
            </Link>

            <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
                <li><Link href="/#home" onClick={closeNav}>Home</Link></li>
                <li><Link href="/#projects" onClick={closeNav}>Projects</Link></li>
                <li><Link href="/#about" onClick={closeNav}>About</Link></li>
                <li><Link href="/#contact" className="nav-cta" onClick={closeNav}>Contact Me</Link></li>
            </ul>

            <button
                className="nav-hamburger"
                id="hamburger"
                onClick={() => setOpen(!open)}
                aria-label="Toggle navigation"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    )
}
