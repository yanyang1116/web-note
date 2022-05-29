// Do this as the first thing so that any code reading it knows the right env.
const { NODE_ENV, DEPLOY_ENV, PUBLIC_URL } = process.env

module.exports = function () {
	console.log('-'.repeat(42))
	console.log('NODE_ENV', NODE_ENV)
	console.log('DEPLOY_ENV', DEPLOY_ENV)
	console.log('PUBLIC_URL', PUBLIC_URL)
	console.log('-'.repeat(42))
}
