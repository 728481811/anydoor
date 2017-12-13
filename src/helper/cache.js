const {cache} = require('../config/defaultConfig');
function refreshRes(stats, res) {
	const {maxAge, expires, cacheControl, lastModified, etag} = cache;
	if (expires) {
		res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
	}
	if (cacheControl) { 
		res.setHeader('Cache-Control', `public, max-age=${maxAge.toString()}`); 
	}
	if(lastModified) {
		res.setHeader('Last-Modified', stats.mtime.toUTCString());
	}
	if(etag) {	
		res.setHeader('ETag', `${stats.size.toString()}-${stats.mtime.toUTCString()}`);
	}  

}
module.exports = function isFresh(stats, req, res) {
	refreshRes(stats, res);
   
	const lastModified = req.headers['if-modified-since'];
	const etag = req.headers['if-none-match'];
    console.log(lastModified);
    console.log(res.getHeader('Last-Modified'))
    console.log(etag);
    console.log(res.getHeader('ETag'))
	if(!lastModified && !etag) {
		return false;
	}
	if(lastModified && lastModified !== res.getHeader('Last-Modified')) {
		return false;
	}
	if(etag && res.getHeader('ETag').indexOf(etag) === -1) {
		return false;
	}
	console.log(4);
	return true;
};