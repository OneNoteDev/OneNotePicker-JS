import OneNoteItem from './oneNoteItem';
import Section from './section';

interface SectionGroup extends OneNoteItem {
	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
}

export default SectionGroup;
