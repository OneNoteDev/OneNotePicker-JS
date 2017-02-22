/// <reference path="../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />

import {Polyfills} from "../scripts/polyfills";
import {Status} from "../scripts/status";
import {OneNotePickerDefaultWrapperProps} from "../scripts/UI/components/oneNotePickerDefaultWrapperComponent";
import {OneNotePickerProps} from "../scripts/UI/components/oneNotePickerComponent";
import {NotebookListProps} from "../scripts/UI/components/notebookListComponent";
import {PopupProps} from "../scripts/UI/components/oneNotePickerPopupComponent";
import {SectionInfo} from "../scripts/UI/components/oneNotePickerComponent";
import {SectionProps} from "../scripts/UI/components/sectionComponent";

Polyfills.init();

/**
 * Common functions required across multiple test files
 */
export module HelperFunctions {
	export function getBaseFileName(path: string): string {
		return path.split("/").pop().split(".")[0];
	}

	export function getFixture(): Element {
		return document.getElementById("qunit-fixture");
	}

	/**
	 * NotebookList
	 * - Clipper Test (Notebook)
	 *   - Full Page (Section)
	 *   - Pdfs (Section)
	 * - Clipper Test 2 (Notebook)
	 *   - Section X (Section)
	 *   - Section Y (Section)
	 */
	function getMockNotebooks(): OneNoteApi.Notebook[] {
		return [{
			isDefault: true,
			userRole: "Owner",
			isShared: false,
			sectionsUrl: "https://www.onenote.com/api/v1.0/me/notes/notebooks/0-EB15C30446636CBE!18732/sections",
			sectionGroupsUrl: "https://www.onenote.com/api/v1.0/me/notes/notebooks/0-EB15C30446636CBE!18732/sectionGroups",
			links: {
				oneNoteClientUrl: {
					href: "onenote:https://d.docs.live.net/eb15c30446636cbe/Documents/Clipper%20Test"
				},
				oneNoteWebUrl: {
					href: "https://onedrive.live.com/redir.aspx?cid=eb15c30446636cbe&page=edit&resid=EB15C30446636CBE!18732&parId=EB15C30446636CBE!105"
				}
			},
			name: "Clipper Test",
			createdBy: "Matthew Chiam",
			lastModifiedBy: "Matthew Chiam",
			lastModifiedTime: new Date("Mon Feb 22 2016"),
			id: "0-EB15C30446636CBE!18732",
			self: "https://www.onenote.com/api/v1.0/me/notes/notebooks/0-EB15C30446636CBE!18732",
			createdTime: new Date("Mon Feb 22 2016"),
			sections: [{
				isDefault: true,
				pagesUrl: "https://www.onenote.com/api/v1.0/me/notes/sections/0-EB15C30446636CBE!18742/pages",
				name: "Full Page",
				createdBy: "Matthew Chiam",
				lastModifiedBy: "Matthew Chiam",
				lastModifiedTime: new Date("Tue Feb 23 2016"),
				id: "0-EB15C30446636CBE!18742",
				self: "https://www.onenote.com/api/v1.0/me/notes/sections/0-EB15C30446636CBE!18742",
				createdTime: new Date("Tue Feb 23 2016"),
				pages: []
			}, {
				isDefault: false,
				pagesUrl: "https://www.onenote.com/api/v1.0/me/notes/sections/0-EB15C30446636CBE!18738/pages",
				name: "Pdfs",
				createdBy: "Matthew Chiam",
				lastModifiedBy: "Matthew Chiam",
				lastModifiedTime: new Date("Tue Feb 23 2016"),
				id: "0-EB15C30446636CBE!18738",
				self: "https://www.onenote.com/api/v1.0/me/notes/sections/0-EB15C30446636CBE!18738",
				createdTime: new Date("Tue Feb 23 2016"),
				pages: []
			}],
			sectionGroups: []
		}, {
			isDefault: false,
			userRole: "Owner",
			isShared: false,
			sectionsUrl: "https://www.onenote.com/api/v1.0/me/notes/notebooks/a-bc!d/sections",
			sectionGroupsUrl: "https://www.onenote.com/api/v1.0/me/notes/notebooks/a-bc!d/sectionGroups",
			links: {
				oneNoteClientUrl: {
					href: "onenote:https://d.docs.live.net/bc/Documents/Clipper%20Test%202"
				},
				oneNoteWebUrl: {
					href: "https://onedrive.live.com/redir.aspx?cid=bc&page=edit&resid=bc!d&parId=bc!d"
				}
			},
			name: "Clipper Test 2",
			createdBy: "Matthew Chiam",
			lastModifiedBy: "Matthew Chiam",
			lastModifiedTime: new Date("Mon Feb 22 2016"),
			id: "a-bc!d",
			self: "https://www.onenote.com/api/v1.0/me/notes/notebooks/abcd",
			createdTime: new Date("Mon Feb 22 2016"),
			sections: [{
				isDefault: false,
				pagesUrl: "https://www.onenote.com/api/v1.0/me/notes/sections/1234/pages",
				name: "Section X",
				createdBy: "Matthew Chiam",
				lastModifiedBy: "Matthew Chiam",
				lastModifiedTime: new Date("Tue Feb 23 2016"),
				id: "1234",
				self: "https://www.onenote.com/api/v1.0/me/notes/sections/1234",
				createdTime: new Date("Tue Feb 23 2016"),
				pages: []
			}, {
				isDefault: false,
				pagesUrl: "https://www.onenote.com/api/v1.0/me/notes/sections/5678/pages",
				name: "Section Y",
				createdBy: "Matthew Chiam",
				lastModifiedBy: "Matthew Chiam",
				lastModifiedTime: new Date("Tue Feb 23 2016"),
				id: "5678",
				self: "https://www.onenote.com/api/v1.0/me/notes/sections/5678",
				createdTime: new Date("Tue Feb 23 2016"),
				pages: []
			}],
			sectionGroups: []
		}];
	}

