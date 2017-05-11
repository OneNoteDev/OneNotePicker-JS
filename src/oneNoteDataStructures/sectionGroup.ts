import Notebook from './notebook';
import Section from './section';

interface SectionGroup {
	parent: Notebook | SectionGroup;
	id: string;
	name: string;
	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
}

export default SectionGroup;
