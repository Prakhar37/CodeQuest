process.stdin.on('data', function(input) {
    let x = parseInt(input);
    console.log(x * 2);
});
