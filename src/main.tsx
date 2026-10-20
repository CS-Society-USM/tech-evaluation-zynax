import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Landing } from "./pages/Landing";
import { AuthPage } from "./pages/AuthPage";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-500.css";
import "@fontsource/lora/latin-400-italic.css";
import "./styles.css";

const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard })),
);
function Workspace() {
  const { user, loading, recovery } = useAuth();
  if (loading)
    return (
      <main className="loading-page" role="status">
        <span className="spinner" /> Opening your notebook…
      </main>
    );
  if (recovery) return <Navigate to="/reset-password" replace />;
  return user ? (
    <Suspense
      fallback={
        <main className="loading-page" role="status">
          Opening your notebook…
        </main>
      }
    >
      <Dashboard key={user.id} user={user} />
    </Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
          <Route path="/reset-password" element={<AuthPage mode="reset" />} />
          <Route path="/auth/callback" element={<AuthPage mode="callback" />} />
          <Route path="/dashboard" element={<Workspace />} />
          <Route
            path="*"
            element={
              <main id="main" className="not-found">
                <h1>A page out of place.</h1>
                <p>This page doesn’t exist. Your notebook is still here.</p>
                <a href={import.meta.env.BASE_URL}>Back to Stillnote</a>
              </main>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
