import {HelperFunctions} from "../../helperFunctions";
import {Constants} from "../../../scripts/constants";
import {OneNotePickerComponent, OneNotePickerProps} from "../../../scripts/UI/components/oneNotePickerComponent";
import {SectionProps} from "../../../scripts/UI/components/sectionComponent";

export module TestConstants {
	export module Classes {
		export var sectionLocation = "SectionLocation";
		export var sectionPickerPopup = "SectionPickerPopup";
	}

	export module Tags {
		export var ul = "UL";
	}
}

let mockOneNotePickerProps: OneNotePickerProps = HelperFunctions.getMockOneNotePickerProps();
let defaultComponent;
QUnit.module("oneNotePickerComponent", {
	beforeEach: () => {
		defaultComponent = <OneNotePickerComponent
			status={mockOneNotePickerProps.status}
			notebooks={mockOneNotePickerProps.notebooks}
			onPopupToggle={mockOneNotePickerProps.onPopupToggle}
			onSectionClicked={ mockOneNotePickerProps.onSectionClicked }
			textToDisplay={ mockOneNotePickerProps.textToDisplay}
			curSectionId={ mockOneNotePickerProps.curSectionId }
			localizedStrings={ mockOneNotePickerProps.localizedStrings }
			/>;
	}
});

test("The popup should not be rendered by default", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let fixture = HelperFunctions.getFixture();
	strictEqual(fixture.getElementsByClassName(TestConstants.Classes.sectionPickerPopup).length, 0,
		"The section picker popup element should not exist by default");
});

test("The popup should render when clicking the section location container", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	HelperFunctions.simulateAction(() => {
		document.getElementById(Constants.Ids.sectionLocationContainer).click();
	});
	let fixture = HelperFunctions.getFixture();
	strictEqual(fixture.getElementsByClassName(TestConstants.Classes.sectionPickerPopup).length, 1,
		"The section picker popup element should exist after clicking the section location container");
});

test("The popup should not be rendered after clicking the section location container twice", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionLocationContainer = document.getElementById(Constants.Ids.sectionLocationContainer);
	HelperFunctions.simulateAction(() => {
		sectionLocationContainer.click();
		sectionLocationContainer.click();
	});
	let fixture = HelperFunctions.getFixture();
	strictEqual(fixture.getElementsByClassName(TestConstants.Classes.sectionPickerPopup).length, 0,
		"The section picker popup element should not exist after two clicks on the section location container");
});

test("The section location element should display the path of the default section by default", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionLocationContainer = document.getElementById(Constants.Ids.sectionLocationContainer);
	let sectionLocationElement = sectionLocationContainer.getElementsByClassName(TestConstants.Classes.sectionLocation)[0] as HTMLElement;
	strictEqual(sectionLocationElement.innerText, mockOneNotePickerProps.textToDisplay);
});

test("After clicking on a new section, the popup should no longer render", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	// Engage in steps to click section
	HelperFunctions.simulateAction(() => {
		document.getElementById(Constants.Ids.sectionLocationContainer).click();
	});
	let sectionPicker = document.getElementById(Constants.Ids.sectionPickerContainer).firstElementChild;
	let second = sectionPicker.childNodes[1];
	let secondNotebook = second.childNodes[0] as HTMLElement;
	let secondSections = second.childNodes[1] as HTMLElement;
	HelperFunctions.simulateAction(() => {
		secondNotebook.click();
	});
	let newSelectedSection = secondSections.childNodes[1] as HTMLElement;
	HelperFunctions.simulateAction(() => {
		// The clickable element is actually the first childNode
		(newSelectedSection.childNodes[0] as HTMLElement).click();
	});

	let fixture = HelperFunctions.getFixture();
	strictEqual(fixture.getElementsByClassName(TestConstants.Classes.sectionPickerPopup).length, 0,
		"The section picker popup element should not exist after clicking on a section");
});

test("The section location container's tab index should be equal to the first notebook element in the popup", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	// Engage in steps to click section
	HelperFunctions.simulateAction(() => {
		document.getElementById(Constants.Ids.sectionLocationContainer).click();
	});

	let sectionPicker = document.getElementById(Constants.Ids.sectionPickerContainer).firstElementChild;
	let notebookListItem = sectionPicker.childNodes[0] as HTMLElement;

	let sectionLocationContainer = document.getElementById(Constants.Ids.sectionLocationContainer);

	ok(sectionLocationContainer.tabIndex === notebookListItem.tabIndex,
		"The section location container's tab index should be equal to the first notebook element's");
});

test("Clicking a section should close notebooks that are not a parent of that section", () => {
	// The parent is responsible for updating the curSectionId, not OneNotePickerComponent
	let controllerInstance;
	let props = HelperFunctions.getMockOneNotePickerProps();
	props.onSectionClicked = (section: SectionProps) => {
		HelperFunctions.simulateAction(() => {
			controllerInstance.props.curSectionId = section.section.id;
		});
	};
	controllerInstance = HelperFunctions.mountToFixture(
		<OneNotePickerComponent
			status={props.status}
			notebooks={props.notebooks}
			onPopupToggle={props.onPopupToggle}
			onSectionClicked={ props.onSectionClicked }
			textToDisplay={ props.textToDisplay}
			curSectionId={ props.curSectionId }
			localizedStrings={ props.localizedStrings } />);

	HelperFunctions.simulateAction(() => {
		document.getElementById(Constants.Ids.sectionLocationContainer).click();
	});
	let sectionPicker = document.getElementById(Constants.Ids.notebookList);

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondNotebook = second.childNodes[0] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;

	ok(window.getComputedStyle(firstChildList).display !== "none",
		"The notebook of the default current selected section should display its child sections by default");
	strictEqual(window.getComputedStyle(secondChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	HelperFunctions.simulateAction(() => {
		secondNotebook.click();
	});
	let newSelectedSection = secondChildList.childNodes[1].firstChild as HTMLElement;
	HelperFunctions.simulateAction(() => {
		newSelectedSection.click();
	});

	HelperFunctions.simulateAction(() => {
		document.getElementById(Constants.Ids.sectionLocationContainer).click();
	});

	// Retrieve references again as the old references are no longer valid
	sectionPicker = document.getElementById(Constants.Ids.notebookList);
	first = sectionPicker.childNodes[0] as HTMLElement;
	firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	second = sectionPicker.childNodes[1] as HTMLElement;
	secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;

	strictEqual(window.getComputedStyle(firstChildList).display, "none",
		"After clicking on a section, all non-parent notebooks should close and not display their child sections");
	ok(window.getComputedStyle(secondChildList).display !== "none",
		"The notebook of the newly selected section should display its child sections");
});
