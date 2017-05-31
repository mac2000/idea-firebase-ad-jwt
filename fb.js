const admin = require('firebase-admin')
const fs = require('fs')

const config = fs.existsSync('S:/config.json')
	? 'S:/config.json'
	: fs.existsSync('D:/home/site/config.json')
		? 'D:/home/site/config.json'
		:'./secret/config.json'

const serviceAccount = require(config)

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
