import { createContext, useContext, useState, useMemo, useEffect } from 'react'

const LoadingContext = createContext()

// Non-React way to trigger loading (for axios interceptors)
let loadingCount = 0
let setLoadingGlobal = () => {}

export const loader = {
  show: () => {
    loadingCount++
    if (loadingCount === 1) setLoadingGlobal(true)
  },
  hide: () => {
    loadingCount = Math.max(0, loadingCount - 1)
    if (loadingCount === 0) setLoadingGlobal(false)
  }
}

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoadingGlobal = setLoading
  }, [])

  const value = useMemo(() => ({
    loading,
    setLoading
  }), [loading])

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loading && (
        <div className="global-loader-overlay">
          <div className="loader-spinner"></div>
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
