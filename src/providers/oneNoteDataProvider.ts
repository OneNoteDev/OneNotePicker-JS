import Notebook from '../oneNoteDataStructures/notebook';
import Page from '../oneNoteDataStructures/page';

/**
 * Exposes calls to fetch OneNote data structures.
 */
interface OneNoteDataProvider {
	getNotebooks(): Promise<Notebook[]>;
	getPages(sectionId: string): Promise<Page[]>;
}

export default OneNoteDataProvider;