	export function getMockNotebookListProps(): NotebookListProps {
		return {
			curSectionId: "0-EB15C30446636CBE!18742", // matches first section of the first notebook
			notebooks: getMockNotebooks(),
			onSectionClicked: (section: SectionInfo) => {
			},
			rowTabIndex: 51
		};
	}

	/**
	 * NotebookList
	 * - Clipper Test (Notebook)
	 *   - Full Page (Section)
	 *   - Pdfs (Section)
	 * - Clipper Test 2 (Notebook)
	 *   - Outer Section Group (Section Group)
	 *     - Child of Outer (Section)
	 *   - Section X (Section)
	 *   - Section Y (Section)
	 */
	export function getMockNotebookListPropsWithSectionGroups(): NotebookListProps {
		let notebooks = getMockNotebooks();
		notebooks[1].sectionGroups = [{
			createdBy: "Matthew Chiam",
			createdTime: new Date("2016-03-14T21:26:53.313Z"),
			id: "0-EB15C30446636CBE!18818",
			lastModifiedBy: "Matthew Chiam",
			lastModifiedTime: new Date("2016-03-14T23:08:14.21Z"),
			name: "Outer Section Group",
			sectionGroups: [],
			sectionGroupsUrl: "https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-EB15C30446636CBE!18818/sectionGroups",
			sections: [{
				isDefault: false,
				pagesUrl: "https://www.onenote.com/api/v1.0/me/notes/sections/0-EB15C30446636CBE!18818/pages",
				name: "Child of Outer",
				createdBy: "Matthew Chiam",
				lastModifiedBy: "Matthew Chiam",
				lastModifiedTime: new Date("Tue Mar 15 2016"),
				id: "0-EB15C30446636CBE!18745",
				self: "https://www.onenote.com/api/v1.0/me/notes/sections/0-EB15C30446636CBE!18818",
				createdTime: new Date("Tue Mar 15 2016"),
				pages: []
			}],
			sectionsUrl: "https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-EB15C30446636CBE!18818/sections",
			self: "https://www.onenote.com/api/v1.0/me/notes/sectionGroups/0-EB15C30446636CBE!18818"
		}];
		return {
			curSectionId: "0-EB15C30446636CBE!18745", // matches first section of the first section group of the second notebook
			notebooks: notebooks,
			onSectionClicked: (section: SectionProps) => {
			},
			rowTabIndex: 51
		};
	}

