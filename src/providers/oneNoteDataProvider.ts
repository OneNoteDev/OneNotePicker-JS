import {Notebook} from '../oneNoteDataStructures/notebook';
import {Section} from '../oneNoteDataStructures/section';
import {SharedNotebookApiProperties} from '../oneNoteDataStructures/sharedNotebook';
import {Page} from '../oneNoteDataStructures/page';
import {SharedNotebook} from '../oneNoteDataStructures/sharedNotebook';

/**
 * Exposes calls to fetch OneNote data structures.
 */
export interface OneNoteDataProvider {
	getNotebooks(expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<Notebook[]>;
	getPages(section: Section): Promise<Page[]>;

	getSpNotebooks(): Promise<SharedNotebook[]>;
	getSpNotebookProperties(spNotebook: SharedNotebook, expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<SharedNotebookApiProperties>;
}
