import { Outlet } from 'react-router-dom'

/**
 * Layout shell for public landing and authentication pages.
 *
 * @returns {JSX.Element} Public route outlet.
 * @example
 * <Route element={<PublicLayout />} />
 */
export function PublicLayout() {
  return <div className="public-shell"><Outlet /></div>
}
