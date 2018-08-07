#!/usr/bin/env node
const co = require("co");
const prompt = require("co-prompt");
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;
const fs = require('fs');
const srcDir = __dirname + "/target";

console.log(srcDir);
let replaceFile = (param, path, regex, replacement)=>{
	let name = param.name;
	path = name + path;
	return new Promise(res=>{
		fs.readFile(path, 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
 			const result = data.replace(regex, replacement);
			fs.writeFile(path, result, 'utf8', function (err) {
				console.log("replacement is exec");
				if (err) return console.log(err);
				res(param);
			});
		});
	});
};

let copyFile = (param, oldPath, newPath)=>{
	let name = param.name;
	newPath = name + newPath;
	return new Promise(res => {
        	const rd = fs.createReadStream(oldPath);
        	rd.on('error', err => {
			console.log(err.code+"] error occur in read old file.");
			res(param);
		});
        	const wr = fs.createWriteStream(newPath);
        	wr.on('error', err => {
			console.log(err.code+"] error occur in write new file.");
			res(param);
		});
        	wr.on('close', () => {
			console.log(oldPath+" is copied to "+newPath+".");
			res(param);
		});
        	rd.pipe(wr);
	});
};

let moveFile = (param, oldPath, newPath)=>{
	let name = param.name;
	oldPath = name + oldPath;
	newPath = name + newPath;
	return new Promise(res=>{
		if(fs.existsSync(oldPath) && (!fs.existsSync(newPath))){
			fs.rename(oldPath,newPath, err=>{
				if(err){
					console.log(err.code+"] error occurs");
				}else{
					console.log(oldPath+" is moved to "+newPath+".");
					res(param);
				}
			});
		}else{
			console.log(oldPath+" not existed or "+newPath+" already existed.");
			res(param);
		}
	});
};

let deleteFile = (param, path)=>{
	let name = param.name;
	path = name + path;
	return new Promise(res=>{
		if(fs.existsSync(path)){
			console.log(path+" is deleted.");
			fs.unlinkSync(path);
			res(param);
		}else{
			console.log(path+" already deleted.");
			res(param);
		}
	});
};
let deleteDir = (param, path)=>{
	let name = param.name;
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
			res(param);
		}else{
			console.log(path+" already deleted.");
			res(param);
		}
	});
};
let printStage = (param, stage)=>{
	let name = param.name;
	return new Promise(res=>{
		console.log("["+name+":: "+stage+"]");
		res(param);
	});
};
let createDir = (param, path)=>{
	let name = param.name;
	path = name + path;
	return new Promise((res)=>{
		if(!fs.existsSync(path)){
			console.log(path+" is created.");
			fs.mkdirSync(path);
			res(param);
		} else {
			console.log(path+" already exists.");
			res(param);
		}
	});
};

let inputProjectName = (res, rej)=>{
	return co(function *(){
		let name = yield prompt("name: ");
		let host = yield prompt("host: ");
		res({
			name: name,
			host: host
		});
	});
};

let craProcess = (param) => {
	let name = param.name;
	console.log("cra",name);
	return new Promise(res=>{
		let ex = exec("create-react-app " + name);
		ex.stdout.on("data", data=>{
			console.log(data);
		});
		ex.on("close", (code, signal)=>{
			res(param);
		});
	});	
};

let expressProcess = (param) => {
	let name = param.name;
	console.log("express",name);
	return new Promise(res=>{
		let ex = exec("echo y | express --view=ejs " + name);
		ex.stdout.on("data",data=>{
			console.log(data);
		});
		ex.on("close", (code, signal)=>{
			res(param);
		});
		ex.stdin.write("y");
		ex.stdin.end();

	});
};

let installProcess = (param) =>{
	let name = param.name;
	console.log("install", name);
	return new Promise(res=>{
		let ex = exec("cd "+name+" && yarn add react react-dom react-scripts react-redux react-router-dom redux redux-actions cookie-parser debug ejs express http-errors morgan");
		ex.stdout.on("data", data=>{
			console.log(data);
		});
		ex.on("close",(code,signal)=>{
			res(param);
		});
	});
}; 


