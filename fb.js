const admin = require('firebase-admin')
const fs = require('fs')

const config = fs.existsSync('S:/config.json') ? 'S:/config.json' : './secret/config.json'

const serviceAccount = fs.existsSync(config) ? require(config) : {
	type: 'service_account',
	project_id: process.env.project_id,
	private_key_id: process.env.private_key_id,
	private_key: process.env.private_key,
	client_email: process.env.client_email,
	client_id: process.env.client_id,
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://accounts.google.com/o/oauth2/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url: process.env.client_x509_cert_url,
}

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})

const createUser = user => admin.auth().createUser({
	uid: user.uid,
	email: user.email,
	displayName: user.displayName,
	emailVerified: true,
	password: Math.random().toString(36).slice(-8)
})

const updateUser = user => admin.auth().updateUser(user.uid, {
	email: user.email,
	displayName: user.displayName,
	emailVerified: true
})

const ensureUser = user => admin.auth().getUser(user.uid)
	.then(() => updateUser(user))
	.catch(() => createUser(user))

const ensureProfile = user => admin.database().ref(`users/${user.uid}`).set({
	email: user.email,
	displayName: user.displayName,
	groups: user.groups
})

const generateToken = user => {
	const {uid, email, displayName, groups} = user
	return admin.auth().createCustomToken(uid, {email, displayName, groups})
}

const token = (req, res, next) => {
	const {user} = req

	ensureUser(user)
		.then(() => ensureProfile(user)
			.then(() => generateToken(user)
				.then(token => {
					req.token = token
					next()
				})))
		.catch(err => res.status(401).send(err))
}

module.exports = {
	token
}
