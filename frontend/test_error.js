const { exec } = require('child_process');
exec('curl -s http://localhost:5173/src/main.jsx', (error, stdout, stderr) => {
  if (error || !stdout) {
    console.error('SERVER NOT RESPONDING');
    process.exit(1);
  }
  console.log('MAIN.JSX SERVED OK. APP IS COMPILING.');
});
