// Shared config for the Meridian load-testing suite (issue #719).
//
// Every script reads its target and tunables from environment variables so
// the same script runs unmodified against any throwaway testnet deployment.
// Pass them with k6's `-e`, e.g.:
//
//   k6 run -e BASE_URL=https://meridian-git-my-branch.vercel.app scripts/load-test/positions.js

export const BASE_URL = (__ENV.BASE_URL || "http://localhost:3001").replace(
  /\/+$/,
  ""
);

// Meridian's default live testnet vault (packages/shared/src/constants.ts,
// CONTRACT_ADDRESSES.testnet.vault). Fine to load-test against directly: the
// vault contract is exercised the same way whether it holds real deposits or
// not, and these scripts never submit signed transactions, only build them.
export const VAULT_ID =
  __ENV.VAULT_ID || "CAIQBVLBIUWQGE6DQUHDMZ2QWI7QP6KTCN7GP2BIZ6JZC4ES47JO4SSM";

// Bearer token for the cron-gated keeper actions (accrue/rebalance/alert).
// Only ever set this to a throwaway value configured on a throwaway testnet
// deployment — never the real CRON_SECRET from a production/mainnet project.
export const CRON_SECRET = __ENV.CRON_SECRET || "";

// Path to the account pool written by prepare-accounts.mjs.
export const ACCOUNTS_FILE = __ENV.ACCOUNTS_FILE || "./accounts.json";

export function jsonHeaders(extra) {
  return Object.assign({ "Content-Type": "application/json" }, extra || {});
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function loadAccounts(openFn) {
  const data = JSON.parse(openFn(ACCOUNTS_FILE));
  if (!data.accounts || data.accounts.length === 0) {
    throw new Error(
      `${ACCOUNTS_FILE} has no accounts. Run ` +
        "`node scripts/load-test/prepare-accounts.mjs` first (see README.md)."
    );
  }
  return data.accounts;
}