new Promise(inputProjectName)
	.then((param)=>printStage(param, "create-react-app"))
	.then(craProcess)
	.then((param)=>printStage(param, "express-generator"))
	.then(expressProcess)
	.then((param)=>printStage(param, "create additional directory"))
	.then((param)=>createDir(param,"/src/actions"))
	.then((param)=>createDir(param,"/src/components"))
	.then((param)=>createDir(param,"/src/containers"))
	.then((param)=>createDir(param,"/src/css"))
	.then((param)=>createDir(param,"/src/images"))
	.then((param)=>createDir(param,"/src/js"))
	.then((param)=>createDir(param,"/src/routes"))
	.then((name)=>createDir(name,"/src/reducers"))
	.then((param)=>printStage(param, "delete some directories"))
	.then((param)=>deleteDir(param,"/public/images"))
	.then((param)=>deleteDir(param,"/public/javascripts"))
	.then((param)=>printStage(param, "delete some files"))
	.then((param)=>deleteFile(param, "/README.md"))
	.then((param)=>deleteFile(param, "/src/App.css"))
	.then((param)=>deleteFile(param, "/src/App.js"))
	.then((param)=>deleteFile(param, "/src/App.test.js"))
	.then((param)=>deleteFile(param, "/src/index.css"))
	.then((param)=>deleteFile(param, "/package.json"))
	.then((param)=>deleteFile(param, "/app.js"))
	.then((param)=>deleteFile(param, "/public/index.html"))
	.then((param)=>deleteFile(param, "/src/index.js"))
	.then((param)=>printStage(param, "move some files"))
	.then((param)=>moveFile(param, "/src/registerServiceWorker.js", "/src/js/registerServiceWorker.js"))
	.then((param)=>moveFile(param, "/src/logo.svg", "/src/images/logo.svg"))
	.then((param)=>printStage(param, "cpoy some files"))
	.then((param)=>copyFile(param, srcDir+"/.env.development", "/.env.development"))
	.then((param)=>copyFile(param, srcDir+"/app.js", "/app.js"))
	.then((param)=>copyFile(param, srcDir+"/start.sh", "/start.sh"))
	.then((param)=>copyFile(param, srcDir+"/service.sh", "/service.sh"))
	.then((param)=>copyFile(param, srcDir+"/public/index.html", "/public/index.html"))
	.then((param)=>copyFile(param, srcDir+"/src/routes/HomeRoute.js", "/src/routes/HomeRoute.js"))
	.then((param)=>copyFile(param, srcDir+"/src/routes/AboutRoute.js", "/src/routes/AboutRoute.js"))
	.then((param)=>copyFile(param, srcDir+"/src/routes/PostRoute.js", "/src/routes/PostRoute.js"))
	.then((param)=>copyFile(param, srcDir+"/src/actions/index.js", "/src/actions/index.js"))
	.then((param)=>copyFile(param, srcDir+"/src/actions/ActionTypes.js", "/src/actions/ActionTypes.js"))
	.then((param)=>copyFile(param, srcDir+"/src/components/AppTitle.js", "/src/components/AppTitle.js"))
	.then((param)=>copyFile(param, srcDir+"/src/containers/App.js", "/src/containers/App.js"))
	.then((param)=>copyFile(param, srcDir+"/src/css/index.css", "/src/css/index.css"))
	.then((param)=>copyFile(param, srcDir+"/src/css/App.css", "/src/css/App.css"))
	.then((param)=>copyFile(param, srcDir+"/src/css/AppTitle.css", "/src/css/AppTitle.css"))
	.then((param)=>copyFile(param, srcDir+"/src/reducers/index.js", "/src/reducers/index.js"))
	.then((param)=>copyFile(param, srcDir+"/src/reducers/messageReducer.js", "/src/reducers/messageReducer.js"))
	.then((param)=>copyFile(param, srcDir+"/src/index.js", "/src/index.js"))
	.then((param)=>copyFile(param, srcDir+"/.env.development","/.env.development"))
	.then((param)=>copyFile(param, __dirname+"/template/package.json.template", "/package.json"))
	.then((param)=>replaceFile(param, "/package.json",/\${name}/g, param.name))
	.then((param)=>replaceFile(param, "/.env.development",/\${host}/g, param.host))
	.then((param)=>installProcess(param))
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
