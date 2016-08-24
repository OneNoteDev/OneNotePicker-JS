/// <reference path="../../../../typings/main/ambient/qunit/qunit.d.ts" />

import {HelperFunctions} from "../../helperFunctions";
import {Constants} from "../../../scripts/constants";
import {Status} from "../../../scripts/status";
import {OneNotePickerProps} from "../../../scripts/UI/components/oneNotePickerComponent";
import {OneNotePickerDefaultWrapperComponent, OneNotePickerDefaultWrapperProps} from "../../../scripts/UI/components/oneNotePickerDefaultWrapperComponent";

export module TestConstants {
	export module Classes {
		export var entityImageAndNameContainer = "EntityImageAndNameContainer";
		export var entityName = "EntityName";
		export var sectionLocation = "SectionLocation";
		export var sectionPickerPopup = "SectionPickerPopup";
		export var selectedSection = "SelectedSection";
	}
}

let mockOneNotePickerDefaultWrapperProps: OneNotePickerDefaultWrapperProps = HelperFunctions.getMockOneNotePickerDefaultWrapperProps();
let defaultComponent;
QUnit.module("oneNotePickerDefaultWrapperComponent", {
	beforeEach: () => {
		defaultComponent = <OneNotePickerDefaultWrapperComponent
			status={mockOneNotePickerDefaultWrapperProps.status}
			initialSection={mockOneNotePickerDefaultWrapperProps.initialSection}
			notebooks={mockOneNotePickerDefaultWrapperProps.notebooks}
			onPopupToggle={mockOneNotePickerDefaultWrapperProps.onPopupToggle}
			onSectionClicked={mockOneNotePickerDefaultWrapperProps.onSectionClicked}
			textToDisplay={mockOneNotePickerDefaultWrapperProps.textToDisplay}
			curSectionId={mockOneNotePickerDefaultWrapperProps.curSectionId}
			localizedStrings={mockOneNotePickerDefaultWrapperProps.localizedStrings} />;
	}
});

// Helper that sneakily gets the reference to the section without opening/closing
// notebook elements. Opens popup if necessary.
function getSection(notebookIndex: number, sectionGroupIndexTrail: number[], sectionIndex: number): HTMLElement {
	let popupIsOpen = !!document.getElementById(Constants.Ids.sectionPickerContainer);
	if (!popupIsOpen) {
		HelperFunctions.simulateAction(() => {
			document.getElementById(Constants.Ids.sectionLocationContainer).click();
		});
	}

	let sectionPicker = document.getElementById(Constants.Ids.sectionPickerContainer).firstElementChild;
	let notebookComponent = sectionPicker.childNodes[notebookIndex];
	let children = notebookComponent.childNodes[1];

	let hasClassName = (className: string) => (element: HTMLElement) =>
		(" " + element.className + " ").indexOf(" " + className + " ") > -1;

	let isSectionGroup = hasClassName("SectionGroup");
	let isSection = hasClassName("Section");

	for (let i = 0; i < sectionGroupIndexTrail.length; i++) {
		let childNodes = Array.prototype.slice.call(children.childNodes);
		let sectionGroupComponent = childNodes.filter(isSectionGroup)[sectionGroupIndexTrail[i]];
		children = sectionGroupComponent.childNodes[1];
	}

	return Array.prototype.slice.call(children.childNodes).filter(isSection)[sectionIndex] as HTMLElement;
}

/**
 * Note that the default selected section is the first section in the first notebook.
 */

test("The current section should be highlighted by default", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let currentSection = getSection(0, [], 0);
	let currentSectionContainer = currentSection.getElementsByClassName(TestConstants.Classes.entityImageAndNameContainer)[0] as HTMLElement;
	ok(currentSectionContainer.classList.contains(TestConstants.Classes.selectedSection),
		"The default section should have extra styling applied to it");
});

