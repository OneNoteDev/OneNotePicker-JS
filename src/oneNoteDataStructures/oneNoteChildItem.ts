import Notebook from './notebook';
import SectionGroup from './sectionGroup';
import Section from './section';

type Parent = Notebook | SectionGroup | Section;

interface OneNoteChildItem<T extends Parent> {
	parent: T;
	// getAncestry(): (Notebook | SectionGroup | Section)[];
}

export default OneNoteChildItem;
