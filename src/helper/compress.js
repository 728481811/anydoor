
const {createGzip, createDeflate} = require('zlib');
module.exports = (rs, req, res) => {
	const accptEncoding = req.headers['accept-encoding'];
	if(!accptEncoding || !accptEncoding.match(/\b(gzib|deflate)\b/)) {
		return rs;
	} else if(accptEncoding.match(/\bgzip\b/)) {
		res.setHeader('Content-Encoding', 'gzip');
		return rs.pipe(createGzip());
	} else if(accptEncoding.match(/\bdeflate\b/)) {
		res.setHeader('Content-Encoding', 'deflate');
		return rs.pipe(createDeflate());
	}
};