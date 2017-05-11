import OneNoteItem from './oneNoteItem';
import Page from './page';

interface Section extends OneNoteItem {
	expanded: boolean;
	pages: Page[] | undefined;
}

export default Section;
