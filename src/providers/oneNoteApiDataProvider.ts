import * as OneNoteApi from 'onenoteapi';

import { OneNoteDataProvider } from './oneNoteDataProvider';
import { Notebook } from '../oneNoteDataStructures/notebook';
import { OneNoteApiResponseTransformer } from '../oneNoteDataStructures/oneNoteApiResponseTransformer';
import { Section } from '../oneNoteDataStructures/section';
import { SectionGroup } from '../oneNoteDataStructures/sectionGroup';
import { SharedNotebookApiProperties } from '../oneNoteDataStructures/sharedNotebook';
import { Page } from '../oneNoteDataStructures/page';
import { SharedNotebook } from '../oneNoteDataStructures/sharedNotebook';

/**
 * Implements OneNoteDataProvider with external calls to OneNote's API.
 */
export class OneNoteApiDataProvider implements OneNoteDataProvider {
	private responseTransformer: OneNoteApiResponseTransformer;

	constructor(private api: OneNoteApi.OneNoteApi) {
		this.responseTransformer = new OneNoteApiResponseTransformer();
	}

	createNotebook(name: string): Promise<Notebook> {
		// tslint:disable-next-line:no-any
		return this.api.createNotebook(name).then((responsePackage: OneNoteApi.ResponsePackage<any>) => {
			return Promise.resolve(this.responseTransformer.transformNotebook(responsePackage.parsedResponse));
		});
	}

	createSectionUnderNotebook(parent: Notebook, name: string): Promise<Section> {
		// tslint:disable-next-line:no-any
		return this.api.createSection(parent.id, name).then((responsePackage: OneNoteApi.ResponsePackage<any>) => {
			return Promise.resolve(this.responseTransformer.transformSection(responsePackage.parsedResponse, parent));
		});
	}

	createSectionUnderSectionGroup(parent: SectionGroup, name: string): Promise<Section> {
		// tslint:disable-next-line:no-any
		return this.api.createSection(parent.id, name).then((responsePackage: OneNoteApi.ResponsePackage<any>) => {
			return Promise.resolve(this.responseTransformer.transformSection(responsePackage.parsedResponse, parent));
		});
	}

	getNotebooks(expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<Notebook[]> {
		// tslint:disable-next-line:no-any
		return this.api.getNotebooksWithExpandedSections(expands, excludeReadOnlyNotebooks).then((responsePackage: OneNoteApi.ResponsePackage<any>) => {
			return Promise.resolve(this.responseTransformer.transformNotebooks(responsePackage.parsedResponse.value));
		});
	}

	getPages(section: Section): Promise<Page[]> {
		// tslint:disable-next-line:no-any
		return this.api.getPages({ sectionId: section.id }).then((responsePackage: OneNoteApi.ResponsePackage<any>) => {
			return Promise.resolve(this.responseTransformer.transformPages(responsePackage.parsedResponse.value, section));
		});
	}

	getSpNotebooks(): Promise<SharedNotebook[]> {
		return this.api.performApiCall(`https://www.onenote.com/api/v1.0/me/notes/notebooks/getrecentnotebooks(includePersonalNotebooks=false)`, undefined /* data */, undefined /* content type */, 'GET' /* http method */, true /* isFullUrl */).then((response) => {
			// tslint:disable-next-line:no-any
			const serviceSharedNotebooks: any[] = response.parsedResponse.value;

			const sharedNotebooks: SharedNotebook[] = [];
			for (let i = 0; i < serviceSharedNotebooks.length; i++) {
				if (this.isOdbNotebook(serviceSharedNotebooks[i])) {
					sharedNotebooks.push({
						id: '',
						parent: undefined,
						name: this.getSharedNotebookName(serviceSharedNotebooks[i]),
						webUrl: serviceSharedNotebooks[i].links.oneNoteWebUrl.href,
						sourceService: serviceSharedNotebooks[i].sourceService,
						expanded: false,
						sections: [],
						sectionGroups: [],
						apiUrl: '',
						lastModifiedTime: serviceSharedNotebooks[i].lastAccessedTime
					});
				}
			}

			return sharedNotebooks;
		});
	}

	// tslint:disable-next-line:no-any
	private isOdbNotebook(notebook: any): boolean {
		if (notebook.sourceService === 'OneDriveForBusiness') {
			return true;
		}
		if (notebook.sourceService === 'Unknown') {
			const webUrl: string = notebook.links.oneNoteWebUrl.href;
			const segments = webUrl.split('/');
			if (segments.length > 2) {
				// This is somewhat naive, but we want to filter out ppe and live
				const domain = segments[2];
				return domain.indexOf('.spoppe.') < 0 && domain !== 'd.docs.live.net';
			}
		}
		return false;
	}

	private getSharedNotebookName(sharedNotebook): string {
		let name: string = sharedNotebook.name;
		const webUrl: string = sharedNotebook.links && sharedNotebook.links.oneNoteWebUrl && sharedNotebook.links.oneNoteWebUrl.href;

		if (!name && !webUrl) {
			return '';
		}

		// We infer the name from the URL if name is not provided
		if (!name && webUrl) {
			const urlParts = webUrl.split('/');

			// There might be a trailing slash we would like to account for. We pop twice. pop() returns undefined if array is empty
			const lastPart = urlParts.pop() || urlParts.pop();

			if (lastPart) {
				name = decodeURI(lastPart);
			}
		}

		const trimmedName = name && name.trim();
		if (trimmedName) {
			return trimmedName;
		}

		// We guess that the last url part is the name
		const splitUrl = webUrl.split('/');
		const last = splitUrl[splitUrl.length - 1];
		return decodeURIComponent(last);
	}

	getSpNotebookProperties(spNotebook: SharedNotebook, expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<SharedNotebookApiProperties> {
		return this.getNotebookSelfUrlFromSpUrl(spNotebook.webUrl).then((selfUrl) => {
			return this.api.performApiCall(selfUrl + '?' + this.getExpands(expands), undefined /* data */, undefined /* content type */, 'GET' /* http method */, true /* isFullUrl */).then(response => {
				const notebook: OneNoteApi.Notebook = response.parsedResponse;
				if (notebook) {
					spNotebook.apiUrl = notebook.self;
					const spSections = notebook.sections.map(section => this.responseTransformer.transformSection(section, spNotebook));
					const spSectionGroups = notebook.sectionGroups.map(sectionGroup => this.responseTransformer.transformSectionGroup(sectionGroup, spNotebook));
					return {
						id: notebook.id,
						spSectionGroups: spSectionGroups,
						spSections: spSections
					};
				}
				throw new Error('could not find notebook in get notebooks expands request');
			});
		});
	}

	private getNotebookSelfUrlFromSpUrl(spNotebookUrl: string): Promise<string> {
		const additionalHeaders = {};
		additionalHeaders['Content-Type'] = 'application/json';

		return this.api.performApiCall(`https://www.onenote.com/api/beta/me/notes/notebooks/GetNotebookFromWebUrl()`, JSON.stringify({ webUrl: spNotebookUrl }) /* data */, 'application/json' /* content type */, 'POST' /* http method */, true /* isFullUrl */).then(response => {
			const notebook: OneNoteApi.Notebook = response.parsedResponse;
			if (notebook && notebook.self) {
				return notebook.self;
			} else {
				throw new Error('Could not find notebook in GetNotebookFromWebUrl response!');
			}
		});
	}

	private getExpands(expands?: number): string {
		if (!expands || expands <= 0) {
			return '';
		}
		const s = '$expand=sections,sectionGroups';
		return expands === 1 ? s : `${s}(${this.getExpands(expands - 1)})`;
	}
}
