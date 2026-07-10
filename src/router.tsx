import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// Minimal history-based router — react-router would cost ~20 KB gz against a
// 300 KB total budget, and we only need static paths + one param.

const RouteContext = createContext('/')

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    window.addEventListener('app:navigate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('app:navigate', onPop)
    }
  }, [])

  return <RouteContext.Provider value={path}>{children}</RouteContext.Provider>
}

export function usePath() {
  return useContext(RouteContext)
}

export function navigate(to: string) {
  if (window.location.pathname === to) return
  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event('app:navigate'))
  window.scrollTo(0, 0)
}

export function Link({
  to,
  children,
  className,
  ...rest
}: { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
