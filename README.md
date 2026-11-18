# Handy Pro — Solana Devnet escrow (public verification companion)

**Handy Pro** is a location-based marketplace for local services. Customers can find nearby professionals on a live map, chat, and arrange jobs.

This repository is a **minimal public, read-only verification companion** for the Handy Pro Solana Devnet escrow prototype. It is **not** a clone of the private Handy Pro application and **does not contain** the deployed Anchor program source code, proprietary UI, backend, infrastructure configuration, deployment keypairs, or production credentials.

> **Hackathon transparency:** This repository allows independent checks of public Devnet deployment information. It does **not** make the full product or the on-chain escrow implementation open source. Organizers must confirm whether this scope meets the Dev3pack submission rules.

## Public Devnet evidence

- **Network:** Solana **Devnet** (not Mainnet)
- **Program ID:** `9Fru3GdBPi9Mv8SU1BrHPo5whdKsRz4zinbQihXiT7ro`
- [View the program in Solana Explorer](https://explorer.solana.com/address/9Fru3GdBPi9Mv8SU1BrHPo5whdKsRz4zinbQihXiT7ro?cluster=devnet)
- [View the deployment transaction in Solana Explorer](https://explorer.solana.com/tx/65tCZX5oacgEMzm1u1Mei4jzQuoPa3AdFMTjavR5UapcezS7DfDYgPLdCWkXY8PYHzqCg2T1vANCPEsZvm5Bqir5?cluster=devnet)

A read-only audit dated 2026-11-18 reported that the deployed Anchor program uses SPL-token escrow and has successful Devnet release and refund test transactions. This repository **does not independently reproduce** those token-settlement tests. To verify the program's present deployment status, run the public RPC checker below.

## Verify the Devnet program (no wallet needed)

Requires **Node.js 18+**. This script uses the public Solana JSON-RPC API and built-in Node features only. It neither signs transactions nor stores wallet secrets.

```bash
node scripts/check-devnet.mjs
```

You can optionally inspect the publicly available deployment signature:

```bash
node scripts/check-devnet.mjs --deployment
```

The default RPC is `https://api.devnet.solana.com`. Set `SOLANA_RPC_URL` to use your own trusted **Devnet** endpoint.

The script checks whether the Program ID is an executable account owned by Solana's upgradeable BPF loader. It does **not** verify the program's source code, escrow correctness, or matching Mainnet deployment.

## Current product stage

- Working Handy Pro **web beta**: https://handypro.dev
- Public information: https://info.handypro.dev
- Solana integration demonstrated with **test-only** tokens on Devnet
- **No Mainnet payments or real-money escrow** claimed
- Full production end-to-end payment flow has not been independently verified in this repository

## Disclosure boundary

Only newly written public documentation and the stand-alone public RPC checker belong here. The private application and deployed program source are intentionally excluded. Do not add private code, `.env` files, user data, wallet keypairs, deployment credentials, or database exports.

See [SECURITY.md](SECURITY.md) before proposing changes.
