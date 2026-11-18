#!/usr/bin/env node
/**
 * Standalone, read-only Solana Devnet account verifier.
 * Newly written for this public companion repository.
 *
 * This is NOT the Handy Pro escrow on-chain source code.
 * It never imports application code, creates keys, or signs transactions.
 */
const PROGRAM_ID = "9Fru3GdBPi9Mv8SU1BrHPo5whdKsRz4zinbQihXiT7ro";
const UPGRADEABLE_LOADER = "BPFLoaderUpgradeab1e11111111111111111111111";
const DEPLOYMENT_SIGNATURE =
  "65tCZX5oacgEMzm1u1Mei4jzQuoPa3AdFMTjavR5UapcezS7DfDYgPLdCWkXY8PYHzqCg2T1vANCPEsZvm5Bqir5";
const RPC = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

async function callRpc(method, params) {
  const response = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`RPC returned HTTP ${response.status}`);
  }
  const body = await response.json();
  if (body.error) {
    throw new Error(`RPC ${method}: ${body.error.message || "unknown error"}`);
  }
  return body.result;
}

async function main() {
  if (process.argv.some((arg) => arg !== "--deployment" && arg.startsWith("--"))) {
    throw new Error("Usage: node scripts/check-devnet.mjs [--deployment]");
  }
  console.log("Handy Pro — public Solana Devnet verification");
  console.log("RPC:", RPC);
  console.log("Program ID:", PROGRAM_ID);

  const info = await callRpc("getAccountInfo", [
    PROGRAM_ID,
    { commitment: "finalized", encoding: "base64" },
  ]);
  const account = info?.value;
  if (!account) {
    throw new Error("Program account was not found at this RPC endpoint.");
  }

  console.log("Account executable:", account.executable);
  console.log("Account owner:", account.owner);
  console.log("Observed slot:", info.context?.slot ?? "unknown");

  if (account.executable !== true || account.owner !== UPGRADEABLE_LOADER) {
    throw new Error("Account is not a deployed executable owned by the upgradeable loader.");
  }
  console.log("PASS: An executable upgradeable Solana program is deployed at this address.");

  if (process.argv.includes("--deployment")) {
    try {
      const history = await callRpc("getSignatureStatuses", [
        [DEPLOYMENT_SIGNATURE],
        { searchTransactionHistory: true },
      ]);
      const status = history?.value?.[0] ?? null;
      console.log("Deployment transaction signature:", DEPLOYMENT_SIGNATURE);
      if (!status) {
        console.log("History not available from this RPC node; inspect the Solana Explorer link.");
      } else {
        console.log("Recorded transaction status:", status.confirmationStatus || "unknown");
        console.log("Transaction error:", status.err === null ? "none" : JSON.stringify(status.err));
      }
      console.log("Note: signature status alone does not prove a source/build match.");
    } catch (error) {
      console.log("Historical signature lookup unavailable:", error.message);
    }
  }

  console.log("Scope: account existence only; no contract audit or payment verification.");
}

main().catch((error) => {
  console.error("Verification failed:", error.message);
  process.exitCode = 1;
});
