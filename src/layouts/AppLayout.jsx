import { LogOut, Plus } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { Brand } from '../components/shared/Brand.jsx'
import { Button } from '../components/shared/Button.jsx'
import { useAppLayoutActions } from '../hooks/useAppLayoutActions.js'

/**
 * Dashboard shell with account identity, primary navigation, and logout action.
 *
 * @returns {JSX.Element} Authenticated application layout.
 * @example
 * <Route element={<AppLayout />}><Route path="dashboard" /></Route>
 */
export function AppLayout() {
  const { user, handleLogout, requestNewNote } = useAppLayoutActions()

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Brand compact />
        <div className="app-sidebar__body">
          <p className="eyebrow">Workspace</p>
          <nav aria-label="Workspace navigation">
            <a className="sidebar-link sidebar-link--active" href="/dashboard">All notes <span>●</span></a>
          </nav>
        </div>
        <div className="account-card">
          <span className="avatar" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
          <span><strong>{user.name}</strong><small>{user.email}</small></span>
          <button className="icon-button" type="button" onClick={handleLogout} aria-label="Log out"><LogOut size={17} /></button>
        </div>
      </aside>
      <div className="app-main">
        <header className="mobile-header">
          <Brand compact />
          <Button size="small" onClick={requestNewNote} icon={<Plus size={16} />}>New</Button>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
