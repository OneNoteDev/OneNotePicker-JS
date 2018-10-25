import { OneNoteItem } from './oneNoteItem';
import { Page } from './page';

export interface Section extends OneNoteItem {
	expanded: boolean;
	pages: Page[] | undefined;
	apiUrl: string;
	webUrl?: string;
	clientUrl?: string;
	isRecentSection?: boolean;
	parentNotebookName?: string;
}
