'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export const NProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <style jsx global>{`
        #nprogress {
          pointer-events: none;
        }
        #nprogress .bar {
          background: #011f9f !important; /* Your brand-primary-blue color */
          position: fixed !important;
          z-index: 99999 !important; /* A very high z-index */
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
        }
      `}</style>
      <ProgressBar height="4px" color="#011f9f" options={{ showSpinner: false }} shallowRouting />
      {children}
    </>
  )
}
