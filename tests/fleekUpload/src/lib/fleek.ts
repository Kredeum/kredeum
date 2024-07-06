import {
	ApplicationAccessTokenService,
	// PersonalAccessTokenService,
	FleekSdk
} from '@fleek-platform/sdk';

const fleek = (() => {
	const token = new ApplicationAccessTokenService({
		clientId: ''
	});
	// const token = new PersonalAccessTokenService({
	// 	projectId: '',
	// 	personalAccessToken: ''
	// });

	const sdk = new FleekSdk({
		accessTokenService: token
	});

	const projects = async () => await sdk.projects().list();

	// const project = await sdk.projects().get({
	//   id: '',
	// });
	// const result = await sdk.storage().list();
	// const result = await sdk.storage().uploadFile({
	//   file,
	//   onUploadProgress,
	// });

	return { projects };
})();

export { fleek };
