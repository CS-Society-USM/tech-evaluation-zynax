import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

// Uses only the public key. Run only against the disposable evaluation project.
// Requires email confirmation disabled, or provide two existing verified test accounts.
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key)
  throw new Error("Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
if (process.env.E2E_LIVE !== "1")
  throw new Error(
    "Explicitly set E2E_LIVE=1 to permit creating test accounts and notes.",
  );
const makeClient = () =>
  createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
const alice = makeClient(),
  bob = makeClient(),
  guest = makeClient();
const stamp = Date.now();
const users = [];
for (const [name, db] of [
  ["alice", alice],
  ["bob", bob],
]) {
  const email = process.env[`RLS_${name.toUpperCase()}_EMAIL`];
  const password = process.env[`RLS_${name.toUpperCase()}_PASSWORD`];
  const result =
    email && password
      ? await db.auth.signInWithPassword({ email, password })
      : await db.auth.signUp({
          email: `stillnote-rls-${name}-${stamp}@example.com`,
          password: `Test!${crypto.randomUUID()}`,
        });
  assert.ifError(result.error);
  assert.ok(
    result.data.session,
    "A real authenticated session is required; confirm test-user emails or use a disposable project without email confirmation.",
  );
  users.push(result.data.user.id);
}
let id;
try {
  const created = await alice
    .from("notes")
    .insert({
      user_id: users[0],
      title: "Private RLS test",
      content: "Only Alice can access this.",
      color: "sage",
    })
    .select()
    .single();
  assert.ifError(created.error);
  id = created.data.id;
  assert.equal(
    (await alice.from("notes").select().eq("id", id)).data?.length,
    1,
  );
  assert.equal((await bob.from("notes").select().eq("id", id)).data?.length, 0);
  assert.ok(
    (await guest.from("notes").select()).error,
    "Guests must lack table access",
  );
  assert.ok(
    (
      await guest
        .from("notes")
        .insert({ user_id: users[0], title: "Guest", content: "No" })
    ).error,
  );
  assert.ok(
    (await guest.from("notes").update({ title: "Guest" }).eq("id", id)).error,
  );
  assert.ok((await guest.from("notes").delete().eq("id", id)).error);
  const forged = await bob
    .from("notes")
    .insert({ user_id: users[0], title: "Forged owner", content: "No" });
  assert.ok(forged.error, "Forged ownership must fail");
  const stolen = await bob
    .from("notes")
    .update({ title: "Stolen" })
    .eq("id", id)
    .select();
  assert.ifError(stolen.error);
  assert.equal(stolen.data.length, 0);
  const erased = await bob.from("notes").delete().eq("id", id).select();
  assert.ifError(erased.error);
  assert.equal(erased.data.length, 0);
  assert.ok(
    (await alice.from("notes").update({ user_id: users[1] }).eq("id", id))
      .error,
    "Ownership must be immutable",
  );
  assert.ok(
    (
      await alice
        .from("notes")
        .update({ created_at: "2000-01-01" })
        .eq("id", id)
    ).error,
  );
  assert.ok(
    (await alice.from("notes").update({ title: "  \t" }).eq("id", id)).error,
  );
  assert.ok(
    (
      await alice
        .from("notes")
        .update({ content: "a".repeat(20001) })
        .eq("id", id)
    ).error,
  );
  assert.ok(
    (await alice.from("notes").update({ color: "red" }).eq("id", id)).error,
  );
  const updated = await alice
    .from("notes")
    .update({ title: "Edited by owner", pinned: true })
    .eq("id", id)
    .select()
    .single();
  assert.ifError(updated.error);
  assert.equal(updated.data.title, "Edited by owner");
  assert.notEqual(updated.data.updated_at, created.data.updated_at);
  const conflict = await alice
    .from("notes")
    .update({ title: "Stale overwrite" })
    .eq("id", id)
    .eq("updated_at", created.data.updated_at)
    .select();
  assert.ifError(conflict.error);
  assert.equal(conflict.data.length, 0);
  const removed = await alice.from("notes").delete().eq("id", id).select();
  assert.ifError(removed.error);
  assert.equal(removed.data.length, 1);
  id = undefined;
  console.log(
    "PASS: 18 live API assertions: guest denial, own CRUD, cross-user isolation, forged owner, immutable fields, constraints, timestamps, stale-write protection.",
  );
} finally {
  if (id) await alice.from("notes").delete().eq("id", id);
  await Promise.all([alice.auth.signOut(), bob.auth.signOut()]);
  console.log(
    "Test notes cleaned up; isolated test account rows remain for audit. No personal account was used.",
  );
}
