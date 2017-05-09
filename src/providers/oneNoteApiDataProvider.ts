import OneNoteDataProvider from './oneNoteDataProvider';
import Notebook from '../oneNoteDataStructures/notebook';
import OneNoteApiResponseTransformer from '../oneNoteDataStructures/oneNoteApiResponseTransformer';
import Page from '../oneNoteDataStructures/page';

/**
 * Implements OneNoteDataProvider with external calls to OneNote's API.
 */
export class OneNoteApiDataProvider implements OneNoteDataProvider {
	private api: OneNoteApi.IOneNoteApi;
	private responseTransformer: OneNoteApiResponseTransformer;

	constructor(authToken: string) {
		this.api = new OneNoteApi.OneNoteApi(authToken);
		this.responseTransformer = new OneNoteApiResponseTransformer();
	}

	getNotebooks(): Promise<Notebook[]> {
		return this.api.getNotebooks().then((responsePackage) => {
			return Promise.resolve(this.responseTransformer.transformNotebooks(responsePackage.parsedResponse));
		});
	}

	getPages(sectionId: string): Promise<Page[]> {
		return this.api.getPages({ sectionId: sectionId }).then((responsePackage) => {
			return Promise.resolve(this.responseTransformer.transformPages(responsePackage.parsedResponse));
		});
	}
}

export default OneNoteApiDataProvider;
