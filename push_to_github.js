const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

async function commitAndPush(repoUrl, githubToken) {
  const dir = __dirname;

  console.log('1. Đang stage toàn bộ file...');
  const files = await fs.promises.readdir(dir, { recursive: true });
  for (const file of files) {
    if (file.startsWith('node_modules') || file.startsWith('.git') || file.includes('.env')) continue;
    const fullPath = path.join(dir, file);
    const stat = await fs.promises.stat(fullPath);
    if (stat.isFile()) {
      await git.add({ fs, dir, filepath: file.replace(/\\/g, '/') });
    }
  }

  console.log('2. Đang tạo Commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'OmniAffiliate Hub',
      email: 'admin@nobitool.site',
    },
    message: 'Initial commit: OmniAffiliate Hub full source & workflows',
  });
  console.log('Commit SHA:', sha);

  if (repoUrl) {
    console.log(`3. Đang push lên GitHub: ${repoUrl}...`);
    await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      url: repoUrl,
      ref: 'main',
      onAuth: () => ({ username: githubToken }),
    });
    console.log('🎉 Push lên GitHub thành công 100%!');
  } else {
    console.log('Chưa cung cấp repoUrl. Sẵn sàng push khi có link!');
  }
}

// Lấy tham số từ dòng lệnh
const repoUrl = process.argv[2];
const token = process.argv[3];

commitAndPush(repoUrl, token).catch(err => {
  console.error('Lỗi Git:', err);
});
