import { Notebook } from './notebook';
import { SectionGroup } from './sectionGroup';
import { Section } from './section';
import { Page } from './page';
import { OneNoteItemUtils } from './oneNoteItemUtils';

type SectionParent = Notebook | SectionGroup;

/**
 * Responsible for updating the notebook list object in a controlled manner.
 * In particular, preserves expanded state. There is no guarantee that the
 * internal notebook list object * will be modified or replaced. Logic relying
 * on this class should use the getter as the most recent source of truth.
 */
export class NotebookListUpdater {
	// TODO (machiam) Currently we don't support updating shared notebooks the react way
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
		const oldNotebooks = this.notebooks;
		this.notebooks = newNotebooks;

		if (oldNotebooks.length === 0) {
			return;
		}

		// TODO (machiam) cut down on repeat code after we have UTs
		for (let newNotebook of newNotebooks) {
			const originalNotebook = oldNotebooks.find(notebook => notebook.id === newNotebook.id);
			if (!!originalNotebook) {
				this.preserveSectionParent(originalNotebook, newNotebook);
			}
		}
	}

	addNotebook(newNotebook: Notebook) {
		// Always prepend
		const newNotebooks = [newNotebook, ...this.notebooks];
		this.notebooks = newNotebooks;
	}

	addSection(newSection: Section) {
		const loneParent = newSection.parent!;
		const parentInHierarchy = OneNoteItemUtils.find(this.notebooks, item => item.id === loneParent.id) as SectionParent | undefined;
		if (parentInHierarchy && parentInHierarchy.sections) {
			// Establish two-way reference
			parentInHierarchy.sections = [newSection, ...parentInHierarchy.sections];
			newSection.parent = parentInHierarchy;
		}
	}

	private preserveSectionParent(original: SectionParent, next: SectionParent) {
		// Preserve properties we want to keep from the original object ...
		next.expanded = original.expanded;

		if (!original.sections || !original.sectionGroups || 
			!next.sections || !next.sectionGroups) {
			return;
		}

		// ... then recurse through the children
		for (let newSectionGroup of next.sectionGroups) {
			const originalSectionGroup = original.sectionGroups.find(sg => sg.id === newSectionGroup.id);
			if (!!originalSectionGroup) {
				this.preserveSectionParent(originalSectionGroup, newSectionGroup);
			}
		}

		// TODO (machiam) cut down on repeat code after we have UTs
		for (let newSection of next.sections) {
			const originalSection = original.sections.find(section => section.id === newSection.id);
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

		const sectionRef = this.getSectionRefFromNotebooks(parentSectionId, this.notebooks);
		if (!sectionRef) {
			return;
		}

		sectionRef.pages = newPages;
	}

	private getSectionRefFromNotebooks(sectionId: string, notebooks: Notebook[]): Section | undefined {
		for (let notebook of notebooks) {
			const sectionRef = this.getSectionRefFromSectionParent(sectionId, notebook);
			if (!!sectionRef) {
				return sectionRef;
			}
		}

		// We couldn't find the section in this subtree
		return undefined;
	}

	private getSectionRefFromSectionParent(sectionId: string, sectionParent: SectionParent): Section | undefined {
		if (!sectionParent.sections || !sectionParent.sectionGroups) {
			return undefined;
		}
		
		// Search this parent's sections for the matching id ...
		for (let childSection of sectionParent.sections) {
			if (childSection.id === sectionId) {
				return childSection;
			}
		}

		// ... then recurse through section groups
		for (let childSectionParent of sectionParent.sectionGroups) {
			const sectionRef = this.getSectionRefFromSectionParent(sectionId, childSectionParent);
			if (!!sectionRef) {
				return sectionRef;
			}
		}

		// We couldn't find the section in this subtree
		return undefined;
	}
}
