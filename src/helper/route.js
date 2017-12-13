const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path')
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig');
const handlebars = require('handlebars');
const tplPath = path.join(__dirname, '../template/dir.html');
const tplErr = path.join(__dirname, '../template/err.html');
const source = fs.readFileSync(tplPath);
const source1 = fs.readFileSync(tplErr);
const template = handlebars.compile(source.toString());
const mime = require('../helper/mime');
const compress = require('../helper/compress');
const isFresh = require('./cache');
module.exports = async function (req,  res, filePath) {
    try {
		const stats = await stat(filePath);
		if(stats.isFile()) {
			const contentType = mime(filePath);
			res.setHeader('Content-Type', contentType[1] ? contentType[1] : 'text/plain;charset=utf-8');
			const isF = isFresh(stats, req, res);
			console.log(isF)
			if(isF) {
				res.statusCode = 304;
				res.end();
				return;
			}
			res.statusCode = 200;
			let rs = fs.createReadStream(filePath);	
			if(filePath.match(config.compress)) {
				rs = compress(rs, req, res);
			}
			rs.pipe(res);
		} else if (stats.isDirectory()){
			const files = await readdir(filePath);
			res.setHeader('Content-Type', 'text/HTML');
			const dir = path.relative(config.root, filePath);
            const data = {
                files: files.map(file => {
					let iconName = '';
					const isFloder = path.join(filePath, file);
					const stats = fs.statSync(isFloder)
					if(stats.isDirectory()) {
						iconName = 'folder-css';
					} else {
						iconName = mime(file)[0];
					}
					return {
						file,
						icon: `/src/icon/${iconName}.svg`
					}
				}),
                dir: dir ? `/${dir}` : '',
                title: path.basename(filePath)
			}
            res.end(template(data));
        }
	} catch(err) {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/html');
		console.log(err)
		res.end(source1);
	}
};