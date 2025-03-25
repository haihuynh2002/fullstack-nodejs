const fs = require("fs");
const { listenerCount } = require("process");

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

function getFileLengths(dirname, fn) {
  fs.readdir(dirname, (err, files) => {
    if (err) return console.log(err);
    mapAsync(files, fs.readFile, fn);
  });
}

getFileLengths("./", function (err, results) {
  if (err) return console.error(err);

  results.forEach(([file, length]) => console.log(`${file}: ${length}`));

  console.log("done!");
});
