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

	// TODO (machiam) I added these here so I won't have to implement in API project

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

	getSpNotebookProperties(spNotebook: SharedNotebook, expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<SharedNotebookApiProperties> {
		return this.getSiteIds(spNotebook.apiUrl).then((ids) => {
			let { siteId, siteCollectionId } = ids;
			return this.getSpNotebookPropertiesUsingSiteIds(spNotebook, siteId, siteCollectionId);
		}).catch((err) => {
			console.log(JSON.stringify(err));
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

		return new Promise<{ siteId: string, siteCollectionId: string }>((resolve, reject) => {
			for (let i = 0; i < candidateSiteUrls.length; i++) {
				let xhr = new XMLHttpRequest();
				
				if (this.timeout) {
					xhr.timeout = this.timeout;
				}

				xhr.open('GET', `https://www.onenote.com/api/v1.0/myOrganization/siteCollections/FromUrl(url='${encodeURI(candidateSiteUrls[i])}')`);

				xhr.onload = () => {
					let responseJson = xhr.response && JSON.parse(xhr.response);
					if (responseJson && responseJson.siteId && responseJson.siteCollectionId) {
						resolve({ siteId: responseJson.siteId, siteCollectionId: responseJson.siteCollectionId });
					}
				};

				xhr.onerror = () => {
					reject();
				};
	
				xhr.ontimeout = () => {
					reject();
				};

				xhr.setRequestHeader('Authorization', this.authHeader);

				if (this.headers) {
					for (let key in this.headers) {
						if (this.headers.hasOwnProperty(key)) {
							xhr.setRequestHeader(key, this.headers[key]);
						}
					}
				}

				xhr.send();
			}
		});
	}

	private getSpNotebookPropertiesUsingSiteIds(spNotebook: SharedNotebook, siteId: string, siteCollectionId: string): Promise<SharedNotebookApiProperties> {
		const nameFilterQuery = spNotebook.name ? `&$filter=name%20eq%20'${encodeURIComponent(spNotebook.name)}'` : '';
		const url = `https://www.onenote.com/api/v1.0/myOrganization/siteCollections/${siteCollectionId}/sites/${siteId}/notes/notebooks?$expand=sections,sectionGroups($expand=sections,sectionGroups)` + nameFilterQuery;

		return new Promise<SharedNotebookApiProperties>((resolve, reject) => {
			let xhr = new XMLHttpRequest();

			xhr.open('GET', url);

			xhr.onload = () => {
				// TODO (machiam) do additional filtering on the link, right now we just select the first item
				let responseJson = xhr.response && JSON.parse(xhr.response);
				if (responseJson && responseJson.value) {
					let firstNotebook = responseJson.value[0];

					// TODO (machiam) Fill in missing values. I think this is already done?
					spNotebook.id = firstNotebook.id;

					// TODO (machiam) do sectionGroups too
					let spSections = firstNotebook.sections.map(section => this.responseTransformer.transformSpSection(section, spNotebook, siteId, siteCollectionId));
					resolve({
						id: firstNotebook.id,
						spSectionGroups: [],
						spSections: spSections
					});
				}
			};

			xhr.onerror = () => {
				reject();
			};

			xhr.ontimeout = () => {
				reject();
			};

			xhr.setRequestHeader('Authorization', this.authHeader);

			if (this.headers) {
				for (let key in this.headers) {
					if (this.headers.hasOwnProperty(key)) {
						xhr.setRequestHeader(key, this.headers[key]);
					}
				}
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
			candidates.push(protocol + segmentsExcludingProtocol.slice(0, i).join('/'));
		}
		return candidates;
	}
}
