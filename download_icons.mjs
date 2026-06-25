import https from 'https';
import fs from 'fs';

const url192 = 'https://wsrv.nl/?url=lh3.googleusercontent.com/d/1rchbJC1cc4cnVzdJrORhdrEb6TQ_41PY&w=192&h=192&fit=contain&output=png';
const url512 = 'https://wsrv.nl/?url=lh3.googleusercontent.com/d/1rchbJC1cc4cnVzdJrORhdrEb6TQ_41PY&w=512&h=512&fit=contain&output=png';

const download = (url, path) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(path))
          .on('error', reject)
          .once('close', () => resolve(path));
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

Promise.all([
  download(url192, './public/icon-192.png'),
  download(url512, './public/icon-512.png')
]).then(() => console.log('Downloaded icons')).catch(console.error);
