const http = require('http')
const url = require('url')

const {hostname, port, path} = url.parse(process.env.AD || 'http://adjwt.rabota.ua:58083/token')

const decodeToken = token => {
	const data = token.split('.').splice(1, 1).shift().replace('-', '+').replace('_', '/')
	const json = new Buffer(data, 'base64').toString()
	return JSON.parse(json)
}

const getActiveDirectoryUser = (username, password) => new Promise((resolve, reject) => {
	try {
		username = (username || '').toLowerCase().trim()

		const body = JSON.stringify({username, password})

		const req = http.request({
			hostname,
			port,
			path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(body)
			}
		}, res => {
			let token = ''
			res.on('data', chunk => token += chunk)
			res.on('error', error => reject(error))
			res.on('end', () => {
				if (res.statusCode !== 200) {
					try {
						return reject(JSON.parse(token))
					}
					catch (ex) {
						return reject(token)
					}
				}
				const {email, role, given_name} = decodeToken(token)
				return resolve({
					email: email,
					groups: role,
					displayName: given_name,
					uid: username.split('@').shift()
				})
			})
		})

		req.end(body)
	} catch (err) {
		reject(err)
	}
})

const authenticate = (req, res, next) => {
	const {body: {username, password}} = req
	if (!username || !password) {
		return res.status(400).send({message: 'username and password required'})
	}

	if (!/[a-z]+@rabota.ua/.test(username)) {
		return res.status(400).send({message: 'username@rabota.ua username required'})
	}

	getActiveDirectoryUser(username, password)
		.then(user => {
			req.user = user
			next()
		})
		.catch(err => res.status(401).json(err))
}

module.exports = {
	authenticate
}
