import {OneNoteItem} from './oneNoteItem';
import {Section} from './section';
import {SectionGroup} from './sectionGroup';

export interface Notebook extends OneNoteItem {
	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
	webUrl: string;
	apiUrl: string;
}
