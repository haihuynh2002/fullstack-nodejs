const fs = require('fs').promises;

fs.readdir('./')
.then(files => 
    Promise.all(
        files.map(file => fs.readFile(file).then(data => [file, data.length]))
    )
)
.then(results => {
    results.forEach(([file, length]) => console.log(`${file}: ${length}`));
    console.log('done!');
})
.catch(err => console.log(err));