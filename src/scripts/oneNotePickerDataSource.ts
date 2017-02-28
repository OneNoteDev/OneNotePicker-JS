export class OneNotePickerDataSource {
	authToken: string;

	private maxExpandedSections = 4;

	constructor(authToken: string) {
		this.authToken = authToken;
	}

	getNotebooks(headers?: { [key: string]: string }): Promise<any> {
		let api = new OneNoteApi.OneNoteApi(this.authToken, undefined /* timeout */, headers);

		return new Promise<any>((resolve, reject) => {
			api.getNotebooksWithExpandedSections(this.maxExpandedSections).then((responsePackage: OneNoteApi.ResponsePackage<any>) => {
				let notebooks: OneNoteApi.Notebook[] = responsePackage.parsedResponse.value;
				responsePackage.parsedResponse = notebooks;
				resolve(responsePackage);
			}, (failure) => {
				reject(failure);
			});
		});

	}
}
