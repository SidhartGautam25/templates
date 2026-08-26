# Maintainer dev scripts

FTP and connectivity test scripts for the **templates monorepo**. These files are **not** copied into generated client projects.

Run from `packages/core` with env vars loaded:

```bash
cd packages/core
pnpm exec tsx scripts/dev/test-ftp.ts
```
