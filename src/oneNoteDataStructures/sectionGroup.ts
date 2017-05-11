import OneNoteChildItem from './oneNoteChildItem';
import Notebook from './notebook';
import Section from './section';

interface SectionGroup extends OneNoteChildItem<Notebook | SectionGroup> {
	parent: Notebook | SectionGroup;
	id: string;
	name: string;
	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
}

export default SectionGroup;
