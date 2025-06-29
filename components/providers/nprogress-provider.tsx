'use client'

// Correctly import ProgressProvider from the '/app' entry point for the App Router
import { ProgressProvider } from '@bprogress/next/app'

export const NProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    // The ProgressProvider now wraps your application's children
    <ProgressProvider
      height="4px"
      color="linear-gradient(to right, #3b82f6, #60a5fa)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  )
}
