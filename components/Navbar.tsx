"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-content">
        <div className="main-nav-links">
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/wordle" onClick={closeMenu}>
            Wordle
          </Link>

          <Link href="/word-search" onClick={closeMenu}>
            Word Search
          </Link>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="compact-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span aria-hidden="true">☰</span>
          <span>Menu</span>
        </button>

        {menuOpen && (
          <div id="compact-menu" className="compact-menu">
            <Link href="/about" onClick={closeMenu}>
              About
            </Link>

            <Link href="/settings" onClick={closeMenu}>
              Settings
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}