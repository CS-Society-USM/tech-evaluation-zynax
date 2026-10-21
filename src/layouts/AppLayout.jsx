import { LayoutGrid, LogOut, Plus } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { useAppLayoutActions } from '../hooks/useAppLayoutActions.js'

/**
 * Authenticated shell: renders the active page and a floating action dock on small screens.
 *
 * @returns {JSX.Element} Authenticated application layout.
 * @example
 * <Route element={<AppLayout />}><Route path="dashboard" /></Route>
 */
export function AppLayout() {
  const { handleLogout, requestNewNote } = useAppLayoutActions()

  return (
    <div className="app-shell">
      <Outlet />
      <nav className="mobile-dock" aria-label="Quick navigation">
        <Link className="mobile-dock__item is-active" to="/dashboard" aria-label="All notes"><LayoutGrid size={20} /></Link>
        <button className="mobile-dock__fab" type="button" onClick={requestNewNote} aria-label="New note"><Plus size={26} /></button>
        <button className="mobile-dock__item" type="button" onClick={handleLogout} aria-label="Log out"><LogOut size={20} /></button>
      </nav>
    </div>
  )
}
