'use client'

import Link from 'next/link'
import { Mail, Linkedin, MessageCircle, ArrowUpCircle } from 'lucide-react'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'

export const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-brand-deep-blue text-white mt-auto">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
          {/* Column 1: Logo & Socials */}
          <div className="flex flex-col space-y-4 md:pl-10">
            <Logo />
            <p className="text-slate-400">Transforming education, one student at a time.</p>
            <div className="flex space-x-4 mt-4">
              <a href="mailto:nexuslearning.team@gmail.com" className="text-slate-400 hover:text-white transition">
                <Mail className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://wa.me/+917999311976"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6 w-6" fill="currentColor">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:pl-20">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 ">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-slate-400 hover:text-white transition">
                  Our Courses
                </Link>
              </li>
              <li>
                <Link href="/#our-team" className="text-slate-400 hover:text-white transition">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/#why-nexus" className="text-slate-400 hover:text-white transition">
                  Why Nexus
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Get in Touch */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <p className="text-slate-400">Have questions? We&apos;d love to hear from you.</p>
            <Link href="/contact">
              <Button className="mt-4 bg-brand-primary-blue hover:bg-brand-dark-blue w-full md:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Column 4: Go to Top */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigate</h3>
            <p className="text-slate-400">Return to the top of the page.</p>
            <Button
              onClick={handleBackToTop}
              variant="outline"
              className="mt-4 bg-transparent border-slate-500 text-slate-300 hover:bg-white/10 hover:text-white w-full md:w-auto"
            >
              <ArrowUpCircle className="h-5 w-5 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-slate-700 text-center text-slate-500 text-sm">
          <p>Copyrights © {new Date().getFullYear()} Nexus Learning. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
