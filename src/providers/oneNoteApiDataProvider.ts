import OneNoteDataProvider from './oneNoteDataProvider';
import Notebook from '../oneNoteDataStructures/notebook';
import Page from '../oneNoteDataStructures/page';

/**
 * Implements OneNoteDataProvider with external calls to OneNote's API.
 */
export class OneNoteApiDataProvider implements OneNoteDataProvider {
	private api: OneNoteApi.IOneNoteApi;

	constructor(authToken: string) {
		this.api = new OneNoteApi.OneNoteApi(authToken);
	}

	getNotebooks(): Promise<Notebook[]> {
		// TODO, call API, then transform
		return Promise.resolve([]);
	}

	getPages(sectionId: string): Promise<Page[]> {
		// TODO, call API, then transform
		let pages = [{ id: 'id', title: 'Page!' }];
		return Promise.resolve(pages);
	}
}

export default OneNoteApiDataProvider;
