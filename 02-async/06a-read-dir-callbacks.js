const fs = require('fs');

function mapSync(arr, fn) {
    const result = [];
    arr.forEach((item, i) => {
        const data = fn(item);
        result[i] = data;
    })
    return result;
}

function mapAsync(arr, fn, onFinish) {
    let prevError;
    let nRemaining = arr.length;
    const result = [];

    arr.forEach((item, i) => {
        fn(item, function(err, data) {
            if(prevError) return;
            if(err) {
                prevError = err;
                return onFinish(err);
            }

            result[i] = data;

            nRemaining --;
            if(!nRemaining) return onFinish(null, result);
        })
    })
}
