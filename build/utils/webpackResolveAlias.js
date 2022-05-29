const { appRootPathResolve } = require('./pathResolve');

export default {
	'@/api/': appRootPathResolve('./src/api/'),
	'@/assets/': appRootPathResolve('./src/assets/'),
	'@/const/': appRootPathResolve('./src/const/'),
	'@/hooks/': appRootPathResolve('./src/hooks/'),
	'@/store/': appRootPathResolve('./src/store/'),
	'@/utils/': appRootPathResolve('./src/utils/'),
	'@/views/': appRootPathResolve('./src/views/'),
	'@/': appRootPathResolve('./src/'),
	'@/typing/': appRootPathResolve('./typing/'),
};
