#!/usr/bin/env node
const co = require("co");
const prompt = require("co-prompt");
co(function *(){
	console.log("plus program!");
	let a = yield prompt("a: ");
	let b = yield prompt("b: ");
	console.log("a + b = %s", parseInt(a)+parseInt(b));
	process.exit(0);
	// error code : 1
});
