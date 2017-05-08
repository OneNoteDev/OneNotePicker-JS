import Section from './section';
import SectionGroup from './sectionGroup';

interface Notebook {
	id: string;
	name: string;
	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
}

export default Notebook;
