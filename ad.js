const ldap = require('ldapjs')
const {InvalidCredentialsError} = require('ldapjs')

const url = process.env.LDAP_URL || 'ldap://192.168.5.2'
const domain = process.env.LDAP_DOMAIN || 'rabota'
const base = process.env.LDAP_BASE || 'dc=rabota,dc=local'

const getActiveDirectoryUser = (email, password) => new Promise((resolve, reject) => {
	try {
		email = (email || '').toLowerCase().trim()

		const username = email.split('@').shift().toLowerCase()
		const client = ldap.createClient({url})

		client.on('error', error => reject(error))

		client.bind(`${domain}\\${username}`, password, err => {
			if (err) {
				client.unbind()
				return reject(err instanceof InvalidCredentialsError ? {message: 'invalid credentials'} : err)
			}

			client.search(base, {filter: `(mail=${email})`, scope: 'sub'}, (err, res) => {
				if (err) {
					client.unbind()
					return reject(err)
				}

				let found = false

				res.on('searchEntry', ({object: {name, memberOf}}) => {
					const groups = memberOf.map(dn => dn.split(',').shift().split('=').pop())
					found = true
					return resolve({
						email,
						groups,
						displayName: name,
						uid: username
					})
				})
				res.on('error', err => {
					client.unbind()
					return reject(err)
				})
				res.on('end', () => {
					client.unbind()
					if (!found) {
						reject({message: 'not found'})
					}
				})
			})
		})
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
		.catch(err => {
			console.log('getActiveDirectoryUser', err)
			res.status(401).json(err)
		})
}

module.exports = {
	authenticate
}
