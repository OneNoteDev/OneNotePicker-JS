import * as OneNoteApi from '../../node_modules/onenoteapi/target/oneNoteApi';

import { Notebook } from './notebook';
import { SectionGroup } from './sectionGroup';
import { Section } from './section';
import { Page } from './page';

/**
 * Provides methods to transform data structures to equivalent data
 * structures used by the OneNotePicker.
 */
export class OneNoteApiResponseTransformer {
	private defaultExpanded: boolean = false;

	transformNotebooks(notebookList: OneNoteApi.Notebook[]): Notebook[] {
		return notebookList.map(notebook => this.transformNotebook(notebook));
	}

	transformNotebook(notebook: OneNoteApi.Notebook): Notebook {
		var transformed: Notebook = {
			parent: undefined,
			id: notebook.id,
			name: notebook.name,
			expanded: this.defaultExpanded,
			sectionGroups: [],
			sections: [],
			apiUrl: notebook.self,
			// tslint:disable-next-line:no-any
			webUrl: (notebook.links as any).oneNoteWebUrl.href
		};

		transformed.sectionGroups = notebook.sectionGroups ? notebook.sectionGroups.map(sg => this.transformSectionGroup(sg, transformed)) : [];
		transformed.sections = notebook.sections ? notebook.sections.map(section => this.transformSection(section, transformed)) : [];

		return transformed;
	}

	transformSectionGroup(sectionGroup: OneNoteApi.SectionGroup, parent: Notebook | SectionGroup): SectionGroup {
		var transformed: SectionGroup = {
			parent: parent,
			id: sectionGroup.id,
			name: sectionGroup.name,
			expanded: this.defaultExpanded,
			sectionGroups: [],
			sections: [],
			apiUrl: sectionGroup.self,
		};

		transformed.sectionGroups = sectionGroup.sectionGroups ? sectionGroup.sectionGroups.map(sg => this.transformSectionGroup(sg, transformed)) : [];
		transformed.sections = sectionGroup.sections ? sectionGroup.sections.map(section => this.transformSection(section, transformed)) : [];

		return transformed;
	}

	transformSection(section: OneNoteApi.Section, parent: Notebook | SectionGroup): Section {
		// Pages may be undefined (e.g., in the getNotebooks call)
		// tslint:disable-next-line:no-any
		var sectionAsAny = section as any;
		var transformed: Section = {
			parent: parent,
			id: section.id,
			name: section.name,
			expanded: this.defaultExpanded,
			pages: [],
			apiUrl: section.self,
			webUrl: sectionAsAny && sectionAsAny.links && sectionAsAny.links.oneNoteWebUrl && sectionAsAny.links.oneNoteWebUrl.href as string || undefined,
			clientUrl: sectionAsAny && sectionAsAny.links && sectionAsAny.links.oneNoteClientUrl && sectionAsAny.links.oneNoteClientUrl.href as string || undefined
		};

		transformed.pages = !!section.pages ? section.pages.map(page => this.transformPage(page, transformed)) : undefined;

		return transformed;
	}

	transformPages(pageList: OneNoteApi.Page[], parent: Section): Page[] {
		return pageList.map(page => this.transformPage(page, parent));
	}

	transformPage(page: OneNoteApi.Page, parent: Section): Page {
		return {
			parent: parent,
			id: page.id,
			name: page.title,
			apiUrl: page.self,
			webUrl: page.links.oneNoteWebUrl.href
		};
	}
}