test("Clicking on a different section should unselect the current one and select the new one", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let newSelectedSection = getSection(1, [], 1);
	HelperFunctions.simulateAction(() => {
		(newSelectedSection.childNodes[0] as HTMLElement).click();
	});

	// We must get the new reference of the newly selected section
	newSelectedSection = getSection(1, [], 1);
	let newSelectedSectionContainer = newSelectedSection.getElementsByClassName(TestConstants.Classes.entityImageAndNameContainer)[0] as HTMLElement;
	ok(newSelectedSectionContainer.classList.contains(TestConstants.Classes.selectedSection),
		"The selected section should have extra styling applied to it");

	let oldSelectedSectionContainer = getSection(0, [], 0);
	ok(!oldSelectedSectionContainer.classList.contains(TestConstants.Classes.selectedSection),
		"The previously selected section should no longer have extra styling applied to it");
});

test("Clicking an already selected section should do nothing to its styling", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let oldSelectedSection = getSection(0, [], 0);
	HelperFunctions.simulateAction(() => {
		(oldSelectedSection.childNodes[0] as HTMLElement).click();
	});

	// We must get the new reference of the newly selected section
	oldSelectedSection = getSection(0, [], 0);
	let oldSelectedSectionContainer = oldSelectedSection.getElementsByClassName(TestConstants.Classes.entityImageAndNameContainer)[0] as HTMLElement;
	ok(oldSelectedSectionContainer.classList.contains(TestConstants.Classes.selectedSection),
		"The previously selected section should still have extra styling applied to it when clicked again");
});

test("After clicking on a new section, the section location element should display the path of the newly selected section", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let newSelectedSection = getSection(1, [], 1);
	HelperFunctions.simulateAction(() => {
		(newSelectedSection.childNodes[0] as HTMLElement).click();
	});

	let sectionLocationContainer = document.getElementById(Constants.Ids.sectionLocationContainer);
	let sectionLocationElement = sectionLocationContainer.getElementsByClassName(TestConstants.Classes.sectionLocation)[0] as HTMLElement;
	let expectedParentName = mockOneNotePickerDefaultWrapperProps.notebooks[1].name;
	let expectedSectionName = mockOneNotePickerDefaultWrapperProps.notebooks[1].sections[1].name;
	strictEqual(sectionLocationElement.innerText, expectedParentName + " > " + expectedSectionName);
});

test("If the current path is set, the section location element should display the path to the section", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionLocationContainer = document.getElementById(Constants.Ids.sectionLocationContainer);
	let sectionLocationElement = sectionLocationContainer.getElementsByClassName(TestConstants.Classes.sectionLocation)[0] as HTMLElement;
	let expectedParentName = mockOneNotePickerDefaultWrapperProps.notebooks[0].name;
	let expectedSectionName = mockOneNotePickerDefaultWrapperProps.notebooks[0].sections[0].name;
	strictEqual(sectionLocationElement.innerText, expectedParentName + " > " + expectedSectionName);
});

test("If no current path is set, the section location element should display a loading notebooks message", () => {
	let props: OneNotePickerProps = HelperFunctions.getMockOneNotePickerProps();
	let status = "InProgress";
	defaultComponent = <OneNotePickerDefaultWrapperComponent
			status={status}
			initialSection={undefined}
			notebooks={mockOneNotePickerDefaultWrapperProps.notebooks}
			onPopupToggle={mockOneNotePickerDefaultWrapperProps.onPopupToggle}
			onSectionClicked={mockOneNotePickerDefaultWrapperProps.onSectionClicked}
			textToDisplay={undefined}
			curSectionId={undefined}
			localizedStrings={mockOneNotePickerDefaultWrapperProps.localizedStrings} />;
	HelperFunctions.mountToFixture(defaultComponent);

	let sectionLocationContainer = document.getElementById(Constants.Ids.sectionLocationContainer);
	let sectionLocationElement = sectionLocationContainer.getElementsByClassName(TestConstants.Classes.sectionLocation)[0] as HTMLElement;
	strictEqual(sectionLocationElement.innerText, props.localizedStrings.loadingNotebooks);
});
