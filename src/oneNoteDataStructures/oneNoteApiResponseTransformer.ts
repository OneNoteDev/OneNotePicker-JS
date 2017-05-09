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
		return {
			id: notebook.id,
			name: notebook.name,
			expanded: this.defaultExpanded,
			sectionGroups: notebook.sectionGroups.map(sg => this.transformSectionGroup(sg)),
			sections: notebook.sections.map(section => this.transformSection(section))
		}
	}

	transformSectionGroup(sectionGroup: OneNoteApi.SectionGroup): SectionGroup {
		return {
			id: sectionGroup.id,
			name: sectionGroup.name,
			expanded: this.defaultExpanded,
			sectionGroups: sectionGroup.sectionGroups.map(sg => this.transformSectionGroup(sg)),
			sections: sectionGroup.sections.map(section => this.transformSection(section))
		}
	}

	transformSection(section: OneNoteApi.Section): Section {
		// Pages may be undefined (e.g., in the getNotebooks call)
		return {
			id: section.id,
			name: section.name,
			expanded: this.defaultExpanded,
			pages: !!section.pages ? section.pages.map(page => this.transformPage(page)) : undefined
		}
	}

	transformPages(pageList: OneNoteApi.Page[]): Page[] {
		return pageList.map(page => this.transformPage(page));
	}

	transformPage(page: OneNoteApi.Page): Page {
		return {
			id: page.id,
			title: page.title
		};
	}
}

export default OneNoteApiResponseTransformer;
