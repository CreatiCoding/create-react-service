#!/usr/bin/env node
const co = require("co");
const prompt = require("co-prompt");
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;
const fs = require('fs');

let moveFile = (name, oldPath, newPath)=>{
	oldPath = name + oldPath;
	newPath = name + newPath;
	return new Promise(res=>{
		if(fs.existsSync(oldPath) && (!fs.existsSync(newPath))){
			fs.rename(oldPath,newPath, err=>{
				if(err){
					console.log(err.code+"] error occurs");
				}else{
					console.log(oldPath+" is copied to "+newPath+".");
					res(name);
				}
			});
		}else{
			console.log(oldPath+" not existed or "+newPath+" already existed.");
			res(name);
		}
	});
};

let deleteFile = (name, path)=>{
	path = name + path;
	return new Promise(res=>{
		if(fs.existsSync(path)){
			console.log(path+" is deleted.");
			fs.unlinkSync(path);
			res(name);
		}else{
			console.log(path+" already deleted.");
			res(name);
		}
	});
};
let deleteDir = (name, path)=>{
	path = name + path;
	return new Promise(res=>{
		if(fs.existsSync(path)){
			fs.readdirSync(path).forEach((file,index)=>{
				let curPath = path + "/" + file;
				if(fs.lstatSync(curPath).isDirectory()){
					deleteDir("",curPath);
				}else{
					fs.unlinkSync(curPath);
				}
			});
			console.log(path+" is deleted.");
			fs.rmdirSync(path);
			res(name);
		}else{
			console.log(path+" already deleted.");
			res(name);
		}
	});
};
let printStage = (name, stage)=>{
	return new Promise(res=>{
		console.log("["+name+":: "+stage+"]");
		res(name);
	});
};
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
	.then((name)=>printStage(name, "create-react-app"))
	.then(craProcess)
	.then((name)=>printStage(name, "express-generator"))
	.then(expressProcess)
	.then((name)=>printStage(name, "create additional directory"))
	.then((name)=>createDir(name,"/src/actions"))
	.then((name)=>createDir(name,"/src/components"))
	.then((name)=>createDir(name,"/src/containers"))
	.then((name)=>createDir(name,"/src/css"))
	.then((name)=>createDir(name,"/src/images"))
	.then((name)=>createDir(name,"/src/js"))
	.then((name)=>createDir(name,"/src/routes"))
	.then((name)=>createDir(name,"/src/reducers"))
	.then((name)=>printStage(name, "delete some directories"))
	.then((name)=>deleteDir(name,"/public/images"))
	.then((name)=>deleteDir(name,"/public/javascripts"))
	.then((name)=>printStage(name, "delete some files"))
	.then((name)=>deleteFile(name, "/README.md"))
	.then((name)=>deleteFile(name, "/src/App.css"))
	.then((name)=>deleteFile(name, "/src/App.js"))
	.then((name)=>deleteFile(name, "/src/App.test.js"))
	.then((name)=>deleteFile(name, "/src/index.css"))
	.then((name)=>deleteFile(name, "/src/logo.svg"))
	.then((name)=>deleteFile(name, "/package.json"))
	.then((name)=>deleteFile(name, "/app.js"))
	.then((name)=>deleteFile(name, "/public/index.html"))
	.then((name)=>deleteFile(name, "/src/index.js"))
	.then((name)=>printStage(name, "move some files"))
	.then((name)=>moveFile(name, "/src/registerServiceWorker.js", "/src/js/registerServiceWorker.js"))
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
