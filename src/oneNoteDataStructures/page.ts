import OneNoteChildItem from './oneNoteChildItem';
import Section from './section';

interface Page extends OneNoteChildItem<Section> {
	parent: Section;
	id: string;
	title: string;
}

export default Page;
