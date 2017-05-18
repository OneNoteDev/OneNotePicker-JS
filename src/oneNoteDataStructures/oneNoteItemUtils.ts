import {OneNoteItem} from './oneNoteItem';

export class OneNoteItemUtils {
	/**
	 * Given a OneNote item, returns a list representing the item's
	 * ancestry, starting from the root notebook.
	 */
	static getAncestry(item: OneNoteItem): OneNoteItem[] {
		let current = item;

		let ancestry = [current];
		while (!!current.parent) {
			current = current.parent;
			ancestry.unshift(current);
		}

		return ancestry;
	}
}
