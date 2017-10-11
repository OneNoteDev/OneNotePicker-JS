import '../node_modules/onenoteapi/target/oneNoteApi';

import {OneNoteDataProvider} from '../src/providers/oneNoteDataProvider';
import {Notebook} from '../src/oneNoteDataStructures/notebook';
import {Section} from '../src/oneNoteDataStructures/section';
import {SharedNotebookApiProperties} from '../src/oneNoteDataStructures/sharedNotebook';
import {Page} from '../src/oneNoteDataStructures/page';
import {SharedNotebook} from '../src/oneNoteDataStructures/sharedNotebook';
import {OneNoteApiResponseTransformer} from '../src/oneNoteDataStructures/oneNoteApiResponseTransformer';

let mockResponse: OneNoteApi.ResponsePackage<any> = {
	parsedResponse: JSON.parse(`{
	"@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks","value":[
		{
			"id":"0-752C1AAF7737895C!482","self":"https://www.onenote.com/api/v1.0/me/notes/notebooks/0-752C1AAF7737895C!482","createdTime":"2016-06-20T22:01:19.8Z","name":"My Notebook","createdBy":"Me User","createdByIdentity":{
				"user":{
					"id":"752C1AAF7737895C","displayName":"Me User"
				}
			},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
				"user":{
					"id":"752C1AAF7737895C","displayName":"Me User"
				}
			},"lastModifiedTime":"2017-04-26T22:49:54.537Z","isDefault":false,"userRole":"Owner","isShared":true,"sectionsUrl":"https://www.onenote.com/api/v1.0/me/notes/notebooks/0-752C1AAF7737895C!482/sections","sectionGroupsUrl":"https://www.onenote.com/api/v1.0/me/notes/notebooks/0-752C1AAF7737895C!482/sectionGroups","links":{
				"oneNoteClientUrl":{
					"href":"onenote:https://d.docs.live.net/752c1aaf7737895c/%d7%9e%d7%a1%d7%9e%d7%9b%d7%99%d7%9d/My%20Notebook"
				},"oneNoteWebUrl":{
					"href":"https://onedrive.live.com/redir.aspx?cid=752c1aaf7737895c&page=edit&resid=752C1AAF7737895C!482&parId=752C1AAF7737895C!106"
				}
			},"sections@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('0-752C1AAF7737895C%21482')/sections","sections":[
				{
					"id":"0-752C1AAF7737895C!515","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!515","createdTime":"2016-07-25T23:00:39.217Z","name":"Auto Research","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2017-04-19T18:06:31.527Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!515/pages"
				},{
					"id":"0-752C1AAF7737895C!744","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!744","createdTime":"2017-01-20T20:26:36.73Z","name":"Fun","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2017-01-20T20:26:45.31Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!744/pages"
				},{
					"id":"0-752C1AAF7737895C!493","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!493","createdTime":"2016-06-20T22:04:14.91Z","name":"Home Decor","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2016-10-21T21:52:38.563Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!493/pages"
				},{
					"id":"0-752C1AAF7737895C!723","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!723","createdTime":"2016-12-12T18:47:06.027Z","name":"Quick Notes","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2017-04-10T21:43:57.923Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!723/pages"
				},{
					"id":"0-752C1AAF7737895C!491","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!491","createdTime":"2016-06-20T22:03:47.17Z","name":"Recipes","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2016-06-20T22:06:49.72Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!491/pages"
				},{
					"id":"0-752C1AAF7737895C!494","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!494","createdTime":"2016-06-20T22:05:05.877Z","name":"Shopping","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2016-06-20T22:06:03.477Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!494/pages"
				}
			],"sectionGroups@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('0-752C1AAF7737895C%21482')/sectionGroups","sectionGroups":[
				{
					"id":"0-752C1AAF7737895C!496","self":"https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-752C1AAF7737895C!496","createdTime":"2016-06-20T22:06:17.963Z","name":"College","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2017-04-26T22:49:54.537Z","sectionsUrl":"https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-752C1AAF7737895C!496/sections","sectionGroupsUrl":"https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-752C1AAF7737895C!496/sectionGroups","sections@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('0-752C1AAF7737895C%21482')/sectionGroups('0-752C1AAF7737895C%21496')/sections","sections":[
						{
							"id":"0-752C1AAF7737895C!498","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!498","createdTime":"2016-06-20T22:06:24.997Z","name":"Applications","createdBy":"Me User","createdByIdentity":{
								"user":{
									"id":"752C1AAF7737895C","displayName":"Me User"
								}
							},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
								"user":{
									"id":"752C1AAF7737895C","displayName":"Me User"
								}
							},"lastModifiedTime":"2016-06-20T22:06:49.86Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!498/pages"
						},{
							"id":"0-752C1AAF7737895C!492","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!492","createdTime":"2016-06-20T22:03:52.91Z","name":"Information","createdBy":"Me User","createdByIdentity":{
								"user":{
									"id":"752C1AAF7737895C","displayName":"Me User"
								}
							},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
								"user":{
									"id":"752C1AAF7737895C","displayName":"Me User"
								}
							},"lastModifiedTime":"2016-06-20T22:07:15.31Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!492/pages"
						},{
							"id":"0-752C1AAF7737895C!759","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!759","createdTime":"2017-04-05T22:54:04.74Z","name":"Password Protected","createdBy":"Me User","createdByIdentity":{
								"user":{
									"id":"752C1AAF7737895C","displayName":"Me User"
								}
							},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
								"user":{
									"id":"752C1AAF7737895C","displayName":"Me User"
								}
							},"lastModifiedTime":"2017-04-05T22:54:09.397Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!759/pages"
						}
					],"sectionGroups@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('0-752C1AAF7737895C%21482')/sectionGroups('0-752C1AAF7737895C%21496')/sectionGroups","sectionGroups":[
						{
							"id":"0-752C1AAF7737895C!761","self":"https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-752C1AAF7737895C!761","createdTime":"2017-04-26T22:48:44.97Z","name":"Another Group","createdBy":"Me User","createdByIdentity":{
								"user":{
									"id":"752C1AAF7737895C","displayName":"Me User"
								}
							},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
								"user":{
									"id":"752C1AAF7737895C","displayName":"Me User"
								}
							},"lastModifiedTime":"2017-04-26T22:49:54.537Z","sectionsUrl":"https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-752C1AAF7737895C!761/sections","sectionGroupsUrl":"https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-752C1AAF7737895C!761/sectionGroups","sections@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('0-752C1AAF7737895C%21482')/sectionGroups('0-752C1AAF7737895C%21496')/sectionGroups('0-752C1AAF7737895C%21761')/sections","sections":[],"sectionGroups@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('0-752C1AAF7737895C%21482')/sectionGroups('0-752C1AAF7737895C%21496')/sectionGroups('0-752C1AAF7737895C%21761')/sectionGroups","sectionGroups":[]
						}
					]
				}
			]
		},{
			"id":"0-752C1AAF7737895C!486","self":"https://www.onenote.com/api/v1.0/me/notes/notebooks/0-752C1AAF7737895C!486","createdTime":"2016-06-20T22:02:47.65Z","name":"Sports","createdBy":"Me User","createdByIdentity":{
				"user":{
					"id":"752C1AAF7737895C","displayName":"Me User"
				}
			},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
				"user":{
					"id":"752C1AAF7737895C","displayName":"Me User"
				}
			},"lastModifiedTime":"2016-09-23T21:29:53.737Z","isDefault":false,"userRole":"Owner","isShared":true,"sectionsUrl":"https://www.onenote.com/api/v1.0/me/notes/notebooks/0-752C1AAF7737895C!486/sections","sectionGroupsUrl":"https://www.onenote.com/api/v1.0/me/notes/notebooks/0-752C1AAF7737895C!486/sectionGroups","links":{
				"oneNoteClientUrl":{
					"href":"onenote:https://d.docs.live.net/752c1aaf7737895c/%d7%9e%d7%a1%d7%9e%d7%9b%d7%99%d7%9d/Sports"
				},"oneNoteWebUrl":{
					"href":"https://onedrive.live.com/redir.aspx?cid=752c1aaf7737895c&page=edit&resid=752C1AAF7737895C!486&parId=752C1AAF7737895C!106"
				}
			},"sections@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('0-752C1AAF7737895C%21486')/sections","sections":[
				{
					"id":"0-752C1AAF7737895C!490","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!490","createdTime":"2016-06-20T22:03:08.077Z","name":"Articles","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2016-09-22T23:01:42.81Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!490/pages"
				},{
					"id":"0-752C1AAF7737895C!488","self":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!488","createdTime":"2016-06-20T22:02:52.393Z","name":"Quick Notes","createdBy":"Me User","createdByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedBy":"Me User","lastModifiedByIdentity":{
						"user":{
							"id":"752C1AAF7737895C","displayName":"Me User"
						}
					},"lastModifiedTime":"2016-09-23T21:29:53.737Z","isDefault":false,"pagesUrl":"https://www.onenote.com/api/v1.0/me/notes/sections/0-752C1AAF7737895C!488/pages"
				}
			],"sectionGroups@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('0-752C1AAF7737895C%21486')/sectionGroups","sectionGroups":[
				
			]
		}
	]
}`),
	request: new XMLHttpRequest()
};

export class SampleOneNoteDataProvider implements OneNoteDataProvider {
	getNotebooks(expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<Notebook[]> {
		let responseTransformer = new OneNoteApiResponseTransformer();
		let notebooks = responseTransformer.transformNotebooks(mockResponse.parsedResponse.value);
		return Promise.resolve(notebooks);
	}

	getPages(section: Section): Promise<Page[]> {
		let id = '' + (Math.floor(Math.random() * 500000));
		let pages = [{parent: section, id: id, name: 'Page:' + id, apiUrl: ''}];
		return Promise.resolve(pages);
	}

	getSpNotebookProperties(spNotebook: SharedNotebook, expands?: number, excludeReadOnlyNotebooks?: boolean): Promise<SharedNotebookApiProperties> {
		return Promise.resolve({
			id: '',
			sectionGroups: [],
			sections: [],
			spSectionGroups: [],
			spSections: []
		});
	}
}
