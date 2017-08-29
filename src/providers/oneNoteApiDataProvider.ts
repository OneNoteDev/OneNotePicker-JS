import {OneNoteDataProvider} from './oneNoteDataProvider';
import {Notebook} from '../oneNoteDataStructures/notebook';
import {OneNoteApiResponseTransformer} from '../oneNoteDataStructures/oneNoteApiResponseTransformer';
import {Section} from '../oneNoteDataStructures/section';
import {Page} from '../oneNoteDataStructures/page';

/**
 * Implements OneNoteDataProvider with external calls to OneNote's API.
 */
export class OneNoteApiDataProvider implements OneNoteDataProvider {
	private api: OneNoteApi.IOneNoteApi;
	private responseTransformer: OneNoteApiResponseTransformer;

	constructor(authHeader: string, timeout?: number, headers?: { [key: string]: string }) {
		this.api = new OneNoteApi.OneNoteApi(authHeader, timeout, headers);
		this.responseTransformer = new OneNoteApiResponseTransformer();
	}

	getNotebooks(expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<Notebook[]> {
		return this.api.getNotebooksWithExpandedSections(expands, excludeReadOnlyNotebooks).then((responsePackage) => {
			return Promise.resolve(this.responseTransformer.transformNotebooks(responsePackage.parsedResponse.value));
		});
	}

	getPages(section: Section): Promise<Page[]> {
		return this.api.getPages({sectionId: section.id}).then((responsePackage) => {
			return Promise.resolve(this.responseTransformer.transformPages(responsePackage.parsedResponse.value, section));
		});
	}
}
