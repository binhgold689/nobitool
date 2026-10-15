const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('ufw status; ss -tulpn; docker ps; curl -I http://127.0.0.1', (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: '45.77.172.213',
  port: 22,
  username: 'root',
  password: '5eA}9KtNN_3a4q9C'
});
