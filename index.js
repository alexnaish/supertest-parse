const test = require('supertest');
const cheerio = require('cheerio');

function performTest({ app, path, method, body, headers = {} }) {
	return new Promise((resolve, reject) => {
		const request = test(app)[method](path);
		Object.keys(headers).map(key => {
			request.set(key, headers[key]);
		});

		if (body) {
			request.send(body);
		}

		request.end((err, res) => {
			if (err) return reject(err);
			return resolve({
				status: res.status,
				headers: res.headers,
				$: cheerio.load(res.text)
			});
		});
	});
}

class SuperTester {

	constructor ({ app }) {
		this.app = app;
	}

	get ({ path, headers }) {
		return performTest({
			app: this.app,
			method: 'get',
			path,
			headers
		});
	}

	post ({ path, headers, body }) {
		return performTest({
			app: this.app,
			method: 'post',
			path,
			headers,
			body
		});
	}

	put ({ path, headers, body }) {
		return performTest({
			app: this.app,
			method: 'put',
			path,
			headers,
			body
		});
	}

	delete ({ path, headers, body }) {
		return performTest({
			app: this.app,
			method: 'del',
			path,
			headers,
			body
		});
	}

}


module.exports = SuperTester;
