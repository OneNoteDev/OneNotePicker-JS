import OneNoteItem from './oneNoteItem';
import Section from './section';
import SectionGroup from './sectionGroup';

interface Notebook extends OneNoteItem {
	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
}

export default Notebook;
