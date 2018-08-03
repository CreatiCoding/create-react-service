#!/usr/bin/env node
const co = require("co");
const prompt = require("co-prompt");
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;
const fs = require('fs');
const srcDir = "../target";

let copyFile = (name, oldPath, newPath)=>{
	newPath = name + newPath;
	return new Promise(res => {
        	const rd = fs.createReadStream(oldPath);
        	rd.on('error', err => {
			console.log(err.code+"] error occur in read old file.");
			res(name);
		});
        	const wr = fs.createWriteStream(newPath);
        	wr.on('error', err => {
			console.log(err.code+"] error occur in write new file.");
			res(name);
		});
        	wr.on('close', () => {
			console.log(oldPath+" is copied to "+newPath+".");
			res(name);
		});
        	rd.pipe(wr);
	});
};

let moveFile = (name, oldPath, newPath)=>{
	oldPath = name + oldPath;
	newPath = name + newPath;
	return new Promise(res=>{
		if(fs.existsSync(oldPath) && (!fs.existsSync(newPath))){
			fs.rename(oldPath,newPath, err=>{
				if(err){
					console.log(err.code+"] error occurs");
				}else{
					console.log(oldPath+" is moved to "+newPath+".");
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
	.then((name)=>deleteFile(name, "/package.json"))
	.then((name)=>deleteFile(name, "/app.js"))
	.then((name)=>deleteFile(name, "/public/index.html"))
	.then((name)=>deleteFile(name, "/src/index.js"))
	.then((name)=>printStage(name, "move some files"))
	.then((name)=>moveFile(name, "/src/registerServiceWorker.js", "/src/js/registerServiceWorker.js"))
	.then((name)=>moveFile(name, "/src/logo.svg", "/src/images/logo.svg"))
	.then((name)=>printStage(name, "cpoy some files"))
	.then((name)=>copyFile(name, srcDir+"/app.js", "/app.js"))
	.then((name)=>copyFile(name, srcDir+"/start.sh", "/start.sh"))
	.then((name)=>copyFile(name, srcDir+"/service.sh", "/service.sh"))
	.then((name)=>copyFile(name, srcDir+"/public/index.html", "/public/index.html"))
	.then((name)=>copyFile(name, srcDir+"/src/routes/HomeRoute.js", "/src/routes/HomeRoute.js"))
	.then((name)=>copyFile(name, srcDir+"/src/routes/AboutRoute.js", "/src/routes/AboutRoute.js"))
	.then((name)=>copyFile(name, srcDir+"/src/routes/PostRoute.js", "/src/routes/PostRoute.js"))
	.then((name)=>copyFile(name, srcDir+"/src/actions/index.js", "/src/actions/index.js"))
	.then((name)=>copyFile(name, srcDir+"/src/actions/ActionTypes.js", "/src/actions/ActionTypes.js"))
	.then((name)=>copyFile(name, srcDir+"/src/components/AppTitle.js", "/src/components/AppTitle.js"))
	.then((name)=>copyFile(name, srcDir+"/src/containers/App.js", "/src/containers/App.js"))
	.then((name)=>copyFile(name, srcDir+"/src/css/index.css", "/src/css/index.css"))
	.then((name)=>copyFile(name, srcDir+"/src/css/App.css", "/src/css/App.css"))
	.then((name)=>copyFile(name, srcDir+"/src/css/AppTitle.css", "/src/css/AppTitle.css"))
	.then((name)=>copyFile(name, srcDir+"/src/reducers/index.js", "/src/reducers/index.js"))
	.then((name)=>copyFile(name, srcDir+"/src/reducers/messageReducer.js", "/src/reducers/messageReducer.js"))
	.then((name)=>copyFile(name, srcDir+"/src/index.js", "/src/index.js"))
	.then((name)=>copyFile(name, __dirname+"/template/package.json.template", "/package.json"))
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
