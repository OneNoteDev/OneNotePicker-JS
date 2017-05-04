import OneNoteDataProvider from './oneNoteDataProvider';

/**
 * Implements OneNoteDataProvider with external calls to OneNote's API.
 */
export class OneNoteApiDataProvider implements OneNoteDataProvider {
	public getNotebooks(): Promise<OneNoteApi.Notebook[]> {
		return Promise.resolve([]);
	}

	public getPages(sectionId: string): Promise<OneNoteApi.Page[]> {
		return Promise.resolve([]);
	}
}

export default OneNoteApiDataProvider;
