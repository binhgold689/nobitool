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
  let sha;
  try {
    sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'binhgold689',
        email: 'binhdubai.68@gmail.com',
      },
      message: 'Initial commit: OmniAffiliate Hub full source & workflows for nobitool.site',
    });
    console.log('Commit SHA:', sha);
  } catch (e) {
    console.log('Commit note:', e.message);
  }

  // Set branch to main
  try {
    await git.branch({ fs, dir, ref: 'main', checkout: true });
  } catch (errBranch) {
    // Branch đã tồn tại, tiếp tục checkout
  }

  if (repoUrl) {
    console.log(`3. Đang push lên GitHub: ${repoUrl}...`);
    const pushResult = await git.push({
      fs,
      http,
      dir,
      url: repoUrl,
      ref: 'main',
      remoteRef: 'refs/heads/main',
      force: true,
      onAuth: () => ({ username: githubToken || '' }),
    });
    console.log('🎉 Push lên GitHub thành công 100%!', pushResult);
  }
}

const repoUrl = process.argv[2];
const token = process.argv[3];

commitAndPush(repoUrl, token).catch(err => {
  console.error('Chi tiết lỗi:', err);
});
