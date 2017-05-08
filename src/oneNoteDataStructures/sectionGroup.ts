import Section from './section';

interface SectionGroup {
	id: string;
	name: string;
	expanded: boolean;
	sectionGroups: SectionGroup[];
	sections: Section[];
}

export default SectionGroup;
