import {Notebook} from '../oneNoteDataStructures/notebook';
import {Section} from '../oneNoteDataStructures/section';
import {Page} from '../oneNoteDataStructures/page';

/**
 * Exposes calls to fetch OneNote data structures.
 */
export interface OneNoteDataProvider {
	getNotebooks(expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<Notebook[]>;
	getPages(section: Section): Promise<Page[]>;
}
