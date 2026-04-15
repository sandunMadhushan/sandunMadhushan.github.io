import { spawnSync } from "node:child_process";

const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 15_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runMigrateDeploy() {
  return spawnSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
}

async function main() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    console.log(`[migrate] Attempt ${attempt}/${MAX_ATTEMPTS}: prisma migrate deploy`);
    const result = runMigrateDeploy();
    if ((result.status ?? 1) === 0) return;

    if (attempt < MAX_ATTEMPTS) {
      console.warn(`[migrate] Failed attempt ${attempt}. Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await sleep(RETRY_DELAY_MS);
    } else {
      process.exit(result.status ?? 1);
    }
  }
}

await main();
