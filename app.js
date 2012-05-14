
var sys = require('util')
  ,  dbox  = require("dbox")
  ,  express = require('express')
  ,  app = express.createServer();
var dapp   = dbox.app({ "app_key": <consumer_key>, "app_secret": <consumer_secret> });

// Create and configure an Express server.
var app = express.createServer();
app.configure(function () {
  app.use(express.static(__dirname + '/public'))
  , app.use(express.logger())
  , app.use(express.bodyParser())
  , app.use(express.cookieParser())
  , app.use(express.session({ secret: '1ts-s3cr3t!'} ));
});
app.set('view options', { layout: false, pretty: true });

// Login page.
app.get('/', function (req, res) {
	res.render('app.jade', {
		locals: {
			title: 'Markdown in the cloud',
		}
	});
});

app.post('/db_connect', function(req, res){
	if(!(req.session.client && req.session.client.metadata) && req.body.access_token){
		req.session.client = dapp.createClient(req.body.access_token);
		req.session.client.account(function(status, reply){
			res.json(reply);
		});
	}
	else if(req.session.request_token){
		dapp.access_token(req.session.request_token, function(status, access_token){
			//test access_token
			req.session.access_token = access_token;
			req.session.client = dapp.createClient(access_token);
			res.json({
				access_token: req.session.access_token
			});
		});
	}
	else {
		var host = req.headers.host;
		var callback = "http://"+host+"/"
		dapp.request_token(function(status, request_token){
			req.session.request_token = request_token;
			res.json({
					request_token: request_token,
					callback: callback
			});
		});
	}
});

app.post('/rm/file', function(req,res){
	if(!(req.session.client && req.session.client.metadata) && req.body.access_token){
		req.session.client = dapp.createClient(req.body.access_token);//guess this should be a try
		//something has to check for error here
	}
	if(req.body.path){
		req.session.client.rm(req.body.path, function(status, reply){
			res.json(reply);
		});
	}
});

app.post('/sync/file', function(req, res){
	var options = {
		file_limit         : 10000,              // optional
		//hash               : ,                // optional
		list               : true,               // optional
		include_deleted    : false,              // optional, change to true in order to update deleted files
		//rev                : 7,                  // optional
		locale             : "en",               // optional
		root               : "sandbox"           // optional
	}
	if(!(req.session.client && req.session.client.metadata) && req.body.access_token){
		req.session.client = dapp.createClient(req.body.access_token);//guess this should be a try
		//something has to check for error here
	}
	if(req.session.client && req.session.client.metadata){
		if(req.body.path || req.body.path == ""){
			req.session.client.metadata(req.body.path, options, function(status, reply){
				if(!reply.error && !reply.is_dir){
					//sync file with dropbox
					//Always default to dropbox version
					if(req.body.file.utc < Date.parse(reply.modified) || req.body.file.last_sync < Date.parse(reply.modified)){
						req.session.client.get(req.body.path, function(status, reply){
							res.json({
								success: true,
								model: {
									utc: Date.parse(reply.modified),
									content: reply.toString()
								}
							});
						});
					}
					else if(req.body.file.utc >= Date.parse(reply.modified)){
						var now = new Date();
						req.session.client.put(req.body.path, req.body.file.content, function(status, reply){
							res.json({
								success: true,
								model:{
									utc: now.getTime()
								}
							});
						});
					}
				}
				else {
					res.json(reply);
				}
			});
		}
		else {//add file
			var path = "/"+req.body.file.name+".md";
			req.session.client.put(path, req.body.file.content, function(status, reply){
				if(!reply.error){
					res.json({
						success: true,
						model:{
							db_path: path,
							utc: Date.parse(reply.modified)
						}
					});
				}
				else {
					res.json(reply);
				}
			});
		}
	}
});

app.post('/sync/dir', function(req, res){
	var options = {
		file_limit         : 10000,              // optional
		//hash               : ,                // optional
		list               : true,               // optional
		include_deleted    : true,              // optional, change to true in order to update deleted files
		//rev                : 7,                  // optional
		locale             : "en",               // optional
		root               : "sandbox"           // optional
	}
	
	if(!(req.session.client && req.session.client.metadata) && req.body.access_token){
		req.session.client = dapp.createClient(req.body.access_token);//guess this should be a try
		//something has to check for error here
	}
	if(req.session.client && req.session.client.metadata){
		if(req.body.path || req.body.path == ""){
			req.session.client.metadata(req.body.path, options, function(status, reply){
				if(!reply.error){
				//test for file vs folder
					if(reply.is_dir){
						var files = new Array();
						var folders = new Array();
						reply.contents.forEach(function(item){
							
							if(item.is_dir){
								folders.push({path: item.path, is_deleted: item.is_deleted});
							}
							else if(!req.body.files || !req.body.files[item.path] || req.body.files[item.path].utc != Date.parse(item.modified)){
								files.push({path: item.path, is_deleted: item.is_deleted});
							}
						});
						res.json({
							files: files,
							folders: folders
						});
					}
				}
				else {
					res.json(reply);
				}
			});
		}
		else {//add folder
		}
	}
	else {
		res.json({
			success: false,
			error: "the client ran out of juice"
		});
	}
});

app.listen(8080);
//this causes errors in nodejitsu, not sure why
console.log('Dropbox browser running on port 8080');
