import { OneNoteItem } from './oneNoteItem';

export interface Page extends OneNoteItem {
	webUrl: string;
	apiUrl: string;
}
