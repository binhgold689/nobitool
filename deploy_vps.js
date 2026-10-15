const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const VPS_CONFIG = {
  host: '45.77.172.213',
  port: 22,
  username: 'root',
  password: '5eA}9KtNN_3a4q9C'
};

const DOMAIN = 'nobitool.site';

function runCmd(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n>>> EXEC: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      let errOut = '';
      stream.on('close', (code) => {
        if (code === 0) resolve(out);
        else reject(new Error(`Command failed with code ${code}: ${errOut}`));
      }).on('data', (d) => {
        process.stdout.write(d);
        out += d;
      }).stderr.on('data', (d) => {
        process.stderr.write(d);
        errOut += d;
      });
    });
  });
}

function sftpUpload(conn, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const readStream = fs.createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);
      writeStream.on('close', () => resolve());
      writeStream.on('error', (err) => reject(err));
      readStream.pipe(writeStream);
    });
  });
}

async function deploy() {
  const conn = new Client();

  conn.on('ready', async () => {
    try {
      console.log('✅ Đã kết nối thành công tới VPS Vultr!');

      // 1. Cập nhật hệ thống & Cài đặt Docker, Nginx, Certbot
      console.log('\n[1/5] Đang cài đặt Docker, Nginx, Certbot trên Ubuntu...');
      await runCmd(conn, 'export DEBIAN_FRONTEND=noninteractive; apt-get update -y && apt-get install -y docker.io docker-compose-v2 curl nginx certbot python3-certbot-nginx');
      await runCmd(conn, 'systemctl enable docker && systemctl start docker');

      // 2. Tạo thư mục chứa dự án
      console.log('\n[2/5] Đang tạo thư mục dự án trên VPS...');
      await runCmd(conn, 'mkdir -p /opt/omniaffiliate /var/www/dashboard /opt/omniaffiliate/scripts /opt/omniaffiliate/workflows');

      // 3. Upload file giao diện Dashboard
      console.log('\n[3/5] Đang tải giao diện Dark Tech Dashboard lên VPS...');
      const localHtml = path.join(__dirname, 'dashboard', 'index.html');
      await sftpUpload(conn, localHtml, '/var/www/dashboard/index.html');

      // Upload docker-compose.yml và n8n workflow
      const localCompose = path.join(__dirname, 'docker', 'docker-compose.yml');
      await sftpUpload(conn, localCompose, '/opt/omniaffiliate/docker-compose.yml');

      const localWorkflow = path.join(__dirname, 'workflows', '01_telegram_to_draft.json');
      await sftpUpload(conn, localWorkflow, '/opt/omniaffiliate/workflows/01_telegram_to_draft.json');

      const localPrompt = path.join(__dirname, 'scripts', 'ai_prompts.md');
      await sftpUpload(conn, localPrompt, '/opt/omniaffiliate/scripts/ai_prompts.md');

      const localFfmpeg = path.join(__dirname, 'scripts', 'ffmpeg_hash_mutator.sh');
      await sftpUpload(conn, localFfmpeg, '/opt/omniaffiliate/scripts/ffmpeg_hash_mutator.sh');
      await runCmd(conn, 'chmod +x /opt/omniaffiliate/scripts/ffmpeg_hash_mutator.sh');

      // 4. Cấu hình Nginx cho tên miền nobitool.site
      console.log('\n[4/5] Đang cấu hình Nginx Reverse Proxy cho nobitool.site...');
      const nginxConfig = `
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN} app.${DOMAIN};

    root /var/www/dashboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name api.${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
`;
      await runCmd(conn, `cat << 'EOF' > /etc/nginx/sites-available/nobitool.conf\n${nginxConfig}\nEOF`);
      await runCmd(conn, 'ln -sf /etc/nginx/sites-available/nobitool.conf /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx');

      // 5. Cài đặt SSL HTTPS miễn phí với Certbot
      console.log('\n[5/5] Đang kích hoạt chứng chỉ bảo mật SSL HTTPS (Let\'s Encrypt)...');
      try {
        await runCmd(conn, `certbot --nginx -d ${DOMAIN} -d app.${DOMAIN} -d api.${DOMAIN} --non-interactive --agree-tos -m admin@${DOMAIN} --redirect || true`);
      } catch (sslErr) {
        console.log('Certbot warning (có thể DNS đang lan truyền, HTTP đã sẵn sàng):', sslErr.message);
      }

      // Khởi động n8n container
      console.log('\n🚀 Đang khởi chạy n8n trên VPS...');
      await runCmd(conn, 'docker compose -f /opt/omniaffiliate/docker-compose.yml up -d');

      console.log('\n================================================================');
      console.log('🎉 TRIỂN KHAI HOÀN TẤT 100% LÊN TÊN MIỀN VÀ VPS!');
      console.log(`🌐 Website Dashboard: http://${DOMAIN} (hoặc https://${DOMAIN})`);
      console.log(`⚙️ n8n Engine API:    http://api.${DOMAIN} (hoặc https://api.${DOMAIN})`);
      console.log('================================================================\n');

      conn.end();
    } catch (e) {
      console.error('❌ Lỗi trong quá trình triển khai:', e);
      conn.end();
    }
  });

  conn.connect(VPS_CONFIG);
}

deploy();
