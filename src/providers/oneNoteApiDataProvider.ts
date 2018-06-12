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
	private api: OneNoteApi.OneNoteApi;
	private responseTransformer: OneNoteApiResponseTransformer;

	constructor(private authHeader: string, private timeout?: number, private headers?: { [key: string]: string }) {
		this.api = new OneNoteApi.OneNoteApi(authHeader, timeout, headers);
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

	// TODO (machiam) I added SharePoint functionality here so I won't have to implement in API project

	getSpNotebooks(): Promise<SharedNotebook[]> {
		// TODO (machiam) move this to OneNoteApi project
		return this.http('GET', `https://www.onenote.com/api/v1.0/me/notes/notebooks/getrecentnotebooks(includePersonalNotebooks=false)`, this.authHeader, this.headers).then((xhr: XMLHttpRequest) => {
			// tslint:disable-next-line:no-any
			const parsedResponse: any = xhr.response && JSON.parse(xhr.response);
			if (xhr.status !== 200 || !parsedResponse || !parsedResponse.value) {
				return Promise.resolve([]);
			}

			// tslint:disable-next-line:no-any
			const serviceSharedNotebooks: any[] = parsedResponse.value;

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
						apiUrl: ''
					});
				}
			}

			sharedNotebooks.sort((a, b) => {
				var nameA = a.name.toUpperCase();
				var nameB = b.name.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});

			return Promise.resolve(sharedNotebooks);
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
		return new Promise<SharedNotebookApiProperties>((resolve, reject) => {
			this.getNotebookSelfUrlFromSpUrl(spNotebook.webUrl).then((selfUrl) => {
				this.http('GET', selfUrl + '?' + this.getExpands(expands), this.authHeader, this.headers).then((xhr) => {
					const notebook: OneNoteApi.Notebook = xhr.response && JSON.parse(xhr.response);
					if (notebook) {
						spNotebook.apiUrl = notebook.self;
						const spSections = notebook.sections.map(section => this.responseTransformer.transformSection(section, spNotebook));
						const spSectionGroups = notebook.sectionGroups.map(sectionGroup => this.responseTransformer.transformSectionGroup(sectionGroup, spNotebook));
						resolve({
							id: notebook.id,
							spSectionGroups: spSectionGroups,
							spSections: spSections
						});
						return;
					}
					reject(xhr);
				});
			}).catch((xhr) => {
				reject(xhr);
			});
		});
	}

	private getNotebookSelfUrlFromSpUrl(spNotebookUrl: string): Promise<string> {
		const url = `https://www.onenote.com/api/beta/me/notes/notebooks/GetNotebooksFromWebUrls()`;
		const headers = {};

		if (this.headers) {
			for (let key in this.headers) {
				if (this.headers.hasOwnProperty(key)) {
					headers[key] = this.headers[key];
				}
			}
		}
		headers['Content-Type'] = 'application/json';

		return new Promise<string>((resolve, reject) => {
			this.http('POST', url, this.authHeader, headers, JSON.stringify({ webUrls: [spNotebookUrl] })).then((xhr) => {
				const responseJson = xhr.response && JSON.parse(xhr.response);
				if (responseJson && responseJson.value) {
					const notebooks = responseJson.value;
					const notebook: OneNoteApi.Notebook = notebooks[0].Notebook;
					if (notebook && notebook.self) {
						resolve(notebook.self);
						return;
					}
				}
				reject(xhr);
			}).catch((xhr) => {
				reject(xhr);
			});
		});
	}

	private getExpands(expands?: number): string {
		if (!expands || expands <= 0) {
			return '';
		}
		const s = '$expand=sections,sectionGroups';
		return expands === 1 ? s : `${s}(${this.getExpands(expands - 1)})`;
	}

	// tslint:disable-next-line:no-any
	private http(method: string, url: string, authHeader: string, headers?: { [key: string]: string }, body?: any): Promise<XMLHttpRequest> {
		return new Promise<XMLHttpRequest>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method, url);

			xhr.onload = () => {
				if (xhr.status < 200 || xhr.status > 299) {
					reject(xhr);
					return;
				}
				resolve(xhr);
			};

			xhr.onerror = () => {
				reject(xhr);
			};

			xhr.ontimeout = () => {
				reject(xhr);
			};

			xhr.setRequestHeader('Authorization', this.authHeader);

			if (headers) {
				for (let key in headers) {
					if (headers.hasOwnProperty(key)) {
						xhr.setRequestHeader(key, headers[key]);
					}
				}
			}

			if (this.timeout) {
				xhr.timeout = this.timeout;
			}

			xhr.send(body);
		});
	}
}
