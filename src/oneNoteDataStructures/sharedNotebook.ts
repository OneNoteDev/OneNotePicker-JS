import {OneNoteItem} from './oneNoteItem';
import {Notebook} from './notebook';
import {SpSection} from './spSection';
import {SpSectionGroup} from './spSectionGroup';

/**
 * Represents a notebook that has been made known through
 * the API's GetRecentNotebooks endpoint.
 */
// TODO (machiam) These have some overlaps with the parent
export interface SharedNotebook extends Notebook {
	parent: OneNoteItem | undefined;

	// Properties that need to be loaded-on-demand
	apiProperties?: SharedNotebookApiProperties;

	// Properties returned from GetRecentNotebooks
	name: string;
	sourceService: 'OneDriveForBusiness' | 'OneDrive' | 'OnPremOneDriveForBusiness' | 'Unknown';
}

export interface SharedNotebookApiProperties {
	id: string;
	spSectionGroups: SpSectionGroup[];
	spSections: SpSection[];
}
