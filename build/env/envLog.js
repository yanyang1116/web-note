// Do this as the first thing so that any code reading it knows the right env.
const { NODE_ENV, DEPLOY_ENV, PUBLIC_URL } = process.env;

// 这个可以记一下，打印完整的一行分隔符
const line = '-'.repeat(process.stdout.columns);

module.exports = function () {
	console.log(line);
	console.log('NODE_ENV', NODE_ENV);
	console.log('DEPLOY_ENV', DEPLOY_ENV);
	console.log('PUBLIC_URL', PUBLIC_URL);
	console.log(line);
};
