import Notebook from './notebook';
import SectionGroup from './sectionGroup';
import Page from './page';

interface Section {
	parent: Notebook | SectionGroup;
	id: string;
	name: string;
	expanded: boolean;
	pages: Page[] | undefined;
}

export default Section;