	/**
	 * NotebookList
	 * - Clipper Test (Notebook)
	 *   - Full Page (Section)
	 *   - Pdfs (Section)
	 * - Clipper Test 2 (Notebook)
	 *   - Outer Section Group (Section Group)
	 *     - Undefined section groups
	 *     - Child of Outer (Section)
	 *   - Section X (Section)
	 *   - Section Y (Section)
	 */
	export function getMockNotebookListPropsWithUndefinedSectionGroups(): NotebookListProps {
		let props = getMockNotebookListPropsWithSectionGroups();
		props.notebooks[1].sectionGroups[0].sectionGroups = undefined;
		return props;
	}

	export function getMockOneNotePickerDefaultWrapperProps(): OneNotePickerDefaultWrapperProps {
		let mockNotebooks = getMockNotebooks();
		let parentNotebook = mockNotebooks[0];
		let defaultSection = parentNotebook.sections[0];
		let initialSectionProp = {
			initialSection: {
				section: defaultSection,
				path: parentNotebook.name + " > " + defaultSection.name,
				parentId: parentNotebook.id,
				selectedSection: true,
				onSectionClicked: (section) => {
				}
			}
		};

		let mockOneNotePickerProps = getMockOneNotePickerProps();
		return mergeObjects(mockOneNotePickerProps, initialSectionProp) as OneNotePickerDefaultWrapperProps;
	}

	export function getMockPopupProps(): PopupProps {
		return {
			notebooks: getMockNotebooks(),
			status: Status.Succeeded,
			onSectionClicked: (sectionInfo: SectionInfo) => {
			},
			curSectionId: "0-EB15C30446636CBE!18742",
			noNotebooksFound: "You do not have any notebooks yet. We will create a default notebook for you when you clip this page.",
			notebookLoadFailureMessage: "OneNote was unable to load your notebooks. Please try again later.",
			rowTabIndex: 51
		};
	}

	export function mergeObjects(obj1: {}, obj2: {}): {} {
		let merged = {};
		for (let key in obj1) {
			merged[key] = obj1[key];
		}
		for (let key in obj2) {
			merged[key] = obj2[key];
		}
		return merged;
	}

	export function getMockOneNotePickerProps(): OneNotePickerProps {
		return {
			notebooks: getMockNotebooks(),
			status: "Succeeded",
			onPopupToggle: (visibility: boolean) => {
			},
			onSectionClicked: (section: SectionProps) => {
			},
			textToDisplay: "Clipper Test > Full Page",
			curSectionId: "0-EB15C30446636CBE!18742", // matches first section of the first notebook
			localizedStrings: {
				defaultLocation: "Default location",
				loadingNotebooks: "Loading notebooks...",
				noNotebooksFound: "You do not have any notebooks yet. We will create a default notebook for you when you clip this page.",
				notebookLoadFailureMessage: "OneNote was unable to load your notebooks. Please try again later."
			},
			tabIndex: 50
		};
	}

	export function mountToFixture(component): any {
		let fixture = HelperFunctions.getFixture();
		let controllerInstance = m.mount(fixture, component);
		m.redraw(true);
		return controllerInstance;
	}

	export function simulateAction(action: () => void) {
		action();
		m.redraw(true);
	}
}
