import Notebook from './notebook';
import SectionGroup from './sectionGroup';
import Section from './section';
import Page from './page';

/**
 * Provides methods to transform data structures to equivalent data
 * structures used by the OneNotePicker.
 */
class OneNoteApiResponseTransformer {
	private defaultExpanded: boolean = false;

	transformNotebooks(notebookList: OneNoteApi.Notebook[]): Notebook[] {
		return notebookList.map(notebook => this.transformNotebook(notebook));
	}

	transformNotebook(notebook: OneNoteApi.Notebook): Notebook {
		var transformed = {
			id: notebook.id,
			name: notebook.name,
			expanded: this.defaultExpanded,
			sectionGroups: notebook.sectionGroups.map(sg => this.transformSectionGroup(sg, transformed)),
			sections: notebook.sections.map(section => this.transformSection(section, transformed))
		};

		return transformed;
	}

	transformSectionGroup(sectionGroup: OneNoteApi.SectionGroup, parent: Notebook | SectionGroup): SectionGroup {
		var transformed = {
			parent: parent,
			id: sectionGroup.id,
			name: sectionGroup.name,
			expanded: this.defaultExpanded,
			sectionGroups: sectionGroup.sectionGroups.map(sg => this.transformSectionGroup(sg, transformed)),
			sections: sectionGroup.sections.map(section => this.transformSection(section, transformed))
		};

		return transformed;
	}

	transformSection(section: OneNoteApi.Section, parent: Notebook | SectionGroup): Section {
		// Pages may be undefined (e.g., in the getNotebooks call)
		var transformed = {
			parent: parent,
			id: section.id,
			name: section.name,
			expanded: this.defaultExpanded,
			pages: !!section.pages ? section.pages.map(page => this.transformPage(page, transformed)) : undefined
		};

		return transformed;
	}

	transformPages(pageList: OneNoteApi.Page[], parent: Section): Page[] {
		return pageList.map(page => this.transformPage(page, parent));
	}

	transformPage(page: OneNoteApi.Page, parent: Section): Page {
		return {
			parent: parent,
			id: page.id,
			name: page.title
		};
	}
}

export default OneNoteApiResponseTransformer;
