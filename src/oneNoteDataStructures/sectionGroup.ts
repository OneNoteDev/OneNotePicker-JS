import {OneNoteItem} from './oneNoteItem';
import {Section} from './section';

export interface SectionGroup extends OneNoteItem {
	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
	apiUrl: string;
}
