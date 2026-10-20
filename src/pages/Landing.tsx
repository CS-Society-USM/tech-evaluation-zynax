import {
  ArrowDown,
  ArrowRight,
  Check,
  Feather,
  LockKeyhole,
  Pin,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "../components/Brand";
import { useAuth } from "../components/AuthProvider";

export function Landing() {
  const { user } = useAuth();
  const start = user ? "/dashboard" : "/signup";
  return (
    <div className="landing">
      <header className="site-header wrap">
        <Brand />
        <nav aria-label="Main navigation">
          <a className="desktop-link" href="#why-stillnote">
            Why Stillnote
          </a>
          <Link className="nav-login" to={user ? "/dashboard" : "/login"}>
            {user ? "My notebook" : "Log in"}
          </Link>
          <Link className="button button-small" to={start}>
            Get started <ArrowRight size={15} />
          </Link>
        </nav>
      </header>
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-spark">✳</span> LESS NOISE. MORE YOU.
            </span>
            <h1>
              A little room
              <br />
              for your <em>thoughts.</em>
            </h1>
            <p>
              Big ideas. Tiny reminders. The things you don’t want to forget.
              Give them a home that feels like a deep breath.
            </p>
            <div className="hero-actions">
              <Link className="button" to={start}>
                Start your notebook <ArrowRight size={18} />
              </Link>
              <a className="text-link" href="#how-it-works">
                Take a look <ArrowDown size={16} />
              </a>
            </div>
            <div className="hero-proof">
              <span>
                <Check size={14} /> Free to start
              </span>
              <span>
                <LockKeyhole size={13} /> Yours by default
              </span>
              <span>No clutter</span>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="Illustration of a personal notebook with example notes"
          >
            <span className="art-spark spark-one" aria-hidden="true">
              ✳
            </span>
            <span className="art-spark spark-two" aria-hidden="true">
              ✦
            </span>
            <div className="art-label top-label">
              a place for the in-between
            </div>
            <div className="notebook-preview">
              <div className="preview-top">
                <span className="preview-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>My little corner</span>
                <span>↗</span>
              </div>
              <div className="preview-body">
                <div className="preview-heading">
                  <span>Good things start here.</span>
                  <Feather size={20} />
                </div>
                <div className="preview-search">
                  <Search size={12} /> Find a thought…
                </div>
                <div className="preview-grid">
                  <div className="sample-note sage">
                    <span className="note-kicker">THE EVERYDAY</span>
                    <Pin size={13} className="sample-pin" />
                    <h3>A slower Sunday</h3>
                    <p>
                      Walk without a destination.
                      <br />
                      Make something from scratch.
                      <br />
                      Leave a little space.
                    </p>
                    <span className="sample-time">Just now</span>
                  </div>
                  <div className="sample-note peach">
                    <span className="note-kicker">A LITTLE SPARK</span>
                    <h3>What if…</h3>
                    <p>
                      A book club where we
                      <br />
                      actually finish the books?
                    </p>
                    <div className="scribble" aria-hidden="true">
                      let’s try it ↗
                    </div>
                  </div>
                  <div className="sample-note paper">
                    <span className="note-kicker">FOR LATER</span>
                    <h3>Things to make</h3>
                    <p>
                      ☑ A playlist for rainy days
                      <br />☐ A corner for my plants
                      <br />☐ Something just for fun
                    </p>
                  </div>
                  <div className="sample-note lavender">
                    <span className="note-kicker">NOTE TO SELF</span>
                    <h3>
                      Small steps
                      <br />
                      still count.
                    </h3>
                    <span className="drawn-star" aria-hidden="true">
                      ✳
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-note">
              <span aria-hidden="true">♡</span> Your mind called.
              <br />
              It wants a little space.
            </div>
            <div className="art-label bottom-label">
              messy thoughts, welcome here.
            </div>
          </div>
        </section>
        <section className="promise-strip" aria-label="Made for your everyday">
          <div className="wrap">
            <span>For the ideas at 2 a.m.</span>
            <span aria-hidden="true">✳</span>
            <span>The plans over coffee.</span>
            <span aria-hidden="true">✳</span>
            <span>And everything in between.</span>
          </div>
        </section>
        <section id="why-stillnote" className="features wrap">
          <div className="section-heading">
            <span className="eyebrow">A NOTEBOOK, WITH ROOM TO BREATHE</span>
            <h2>
              Everything you need.
              <br />
              <em>Space for what matters.</em>
            </h2>
            <p>
              Less organizing your tools.
              <br />
              More getting your thoughts down.
            </p>
          </div>
          <div className="feature-grid">
            <article>
              <span className="feature-icon sage">
                <Feather />
              </span>
              <span className="feature-number">01</span>
              <h3>Catch the thought.</h3>
              <p>
                Open a note and let it out. A title, a few words, a whole idea.
                There’s no wrong place to start.
              </p>
            </article>
            <article>
              <span className="feature-icon peach">
                <Sparkles />
              </span>
              <span className="feature-number">02</span>
              <h3>Make a little order.</h3>
              <p>
                A color for your mood. A pin for what matters. A quick search
                for that thing you wrote last week.
              </p>
            </article>
            <article>
              <span className="feature-icon lavender">
                <LockKeyhole />
              </span>
              <span className="feature-number">03</span>
              <h3>Keep it your own.</h3>
              <p>
                Your account. Your notes. A private notebook that goes wherever
                you do, from your desk to your pocket.
              </p>
            </article>
          </div>
        </section>
        <section id="how-it-works" className="closing wrap">
          <div className="closing-doodle" aria-hidden="true">
            ✳
          </div>
          <span className="eyebrow">FROM A BLANK PAGE TO A CLEARER HEAD</span>
          <h2>
            Your next good idea
            <br />
            needs a <em>little space.</em>
          </h2>
          <p>
            Create an account. Write your first note. Make yourself at home.
          </p>
          <Link className="button" to={start}>
            Find your little corner <ArrowRight size={18} />
          </Link>
        </section>
      </main>
      <footer className="site-footer wrap">
        <Brand />
        <p>A calm place for a busy mind.</p>
        <span>Made with a little intention.</span>
      </footer>
    </div>
  );
}
