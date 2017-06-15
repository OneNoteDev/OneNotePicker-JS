import {Notebook} from './notebook';
import {SectionGroup} from './sectionGroup';

/**
 * Filters out section groups that do not have descendent sections by using a depth-first
 * pruning traversal.
 */
export class NotebookHierarchyFilter {
	/**
	 * Performs a depth-first traversal on the item, pruning any of its child section groups
	 * if they do not have a descendent section, and returning true if this item has at least
	 * one descendent section; false otherwise.
	 */
	static prune(root: Notebook | SectionGroup): boolean {
		root.sectionGroups = root.sectionGroups.filter(NotebookHierarchyFilter.prune);
		return root.sectionGroups.length > 0 || root.sections.length > 0;
	}
}
