import { Notebook } from '../oneNoteDataStructures/notebook';
import { SectionGroup } from '../oneNoteDataStructures/sectionGroup';
import { Section } from '../oneNoteDataStructures/section';
import { SharedNotebookApiProperties } from '../oneNoteDataStructures/sharedNotebook';
import { Page } from '../oneNoteDataStructures/page';
import { SharedNotebook } from '../oneNoteDataStructures/sharedNotebook';

/**
 * Exposes calls to fetch OneNote data structures.
 */
export interface OneNoteDataProvider {
	createNotebook(name: string): Promise<Notebook>;
	createSectionUnderNotebook(parent: Notebook, name: string): Promise<Section>;
	createSectionUnderSectionGroup(parent: SectionGroup, name: string): Promise<Section>;

	getNotebooks(expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<Notebook[]>;
	getPages(section: Section): Promise<Page[]>;

	getSpNotebooks(): Promise<SharedNotebook[]>;
	getSpNotebookProperties(spNotebook: SharedNotebook, expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<SharedNotebookApiProperties | undefined>;
}
