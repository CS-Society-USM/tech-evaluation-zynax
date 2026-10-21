/**
 * Displays a full-page loading state while session data is resolved.
 *
 * @returns {JSX.Element} Accessible loading indicator.
 * @example
 * if (isLoading) return <PageLoader />
 */
export function PageLoader() {
  return <div className="page-loader" role="status"><span className="page-loader__dot" />Loading your space…</div>
}
