import { Notebook } from './notebook';
import { Section } from './section';
import { SectionGroup } from './sectionGroup';

/**
 * Represents a notebook that has been made known through
 * the API's GetRecentNotebooks endpoint.
 */
export interface SharedNotebook extends Notebook {
	// Properties that need to be loaded-on-demand
	apiProperties?: SharedNotebookApiProperties;
	apiHttpErrorCode?: number;
	startedLoading?: boolean;

	// Properties returned from GetRecentNotebooks
	sourceService: 'OneDriveForBusiness' | 'OneDrive' | 'OnPremOneDriveForBusiness' | 'Unknown';
}

export interface SharedNotebookApiProperties {
	id: string;
	spSectionGroups: SectionGroup[];
	spSections: Section[];
}
