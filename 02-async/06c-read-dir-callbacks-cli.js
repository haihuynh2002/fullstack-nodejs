const fs = require('fs');
const path = require('path');
const targetDirectory = process.argv[2] || './';

getFileLengths(targetDirectory, function (err, results) {
    if(err) return console.log(err);

    results.forEach(([file, length]) => console.log(`${file}: ${length}`));
    console.log('done!');
});

function getFileLengths(dir, cb) {
    fs.readdir(dir, function(err, files) {
        if(err) return console.log(err);

        const filePaths = files.map(file => path.join(dir, file));

        mapAsync(files, readFile, cb);
    })
}

function readFile(file, cb) {
    fs.readFile(file, function (err, fileData) {
        if(err) {
            if(err.code === 'EISDIR') return cb(null, [file, 0]);
            return cb(err);
        }

        cb(null, [file, fileData.length]);
    })
}

function getFileLengths(dir, cb) {
  fs.readdir(dir, (err, files) => {
    if (err) return console.log(err);
    mapAsync(files, readFile, cb);
  });
}

function mapAsync(arr, fn, onFinish) {
    let prevError;
    let nRemaining = arr.length;
    const results = [];
  
    arr.forEach((item, i) => {
      fn(item, function (err, data) {
        if (prevError) return;
        if (err) {
          prevError = err;
          return onFinish(err);
        }
  
        results[i] = [item, data.length];
  
        nRemaining--;
        if (!nRemaining) return onFinish(null, results);
      });
    });
  }