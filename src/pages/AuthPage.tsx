import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Brand } from "../components/Brand";
import { useAuth } from "../components/AuthProvider";
import { client, configured } from "../lib/supabase";
import { readableError } from "../lib/notes";

type Mode = "login" | "signup" | "forgot" | "reset" | "callback";
const emailDeliveryEnabled =
  import.meta.env.VITE_EMAIL_DELIVERY_ENABLED === "true";
const copy: Record<Mode, { title: string; subtitle: string; action: string }> =
  {
    login: {
      title: "Welcome back.",
      subtitle: "Your thoughts are right where you left them.",
      action: "Open my notebook",
    },
    signup: {
      title: "Make a little space.",
      subtitle: "A fresh page for everything on your mind.",
      action: "Create my account",
    },
    forgot: {
      title: "Let’s get you back in.",
      subtitle: "We’ll send you a link to reset your password.",
      action: "Send reset link",
    },
    reset: {
      title: "A fresh start.",
      subtitle: "Choose a new password for your notebook.",
      action: "Save new password",
    },
    callback: {
      title: "Opening your notebook.",
      subtitle: "Checking your email confirmation…",
      action: "",
    },
  };

export function AuthPage({ mode }: { mode: Mode }) {
  const { user, loading, error: sessionError, recovery } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    setError("");
    setSuccess("");
    setPassword("");
  }, [mode]);
  const details = copy[mode];
  const callbackError =
    new URLSearchParams(window.location.search).get("error_description") ||
    new URLSearchParams(window.location.hash.slice(1)).get("error_description");
  if (
    user &&
    !loading &&
    (mode === "login" || mode === "signup" || mode === "callback")
  ) {
    return (
      <Navigate to={recovery ? "/reset-password" : "/dashboard"} replace />
    );
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const db = client();
      const base = `${window.location.origin}${import.meta.env.BASE_URL}`;
      if (mode === "signup") {
        const { data, error } = await db.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${base}auth/callback` },
        });
        if (error) throw error;
        if (data.session) navigate("/dashboard", { replace: true });
        else
          setSuccess(
            "Check your inbox for a confirmation link. If you already have an account, log in instead.",
          );
      } else if (mode === "login") {
        const { error } = await db.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        navigate("/dashboard", { replace: true });
      } else if (mode === "forgot") {
        if (!emailDeliveryEnabled)
          throw new Error(
            "Password recovery is not available in this evaluation version.",
          );
        const { error } = await db.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${base}reset-password`,
        });
        if (error) throw error;
        setSuccess(
          "If an account exists for this email, a reset link will arrive shortly. Check your spam folder too.",
        );
      } else if (mode === "reset") {
        const { error } = await db.auth.updateUser({ password });
        if (error) throw error;
        const { error: signOutError } = await db.auth.signOut();
        if (signOutError) throw signOutError;
        setSuccess(
          "Password updated. You can now log in with your new password.",
        );
      }
      setPassword("");
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <aside className="auth-story">
        <Brand />
        <div>
          <span className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET</span>
          <h2>
            Let your mind
            <br />
            <em>unfold.</em>
          </h2>
          <p>
            You don’t need a perfect thought.
            <br />
            Just a place to put it.
          </p>
          <div className="auth-paper">
            <span className="note-kicker">A GENTLE REMINDER</span>
            <p>
              You’re allowed to be
              <br />a work in progress.
            </p>
            <span aria-hidden="true">✳</span>
          </div>
        </div>
        <span className="auth-foot">
          <LockKeyhole size={15} /> Your notes stay in your account.
        </span>
      </aside>
      <main id="main" className="auth-main">
        <Link className="back-link" to="/">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="eyebrow">
            {mode === "signup"
              ? "YOUR FIRST PAGE STARTS HERE"
              : "A MOMENT FOR YOU"}
          </span>
          <h1>{details.title}</h1>
          <p className="auth-subtitle">{details.subtitle}</p>
          {(error || callbackError || sessionError) && (
            <div className="notice error" role="alert">
              {error || callbackError || sessionError}
            </div>
          )}
          {!configured && (
            <div className="notice error" role="alert">
              This notebook is not connected yet. Please contact the site owner.
            </div>
          )}
          {success && (
            <div className="notice success" role="status">
              <CheckCircle2 size={20} />
              <span>{success}</span>
            </div>
          )}
          {mode === "callback" ? (
            <div className="callback-state">
              {loading ? (
                <span className="spinner" />
              ) : (
                <p>
                  The link may have expired or was already used. Try logging in,
                  or request a new link.
                </p>
              )}
              <Link className="button" to="/login">
                Go to login <ArrowRight size={16} />
              </Link>
            </div>
          ) : mode === "forgot" && !emailDeliveryEnabled ? (
            <div className="notice" role="status">
              Password recovery is not available in this evaluation version.
              Please keep your password somewhere safe.
            </div>
          ) : mode === "reset" && !loading && !user ? (
            <div className="notice">
              <p>
                Please open the password reset link from your email to continue.
              </p>
              <Link to="/forgot-password">Request a new link</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              {mode !== "reset" && (
                <label>
                  Email address
                  <div className="input-with-icon">
                    <Mail size={17} />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={254}
                      disabled={busy}
                    />
                  </div>
                </label>
              )}
              {mode !== "forgot" && (
                <label>
                  {mode === "reset" ? "New password" : "Password"}
                  <div className="password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={
                        mode === "login"
                          ? "Your password"
                          : "At least 8 characters"
                      }
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      value={password}
                      minLength={mode === "login" ? 1 : 8}
                      maxLength={128}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={busy}
                    />
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
              )}
              {mode === "login" && emailDeliveryEnabled && (
                <Link className="forgot-link" to="/forgot-password">
                  Forgot password?
                </Link>
              )}
              {mode === "signup" && (
                <p className="field-hint">
                  Use a unique password with at least 8 characters.
                  {!emailDeliveryEnabled &&
                    " Keep it safe — password recovery is unavailable in this evaluation version."}
                </p>
              )}
              <button
                className="button full-width"
                type="submit"
                disabled={busy || !configured || (mode === "reset" && loading)}
              >
                {busy ? (
                  <>
                    <span className="spinner" /> One moment…
                  </>
                ) : (
                  <>
                    {details.action}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}
          <p className="auth-switch">
            {mode === "login" ? (
              <>
                New around here? <Link to="/signup">Create an account</Link>
              </>
            ) : mode === "signup" ? (
              <>
                Already have a notebook? <Link to="/login">Log in</Link>
              </>
            ) : (
              <Link to="/login">Back to login</Link>
            )}
          </p>
          <div className="auth-privacy">
            <LockKeyhole size={14} /> A private space. Just for you.
          </div>
        </div>
        <span className="auth-bottom">
          Take a breath. You’re in the right place.
        </span>
      </main>
    </div>
  );
}
