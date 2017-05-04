import OneNoteDataProvider from './oneNoteDataProvider';

/**
 * Implements OneNoteDataProvider with external calls to OneNote's API.
 */
export class OneNoteApiDataProvider implements OneNoteDataProvider {
	private authToken: string;

	constructor(authToken: string) {
		this.authToken = authToken;
	}

	getNotebooks(): Promise<OneNoteApi.Notebook[]> {
		return Promise.resolve([]);
	}

	getPages(sectionId: string): Promise<OneNoteApi.Page[]> {
		return Promise.resolve([]);
	}
}

export default OneNoteApiDataProvider;
