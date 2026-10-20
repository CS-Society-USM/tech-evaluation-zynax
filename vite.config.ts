import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  let commit =
    env.VITE_COMMIT_SHA || env.VERCEL_GIT_COMMIT_SHA || env.GITHUB_SHA;
  if (!commit) {
    try {
      commit = execSync("git rev-parse HEAD").toString().trim();
    } catch {
      commit = "local";
    }
  }
  return {
    plugins: [
      react(),
      {
        name: "build-identity",
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "version.json",
            source: JSON.stringify({ commit, app: "stillnote" }),
          });
        },
      },
    ],
    base: env.VITE_BASE_PATH || "/",
    define: { __COMMIT_SHA__: JSON.stringify(commit) },
  };
});
