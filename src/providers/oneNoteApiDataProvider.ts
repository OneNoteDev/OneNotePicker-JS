import OneNoteDataProvider from './oneNoteDataProvider';
import Notebook from '../oneNoteDataStructures/notebook';
import OneNoteApiResponseTransformer from '../oneNoteDataStructures/oneNoteApiResponseTransformer';
import Section from '../oneNoteDataStructures/section';
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

	getPages(section: Section): Promise<Page[]> {
		return this.api.getPages({ sectionId: section.id }).then((responsePackage) => {
			return Promise.resolve(this.responseTransformer.transformPages(responsePackage.parsedResponse, section));
		});
	}
}

export default OneNoteApiDataProvider;
