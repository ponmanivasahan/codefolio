import { spawn } from 'child_process';

const child = spawn('npx.cmd', ['prisma', 'migrate', 'dev', '--name', 'init']);

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  if (data.toString().includes('Do you want to continue?')) {
    child.stdin.write('y\n');
  }
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  process.exit(code);
});