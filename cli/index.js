#!/usr/bin/env node
const co = require("co");
const prompt = require("co-prompt");
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;

let inputProjectName = (res, rej)=>{
	return co(function *(){
		let name = yield prompt("name: ");
		res(name);
	});
};

let craProcess = (name) => {
	console.log("cra",name);
	return new Promise(res=>{
		let ex = exec("create-react-app " + name);
		ex.stdout.on("data", data=>{
			console.log(data);
		});
		ex.on("close", (code, signal)=>{
			res(name);
		});
	});	
};

let expressProcess = (name) => {
	console.log("express",name);
	return new Promise(res=>{
		let ex = exec("echo y | express --view=ejs " + name);
		ex.stdout.on("data",data=>{
			console.log(data);
		});
		ex.on("close", (code, signal)=>{
			res(name);
		});
		ex.stdin.write("y");
		ex.stdin.end();

	});
};

new Promise(inputProjectName)
	.then(craProcess)
	.then(expressProcess)
	.then(result=>{
	console.log("complete " + result);
	process.exit(0);
});;


/*

co(function *(){
	console.log("plus program!");
	let a = yield prompt("a: ");
	let b = yield prompt("b: ");
	console.log("a + b = %s", parseInt(a)+parseInt(b));
	process.exit(0);
	// error code : 1
})


*/
