import { AuthContext } from './authContext.js'
import { useAuthController } from './useAuthController.js'

/**
 * Provides session state and authentication actions to the application tree.
 *
 * @param {{children: import('react').ReactNode}} props Component props.
 * @returns {JSX.Element} Authentication context provider.
 * @example
 * <AuthProvider><App /></AuthProvider>
 */
export function AuthProvider({ children }) {
  const auth = useAuthController()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
