import {OneNoteDataProvider} from './oneNoteDataProvider';
import {Notebook} from '../oneNoteDataStructures/notebook';
import {OneNoteApiResponseTransformer} from '../oneNoteDataStructures/oneNoteApiResponseTransformer';
import {Section} from '../oneNoteDataStructures/section';
import {SharedNotebookApiProperties} from '../oneNoteDataStructures/sharedNotebook';
import {Page} from '../oneNoteDataStructures/page';
import {SharedNotebook} from '../oneNoteDataStructures/sharedNotebook';

/**
 * Implements OneNoteDataProvider with external calls to OneNote's API.
 */
export class OneNoteApiDataProvider implements OneNoteDataProvider {
	private api: OneNoteApi.OneNoteApi;
	private responseTransformer: OneNoteApiResponseTransformer;

	// Caching used by getSharedNotebook
	private siteUrlToIds: {
		[siteUrl: string]: {
			siteId: string;
			siteCollectionId: string;	
		};
	};

	constructor(private authHeader: string, private timeout?: number, private headers?: { [key: string]: string }) {
		this.api = new OneNoteApi.OneNoteApi(authHeader, timeout, headers);
		this.responseTransformer = new OneNoteApiResponseTransformer();
		this.siteUrlToIds = {};
	}

	getNotebooks(expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<Notebook[]> {
		return this.api.getNotebooksWithExpandedSections(expands, excludeReadOnlyNotebooks).then((responsePackage: OneNoteApi.ResponsePackage<any>) => {
			return Promise.resolve(this.responseTransformer.transformNotebooks(responsePackage.parsedResponse.value));
		});
	}

	getPages(section: Section): Promise<Page[]> {
		return this.api.getPages({sectionId: section.id}).then((responsePackage: OneNoteApi.ResponsePackage<any>) => {
			return Promise.resolve(this.responseTransformer.transformPages(responsePackage.parsedResponse.value, section));
		});
	}

	// TODO (machiam) I added SharePoint functionality here so I won't have to implement in API project

	getSpNotebooks(): Promise<SharedNotebook[]> {
		// TODO (machiam) move this to OneNoteApi project
		return this.http('GET', `https://www.onenote.com/api/v1.0/me/notes/notebooks/getrecentnotebooks(includePersonalNotebooks=false)`, this.authHeader, this.headers).then((xhr: XMLHttpRequest) => {
			let parsedResponse: any = xhr.response && JSON.parse(xhr.response);
			if (xhr.status !== 200 || !parsedResponse || !parsedResponse.value) {
				return Promise.resolve([]);
			}

			let serviceSharedNotebooks: any[] = parsedResponse.value;

			let sharedNotebooks: SharedNotebook[] = [];
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

	private isOdbNotebook(notebook: any): boolean {
		if (notebook.sourceService === 'OneDriveForBusiness') {
			return true;
		}
		if (notebook.sourceService === 'Unknown') {
			let webUrl: string = notebook.links.oneNoteWebUrl.href;
			let segments = webUrl.split('/');
			if (segments.length > 2) {
				// This is somewhat naive, but we want to filter out ppe and live
				let domain = segments[2];
				return domain.indexOf('.spoppe.') < 0 && domain !== 'd.docs.live.net';
			}
		}
		return false;
	}

	private getSharedNotebookName(sharedNotebook): string {
		let name: string = sharedNotebook.name;
		let webUrl: string = sharedNotebook.links && sharedNotebook.links.oneNoteWebUrl && sharedNotebook.links.oneNoteWebUrl.href;

		if (!name && !webUrl) {
			return '';
		}

		// We infer the name from the URL if name is not provided
		if (!name && webUrl) {
			const urlParts = webUrl.match(/([^\/]*)\/*$/);
			if (urlParts && urlParts.length === 2) {
				name = urlParts[1];
				name = decodeURI(name);
			}
		}

		let trimmedName = name && name.trim();
		if (trimmedName) {
			return trimmedName;
		}

		// We guess that the last url part is the name
		let splitUrl = webUrl.split('/');
		let last = splitUrl[splitUrl.length - 1];
		return decodeURIComponent(last);
	}

	getSpNotebookProperties(spNotebook: SharedNotebook, expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<SharedNotebookApiProperties | undefined> {
		// These both return an array of XMLHttpRequest on the rejection case. The caller
		// can then decide which error is most significant.
		return this.getSiteIds(spNotebook.webUrl).then((ids) => {
			let { siteId, siteCollectionId } = ids;
			return this.getSpNotebookPropertiesUsingSiteIds(spNotebook, siteId, siteCollectionId, expands, excludeReadOnlyNotebooks);
		});
	}

	private getSiteIds(notebookUrl: string): Promise<{ siteId: string, siteCollectionId: string }> {
		const candidateSiteUrls = this.getCandidateSiteUrls(notebookUrl);

		for (let i = 0; i < candidateSiteUrls.length; i++) {
			const cachedSiteId = this.siteUrlToIds[candidateSiteUrls[0]];
			if (!!cachedSiteId) {
				return Promise.resolve(cachedSiteId);
			}
		}

		let promises: Promise<XMLHttpRequest>[] = [];
		for (let i = 0; i < candidateSiteUrls.length; i++) {
			// Since Promise.all fast-fails, we do this to ensure all run
			let promise = this.http('GET', `https://www.onenote.com/api/v1.0/myOrganization/siteCollections/FromUrl(url='${encodeURI(candidateSiteUrls[i])}')`, this.authHeader, this.headers).then((xhr) => {
				return Promise.resolve(xhr);
			}).catch((xhr) => {
				return Promise.resolve(xhr);
			});
			promises.push(promise);
		}

		return new Promise<{ siteId: string, siteCollectionId: string }>((resolve, reject) => {
			Promise.all(promises).then(xhrs => {
				for (let i = 0; i < xhrs.length; i++) {
					if (xhrs[i].status === 200) {
						let responseJson = xhrs[i].response && JSON.parse(xhrs[i].response);
						if (responseJson && responseJson.siteId && responseJson.siteCollectionId) {
							resolve({ siteId: responseJson.siteId, siteCollectionId: responseJson.siteCollectionId });
						}
					}
				}
				reject(xhrs);
			});
		});
	}

	private getSpNotebookPropertiesUsingSiteIds(spNotebook: SharedNotebook, siteId: string, siteCollectionId: string, expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<SharedNotebookApiProperties | undefined> {
		// Don't add a service-side name filter as the notebook name could have changed
		let url = `https://www.onenote.com/api/v1.0/myOrganization/siteCollections/${siteCollectionId}/sites/${siteId}/notes/notebooks`;
		url += `?${this.getExpands(expands)}`;

		return new Promise<SharedNotebookApiProperties>((resolve, reject) => {
			this.http('GET', url, this.authHeader, this.headers).then((xhr) => {
				let responseJson = xhr.response && JSON.parse(xhr.response);
				if (responseJson && responseJson.value) {
					// Even though we already filtered by name, it's very possible that there is another notebook with that name
					let notebooks: OneNoteApi.Notebook[] = responseJson.value;
					let matchingNotebook: OneNoteApi.Notebook | undefined = undefined;
					for (let i = 0; i < notebooks.length; i++) {
						if (spNotebook.webUrl === (notebooks[i].links as any).oneNoteWebUrl.href) {
							matchingNotebook = notebooks[i];
						}
					}

					if (!matchingNotebook) {
						resolve(undefined);
						return;
					}

					spNotebook.id = matchingNotebook.id;

					let spSections = matchingNotebook.sections.map(section => this.responseTransformer.transformSpSection(section, spNotebook, siteId, siteCollectionId));
					let spSectionGroups = matchingNotebook.sectionGroups.map(sectionGroup => this.responseTransformer.transformSpSectionGroup(sectionGroup, spNotebook, siteId, siteCollectionId));
					resolve({
						id: matchingNotebook.id,
						spSectionGroups: spSectionGroups,
						spSections: spSections
					});
					return;
				}
				reject([xhr]);
			}).catch((xhr) => {
				reject([xhr]);
			});
		});
	}

	private getExpands(expands?: number): string {
		if (!expands || expands <= 0) {
			return '';
		}
		let s = '$expand=sections,sectionGroups';
		return expands === 1 ? s : `${s}(${this.getExpands(expands - 1)})`;
	}

	private http(method: string, url: string, authHeader: string, headers?: { [key: string]: string }): Promise<XMLHttpRequest> {
		return new Promise<XMLHttpRequest>((resolve, reject) => {
			let xhr = new XMLHttpRequest();
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

			xhr.send();
		});
	}

	private getCandidateSiteUrls(notebookUrl: string): string[] {
		// https://stackoverflow.com/questions/6941533/get-protocol-domain-and-port-from-url
		const segments = notebookUrl.split('/');
		const protocol = segments[0] + '//';
		const segmentsExcludingProtocol = segments.slice(2);
		
		// We start from 2 instead of 1 as 1 will give us just the tenant url
		let candidates: string[] = [];
		for (let i = 2; i < segmentsExcludingProtocol.length; i++) {
			// We order this backwards to maximize precision
			candidates.unshift(protocol + segmentsExcludingProtocol.slice(0, i).join('/'));
		}
		return candidates;
	}
}
