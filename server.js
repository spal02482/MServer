const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const bodyParser = require('body-parser');


/*const { Client } = require('pg')
var connString = 'postgres://postgres:postgres@mserver.cmbxoqpanhp8.ap-southeast-1.rds.amazonaws.com:5432/mserver'
const client = new Client(connString)
client.connect();*/


const app = express();
app.use(express.static('public'));
app.use(express.static('views'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

const s3 = new AWS.S3();

const verifyUser = async function(name, password) {
	try {
		var res = await client.query('select password from users where name=$1', [name])
		if(res.rows.length == 0) return false;
		console.log("verifyUser: ", res.rows[0].password)
		return res.rows[0].password == password ? true : false
	}
	catch(err) {
		console.log(err)
	}
}

const getUserFiles = async function(name) {
	try {
		var res = await client.query("select filename from userdata where name=$1", [name]);
		console.log("getUserFiles: ", res.rows);
		return res.rows;
	}
	catch(err) {
		console.log(err);
	}
}

app.get('/', function(req, res) {
	res.render("index");
});

app.post('/user', async function(req,res) {
	try {
		console.log(req.body.name + " " + req.body.password);
		var authenticateUser = await verifyUser(req.body.name, req.body.password);
		if(authenticateUser == true) {
			var data = await getUserFiles(req.body.name);
			res.render("user", {"name":req.body.name, "password":req.body.password, "files":data});
		}
		else {
			res.status(403).send("<b><i>Login Failed</i></b>");
		}
	}
	catch(err) {
		console.log(err);
	}
});

app.post('/upload', function(req, res) {
	console.log(req.body);
	var uploadfile = "upload/" + req.body.upload_file;
	var key = req.body.name + "/" + req.body.upload_file;
	console.log(uploadfile + " " + key);
	fs.readFile(uploadfile, (err,data) => {
		var params = { Bucket : 'spal02482', Key : key, Body : data }
		s3.putObject( params, (err, data) => { 
			if(err) throw err;
			else console.log("data successfully sent");
			console.log(data);
		});
	});
	console.log("sent");
	res.sendStatus(200);
	res.end();
});

app.listen('8001', function() {
	console.log("server started...");
});
