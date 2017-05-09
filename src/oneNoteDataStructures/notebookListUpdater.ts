import Notebook from './notebook';
import SectionGroup from './sectionGroup';
import Section from './section';
import Page from './page';

type SectionParent = Notebook | SectionGroup;

/**
 * Responsible for updating the notebook list object in a controlled manner.
 * In particular, preserves expanded state. There is no guarantee that the
 * internal notebook list object * will be modified or replaced. Logic relying
 * on this class should use the getter as the most recent source of truth.
 */
class NotebookListUpdater {
	private notebooks: Notebook[];

	constructor(initialNotebooks: Notebook[]) {
		this.notebooks = initialNotebooks;
	}

	/**
	 * Gets the notebook list
	 */
	get(): Notebook[] {
		return this.notebooks;
	}

	/**
	 * Updates the internal notebooks with a more recent version of the notebooks,
	 * returned from the API.
	 * @param apiNotebooks The API notebooks to update the internal notebooks with.
	 */
	updateNotebookList(newNotebooks: Notebook[]) {
		let oldNotebooks = this.notebooks;
		this.notebooks = newNotebooks;

		if (oldNotebooks.length === 0) {
			return;
		}

		// TODO cut down on repeat code after we have UTs
		for (let newNotebook of newNotebooks) {
			let originalNotebook = NotebookListUpdater.find(oldNotebooks, notebook => notebook.id === newNotebook.id);
			if (!!originalNotebook) {
				this.preserveSectionParent(originalNotebook, newNotebook);
			}
		}
	}

	// TODO use polyfill or move this to some sort of util class
	private static find<T>(list: T[], predicate: (item: T) => boolean): T | void
	{
		for (let item of list)
		{
			if (predicate(item))
				return item;
		}
		return undefined;
	}

	private preserveSectionParent(original: SectionParent, next: SectionParent) {
		// Preserve properties we want to keep from the original object ...
		next.expanded = original.expanded;

		// ... then recurse through the children
		for (let newSectionGroup of next.sectionGroups) {
			let originalSectionGroup = NotebookListUpdater.find(original.sectionGroups, sg => sg.id === newSectionGroup.id);
			if (!!originalSectionGroup) {
				this.preserveSectionParent(originalSectionGroup, newSectionGroup);
			}
		}
		
		// TODO cut down on repeat code after we have UTs
		for (let newSection of next.sections) {
			let originalSection = NotebookListUpdater.find(original.sections, section => section.id === newSection.id);
			if (!!originalSection) {
				newSection.expanded = originalSection.expanded;
			}
		}
	}

	/**
	 * Updates the internal notebooks' section with a more recent version of its
	 * sections.
	 * @param parentSectionId Parent section id.
	 * @param apiPages The API pages to update the internal notebooks' matching section with.
	 */
	updatePages(parentSectionId: string, newPages: Page[]) {
		if (!this.notebooks) {
			return;
		}

		let sectionRef = this.getSectionRefFromNotebooks(parentSectionId, this.notebooks);
		if (!sectionRef) {
			return;
		}

		sectionRef.pages = newPages;
	}

	private getSectionRefFromNotebooks(sectionId: string, notebooks: Notebook[]): Section | void {
		for (let notebook of notebooks) {
			let sectionRef = this.getSectionRefFromSectionParent(sectionId, notebook);
			if (!!sectionRef) {
				return sectionRef;
			}
		}

		// We couldn't find the section in this subtree
		return undefined;
	}

	private getSectionRefFromSectionParent(sectionId: string, sectionParent: SectionParent): Section | void {
		// Search this parent's sections for the matching id ...
		for (let childSection of sectionParent.sections) {
			if (childSection.id === sectionId) {
				return childSection;
			}
		}

		// ... then recurse through section groups
		for (let childSectionParent of sectionParent.sectionGroups) {
			let sectionRef = this.getSectionRefFromSectionParent(sectionId, childSectionParent);
			if (!!sectionRef) {
				return sectionRef;
			}
		}

		// We couldn't find the section in this subtree
		return undefined;
	}
}

export default NotebookListUpdater;