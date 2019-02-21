import { OneNoteItem } from './oneNoteItem';
import { Section } from './section';
import { SectionGroup } from './sectionGroup';

export interface Notebook extends OneNoteItem {
	// Properties that need to be loaded-on-demand
	apiHttpErrorCode?: number;

	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
	webUrl: string;
	apiUrl?: string;
	lastModifiedTime: Date;
	needsToFetchChildren?: boolean
}
