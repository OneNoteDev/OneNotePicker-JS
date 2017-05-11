import Notebook from '../oneNoteDataStructures/notebook';
import Section from '../oneNoteDataStructures/section';
import Page from '../oneNoteDataStructures/page';

/**
 * Exposes calls to fetch OneNote data structures.
 */
interface OneNoteDataProvider {
	getNotebooks(): Promise<Notebook[]>;
	getPages(section: Section): Promise<Page[]>;
}

export default OneNoteDataProvider;
