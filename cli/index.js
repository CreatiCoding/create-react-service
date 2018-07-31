#!/usr/bin/env node
const co = require("co");
const prompt = require("co-prompt");
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;
const fs = require('fs');


let createDir = (name, path)=>{
	path = name + path;
	return new Promise((res)=>{
		if(!fs.existsSync(path)){
			console.log(path+" is created.");
			fs.mkdirSync(path);
			res(name);
		} else {
			console.log(path+" already exists.");
			res(name);
		}
	});
};

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

let copyProcess = (filename) =>{

} 


new Promise(inputProjectName)
	.then(craProcess)
	.then(expressProcess)
	.then((name)=>createDir(name,"/actions"))
	.then((name)=>createDir(name,"/components"))
	.then((name)=>createDir(name,"/containers"))
	.then((name)=>createDir(name,"/css"))
	.then((name)=>createDir(name,"/images"))
	.then((name)=>createDir(name,"/js"))
	.then((name)=>createDir(name,"/routes"))
	.then((name)=>createDir(name,"/reducer"))
	.then(result=>{
		console.log("complete " + result);
		process.exit(0);
	});


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
