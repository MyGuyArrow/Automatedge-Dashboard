import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const nextBin = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
const out = fs.openSync(path.join(projectRoot, 'next-dev.log'), 'a');
const err = fs.openSync(path.join(projectRoot, 'next-dev.err.log'), 'a');

fs.writeFileSync(path.join(projectRoot, 'dev-server.pid'), String(process.pid));

const child = spawn(process.execPath, [nextBin, 'dev', '-H', '0.0.0.0', '-p', '3000'], {
  cwd: projectRoot,
  env: process.env,
  stdio: ['pipe', out, err],
  windowsHide: true,
});

child.stdin.write('\n');

child.on('exit', (code, signal) => {
  fs.appendFileSync(
    path.join(projectRoot, 'next-dev.err.log'),
    `\nNext dev server exited with code=${code ?? 'null'} signal=${signal ?? 'null'}\n`,
  );
  process.exit(code ?? 1);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});

setInterval(() => {
  if (!child.killed && child.stdin.writable) {
    child.stdin.write('\n');
  }
}, 30_000);
