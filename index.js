const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const sourceDirectory = 'build';
const distDirectory = 'build-gzip';

const createGZipFile = (dir, file) => {
  const sourceFilePath = path.join(dir, file);
  const distFilePath = dir.replace(sourceDirectory, distDirectory);
  mkdirp.sync(distFilePath);
  const gZip = zlib.createGzip();
  const inputStream = fs.createReadStream(sourceFilePath);
  const outputStream = fs.createWriteStream(`${distFilePath}/${file}.gz`, { encoding: 'utf8' });

  inputStream
    .pipe(gZip)
    .pipe(outputStream);
};

const readSourceDirectory = (dir, fileList = []) => {
  fs.readdirSync(dir).forEach(file => {
    fs.statSync(path.join(dir, file)).isDirectory()
      ? readSourceDirectory(path.join(dir, file), fileList)
      : createGZipFile(dir, file);
  });
};

const createGzipBuild = () => {
  if (fs.existsSync(distDirectory)) {
    rimraf.sync(distDirectory);
  }
  readSourceDirectory(sourceDirectory);
};

createGzipBuild();
