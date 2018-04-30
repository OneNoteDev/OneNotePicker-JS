import { Notebook } from './notebook';
import { OneNoteItem } from './oneNoteItem';
import { Section } from './section';
import { SectionGroup } from './sectionGroup';
import { Polyfills } from '../polyfills';

Polyfills.find();

export type notebookOrSectionGroup = Notebook | SectionGroup;
export type SectionPathElement = notebookOrSectionGroup | Section;

export class OneNoteItemUtils {
	/**
	 * Given the id of the OneNoteItem, and a notebook or sectionGroup list, returns
	 * the OneNoteItem in the hierarchy that has the same id, or undefined
	 * if it can't be found.
	 */
	static find(sectionParents: (Notebook | SectionGroup)[], predicate: (item: OneNoteItem) => boolean): OneNoteItem | undefined {
		let findResult: OneNoteItem | undefined = sectionParents.find(predicate);
		if (!!findResult) {
			return findResult;
		}

		for (let i = 0; i < sectionParents.length; i++) {
			findResult = OneNoteItemUtils.find(sectionParents[i].sectionGroups, predicate);
			if (!!findResult) {
				return findResult;
			}

			findResult = OneNoteItemUtils.findInSections(sectionParents[i].sections, predicate);
			if (!!findResult) {
				return findResult;
			}
		}

		return undefined;
	}

	/**
	 * Given the id of the OneNoteItem, and a section list, returns the OneNoteItem in
	 * the hierarchy that has the same id, or undefined if it can't be found.
	 */
	static findInSections(sections: Section[], predicate: (item: OneNoteItem) => boolean): OneNoteItem | undefined {
		let findResult: OneNoteItem | undefined = sections.find(predicate);
		if (!!findResult) {
			return findResult;
		}

		for (let i = 0; i < sections.length; i++) {
			const pages = sections[i].pages;
			if (!!pages) {
				findResult = pages.find(predicate);
				if (!!findResult) {
					return findResult;
				}
			}
		}

		return undefined;
	}

	/**
	 * Given a predicate and a notebook hierarchy, expands to the first item that
	 * satisfies the predicate if it exists in the hierarchy.
	 */
	static expandTo(notebooks: Notebook[], predicate: (item: OneNoteItem) => boolean) {
		const item = OneNoteItemUtils.find(notebooks, predicate);
		if (!!item) {
			const ancestry = OneNoteItemUtils.getAncestry(item);
			for (let i = 0; i < ancestry.length - 1; i++) {
				// We know everything until the last item has to be one of these three types, regardless
				// of the item itself, as they have to be parents
				const expandable = ancestry[i] as Notebook | SectionGroup | Section;
				expandable.expanded = true;
			}
		}
	}

	/**
	 * Performs a depth-first traversal on the item, pruning any of its child section groups
	 * if they do not have a descendent section, and returning true if this item has at least
	 * one descendent section; false otherwise.
	 */
	static prune(root: Notebook | SectionGroup): boolean {
		root.sectionGroups = root.sectionGroups.filter(OneNoteItemUtils.prune);
		return root.sectionGroups.length > 0 || root.sections.length > 0;
	}

	/**
	 * Given a OneNote item, returns a list representing the item's
	 * ancestry, starting from the root notebook.
	 */
	static getAncestry(item: OneNoteItem): OneNoteItem[] {
		let current = item;

		const ancestry = [current];
		while (!!current.parent) {
			current = current.parent;
			ancestry.unshift(current);
		}

		return ancestry;
	}
	
	/**
	 * Finds the maximum depth of notebooks list, including sections
	 */
	static getDepthOfNotebooks(notebooks: Notebook[]): number {
		if (!notebooks || notebooks.length === 0) {
			return 0;
		}
		return notebooks.map((notebook) => this.getDepthOfParent(notebook)).reduce((d1, d2) => Math.max(d1, d2));
	}

	/** 
	 * Finds the maximum depth of SectionGroup or Notebook, 
	 * includes the number of sections below it 
	 */
	private static getDepthOfParent(parent: notebookOrSectionGroup ): number {
		if (!parent) {
			return 0;
		}

		let containsAtLeastOneSection = parent.sections && parent.sections.length > 0;
		let maxDepth = containsAtLeastOneSection ? 1 : 0;

		if (parent.sectionGroups) {
			for (let i = 0; i < parent.sectionGroups.length; i++) {
				maxDepth = Math.max(this.getDepthOfParent(parent.sectionGroups[i]), maxDepth);
			}
		}

		// Include the parent itself
		return maxDepth + 1;
	}
}

export * from './oneNoteApiResponseTransformer';
