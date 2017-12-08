const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const route = require('./helper/route');
const path = require('path');
const server =  http.createServer((req, res) => {
	const url = req.url;
	const filePath = path.join(conf.root, url);
	route(req, res, filePath);
});

server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}`;
	/* eslint-disable*/
    console.log(`server start at ${chalk.blue(addr)}`);
});