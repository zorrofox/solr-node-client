var solr = require('./main');
var client = solr.createClient();

console.log(queryAll(0, 100, []));

function queryAll(start, row, docs) {
	var respHeader = {};
	var respBody = {};
	var test = {};
	client.search(client.createQuery().q('*:*').rows(row).start(start), function(err, resp) {
		//console.log(resp.response.docs);
		docs = docs.concat(resp.response.docs);
		if (start + row <= resp.response.numFound) {
			queryAll(start + row, row, docs);
		} else {
			console.log(docs.length);
			respHeader.status = resp.responseHeader.status;
			respHeader.QTtime = resp.responseHeader.QTime;
			var params = {};
			params.start = '0';
			params.q = '*.*';
			params.wt = 'json';
			params.rows = resp.response.numFound;
			respHeader.params = params;
			respBody.numFound = resp.response.numFound;
			respBody.start = 0;
			respBody.docs = docs;
			test = {
				responseHeader : respHeader,
				response : respBody
			};
			return test;
		}
	});
}