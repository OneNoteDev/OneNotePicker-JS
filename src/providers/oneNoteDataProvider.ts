/**
 * Exposes calls to fetch OneNote data structures.
 */
interface OneNoteDataProvider {
	getNotebooks(): Promise<OneNoteApi.Notebook[]>;
	getPages(sectionId: string): Promise<OneNoteApi.Page[]>;
}

export default OneNoteDataProvider;
