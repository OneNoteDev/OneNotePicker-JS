import {OneNoteItem} from './oneNoteItem';
import {Page} from './page';

export interface Section extends OneNoteItem {
	expanded: boolean;
	pages: Page[] | undefined;
}
