const fs = require("fs").promises;
const path = require('path');

printLengths("./");

async function printLengths(dir) {
  const results = await getFileLengths(dir);
  results.forEach(([file, length]) => console.log(`${file}: ${length}`));
  console.log("done!");
}

async function getFileLengths(dir) {
  const fileList = await fs.readdir(dir);
  const readFiles = fileList.map((file) => {
    const filePath = path.join(dir, file);
    return readFile(filePath);
  });
  return Promise.all(readFiles);
}

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    return [filePath, data.length];
  } catch (err) {
    if (err.code === "EISDIR") return [filePath, 0];
    throw err;
  }
}
