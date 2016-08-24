/// <reference path="../../../../typings/main/ambient/qunit/qunit.d.ts" />

import {HelperFunctions} from "../../helperFunctions";
import {NotebookListComponent, NotebookListProps} from "../../../scripts/UI/components/notebookListComponent";

export module TestConstants {
	export module Classes {
		export var entityImageAndNameContainer = "EntityImageAndNameContainer";
		export var entityName = "EntityName";
		export var selectedSection = "SelectedSection";
	}

	export module Tags {
		export var ul = "UL";
	}
}

let mockNotebookListProps: NotebookListProps = HelperFunctions.getMockNotebookListProps();
let defaultComponent;
QUnit.module("notebookListComponent", {
	beforeEach: () => {
		defaultComponent = <NotebookListComponent notebooks={mockNotebookListProps.notebooks}
			curSectionId={mockNotebookListProps.curSectionId}
			onSectionClicked={mockNotebookListProps.onSectionClicked} />;
	}
});

let mockNotebookListPropsWithSectionGroups = HelperFunctions.getMockNotebookListPropsWithSectionGroups();
let defaultComponentWithSectionGroups =
	<NotebookListComponent notebooks={mockNotebookListPropsWithSectionGroups.notebooks}
		curSectionId={mockNotebookListPropsWithSectionGroups.curSectionId}
		onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />;

// It is possible for section groups to be undefined when the API hits the max expands on GetNotebooks
let mockNotebookListPropsWithUndefinedSectionGroups = HelperFunctions.getMockNotebookListPropsWithUndefinedSectionGroups();
let defaultComponentWithUndefinedSectionGroups =
	<NotebookListComponent notebooks={mockNotebookListPropsWithUndefinedSectionGroups.notebooks}
		curSectionId={mockNotebookListPropsWithUndefinedSectionGroups.curSectionId}
		onSectionClicked={mockNotebookListPropsWithUndefinedSectionGroups.onSectionClicked} />;

/**
 * Note that the curSectionId in the mock props is the sectionId of the first section
 * in the first notebook.
 */

test("There should be an equal number of notebooks in the section picker as there are notebooks passed to it", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;
	let notebookComponents = sectionPicker.childNodes;
	strictEqual(notebookComponents.length, mockNotebookListProps.notebooks.length,
		"The number of notebooks in the section picker should match the number in the props");
});

test("The notebook containing a currently selected section should have its child sections displayed by default", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	ok(window.getComputedStyle(firstChildList).display !== "none",
		"The notebook that the current section belongs to should be displayed by default");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(secondChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");
});

test("A notebook not containing a currently selected section should have its child sections hidden by default", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={mockNotebookListProps.notebooks}
			curSectionId={"arbitraryId"}
			onSectionClicked={mockNotebookListProps.onSectionClicked} />);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(firstChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(secondChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");
});

test("A closed notebook that is clicked on should have its children sections displayed", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={mockNotebookListProps.notebooks}
			curSectionId={"arbitraryId"}
			onSectionClicked={mockNotebookListProps.onSectionClicked} />);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstNotebook = first.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	HelperFunctions.simulateAction(() => {
		firstNotebook.click();
	});
	ok(window.getComputedStyle(firstChildList).display !== "none",
		"Clicking on a notebook should display its child sections");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondNotebook = second.childNodes[0] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(secondChildList).display, "none",
		"A notebook that was not clicked on should have its child sections remain hidden");
});

test("Each opened notebook should display the all its sections", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	let firstSectionList = firstChildList.childNodes;
	strictEqual(firstSectionList.length, mockNotebookListProps.notebooks[0].sections.length,
		"The opened notebook should display all its sections");
});

test("Clicking a closed notebook should not hide other already open notebooks", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondNotebook = second.childNodes[0] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	HelperFunctions.simulateAction(() => {
		secondNotebook.click();
	});
	ok(window.getComputedStyle(secondChildList).display !== "none",
		"Clicking on a notebook should dispay its child sections");

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstNotebook = first.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	ok(window.getComputedStyle(firstChildList).display !== "none",
		"Clicking on a notebook should not affect the visibility of other notebooks' sections");
});

test("Notebook components should be labeled with the notebook names", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let notebooks = sectionPicker.childNodes;
	for (let i = 0; i < notebooks.length; i++) {
		let notebookComponent = sectionPicker.childNodes[i];
		let notebook = notebookComponent.childNodes[0] as HTMLElement;
		let label = notebook.getElementsByClassName(TestConstants.Classes.entityName)[0] as HTMLElement;
		strictEqual(label.innerHTML, mockNotebookListProps.notebooks[i].name,
			"The notebook label should be populated with the notebook name");
	}
});

test("Sections should be labeled with their names", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0];
	let firstSections = first.childNodes[1] as HTMLElement;
	let firstSectionList = firstSections.childNodes;
	for (let i = 0; i < firstSectionList.length; i++) {
		let section = firstSectionList[i] as HTMLElement;
		let label = section.getElementsByClassName(TestConstants.Classes.entityName)[0] as HTMLElement;
		strictEqual(label.innerHTML, mockNotebookListProps.notebooks[0].sections[i].name,
			"The section label should be populated with the section name");
	}
});

test("There should only be one section with the SelectedSection class applied at any time", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;
	strictEqual(sectionPicker.getElementsByClassName(TestConstants.Classes.selectedSection).length, 1,
		"There should only be one element with the SelectedSection class applied to it");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondNotebook = second.childNodes[0] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	HelperFunctions.simulateAction(() => {
		secondNotebook.click();
	});

	let newSelectedSection = secondChildList.childNodes[1] as HTMLElement;
	HelperFunctions.simulateAction(() => {
		newSelectedSection.click();
	});
	strictEqual(sectionPicker.getElementsByClassName(TestConstants.Classes.selectedSection).length, 1,
		"There should only be one element with the SelectedSection class applied to it after clicking on a new section");
});

test("The section matching the curSectionId prop should have the SelectedSection class applied", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	let selectedSection = firstChildList.childNodes[0] as HTMLElement;
	let container = selectedSection.getElementsByClassName(TestConstants.Classes.entityImageAndNameContainer)[0] as HTMLElement;
	ok(container.classList.contains(TestConstants.Classes.selectedSection),
		"The selected section should have extra styling applied to it");
});

test("Notebooks, section groups, and sections should be tabbed in a top-to-bottom manner (i.e., tab index must be the same)", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponentWithSectionGroups);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let tabIndex: number = undefined;
	let notebookComponents = sectionPicker.childNodes;

	let tabbables = sectionPicker.getElementsByClassName(TestConstants.Classes.entityImageAndNameContainer);
	for (let i = 0; i < tabbables.length; i++) {
		let tabbable = tabbables[i] as HTMLElement;
		if (!tabIndex) {
			if (typeof tabbable.tabIndex === "number") {
				tabIndex = tabbable.tabIndex;
			} else {
				ok(false, "Tab index must be set on all notebook, section group, and section elements");
			}
		}
		strictEqual(tabbable.tabIndex, tabIndex,
			"Tabbable entities should have the same tabIndex");
	}
});

test("The notebooks and section groups containing a currently selected section should be expanded by default", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponentWithSectionGroups);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(firstChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	ok(window.getComputedStyle(secondChildList).display !== "none",
		"The notebook that the current section belongs to should be displayed by default");

	let firstSectionGroup = secondChildList.childNodes[0] as HTMLElement;
	let sectionGroupList = firstSectionGroup.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	ok(window.getComputedStyle(sectionGroupList).display !== "none",
		"The section group that the current section belongs to should be displayed by default");
});

test("The notebooks and section groups containing a currently selected section should be expanded by default, " +
	"given that the currently selected section does not belong to the section group", () => {
	// "5678" is the second section of the second notebook
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={mockNotebookListPropsWithSectionGroups.notebooks}
			curSectionId={"5678"}
			onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(firstChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	ok(window.getComputedStyle(secondChildList).display !== "none",
		"The notebook that the current section belongs to should be displayed by default");

	let firstSectionGroup = secondChildList.childNodes[0] as HTMLElement;
	let sectionGroupList = firstSectionGroup.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(sectionGroupList).display, "none",
		"Section groups that do not house the current section should be hidden by default");
});

test("The notebooks and section groups containing a currently selected section should be expanded by default, " +
	"given that the currently selected section does not belong to the section group or its parent notebook", () => {
	// "0-EB15C30446636CBE!18742" is the first section of the first notebook
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={mockNotebookListPropsWithSectionGroups.notebooks}
			curSectionId={"0-EB15C30446636CBE!18742"}
			onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	ok(window.getComputedStyle(firstChildList).display !== "none",
		"The notebook that the current section belongs to should be displayed by default");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(secondChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let firstSectionGroup = secondChildList.childNodes[0] as HTMLElement;
	let sectionGroupList = firstSectionGroup.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(sectionGroupList).display, "none",
		"Section groups that do not house the current section should be hidden by default");
});

test("All expandable entities (notebooks and section groups) should be closed if curSectionId is undefined", () => {
	// "0-EB15C30446636CBE!18742" is the first section of the first notebook
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={mockNotebookListPropsWithSectionGroups.notebooks}
			curSectionId={undefined}
			onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(firstChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(secondChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let firstSectionGroup = secondChildList.childNodes[0] as HTMLElement;
	let sectionGroupList = firstSectionGroup.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(sectionGroupList).display, "none",
		"Section groups that do not house the current section should be hidden by default");
});

test("All expandable entities (notebooks and section groups) should be closed if curSectionId does not exist in the hierarchy", () => {
	// "0-EB15C30446636CBE!18742" is the first section of the first notebook
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={mockNotebookListPropsWithSectionGroups.notebooks}
			curSectionId={"arbitraryId"}
			onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(firstChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(secondChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let firstSectionGroup = secondChildList.childNodes[0] as HTMLElement;
	let sectionGroupList = firstSectionGroup.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(sectionGroupList).display, "none",
		"Section groups that do not house the current section should be hidden by default");
});

test("Section id path must be generated from the parent notebook to the section in the case where the section is present in the hierarchy", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponentWithSectionGroups);

	deepEqual(controllerInstance.generateCurSectionIdPath(),
		["a-bc!d", "0-EB15C30446636CBE!18818", mockNotebookListPropsWithSectionGroups.curSectionId],
		"The resulting id path should begin at the notebook id and end at the curSectionId");
});

test("If the section is not present in the hierarchy, the id path should be undefined", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={mockNotebookListPropsWithSectionGroups.notebooks}
			curSectionId={"arbitraryId"}
			onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />);

	strictEqual(controllerInstance.generateCurSectionIdPath(), undefined,
		"The resulting id path should be undefined");
});

test("If the current section is undefined, the id path should be undefined", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={mockNotebookListPropsWithSectionGroups.notebooks}
			curSectionId={undefined}
			onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />);

	strictEqual(controllerInstance.generateCurSectionIdPath(), undefined,
		"The resulting id path should be undefined");
});

test("If there are no notebooks, the id path should be undefined", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={[]}
			curSectionId={"arbitraryId"}
			onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />);

	strictEqual(controllerInstance.generateCurSectionIdPath(), undefined,
		"The resulting id path should be undefined");
});

test("If there are notebooks, but no further expandables, the id path should be undefined", () => {
	let props = HelperFunctions.getMockNotebookListPropsWithSectionGroups();
	for (let i = 0; i < props.notebooks.length; i++) {
		props.notebooks[i].sectionGroups = [];
	}

	let controllerInstance = HelperFunctions.mountToFixture(
		<NotebookListComponent notebooks={props.notebooks}
			curSectionId={mockNotebookListPropsWithSectionGroups.curSectionId}
			onSectionClicked={mockNotebookListPropsWithSectionGroups.onSectionClicked} />);

	strictEqual(controllerInstance.generateCurSectionIdPath(), undefined,
		"The resulting id path should be undefined");
});

test("If a parent has an undefined sectionGroups, it should be rendered as if there were none", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponentWithUndefinedSectionGroups);

	let sectionPicker = HelperFunctions.getFixture().firstElementChild;

	let first = sectionPicker.childNodes[0] as HTMLElement;
	let firstChildList = first.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	strictEqual(window.getComputedStyle(firstChildList).display, "none",
		"Notebooks that do not house the current section should be hidden by default");

	let second = sectionPicker.childNodes[1] as HTMLElement;
	let secondChildList = second.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	ok(window.getComputedStyle(secondChildList).display !== "none",
		"The notebook that the current section belongs to should be displayed by default");

	let firstSectionGroup = secondChildList.childNodes[0] as HTMLElement;
	let sectionGroupList = firstSectionGroup.getElementsByTagName(TestConstants.Tags.ul)[0] as HTMLElement;
	ok(window.getComputedStyle(sectionGroupList).display !== "none",
		"The section group that the current section belongs to should be displayed by default");

	strictEqual(sectionGroupList.childNodes.length, 1,
		"Only one child entity should be rendered");
	let section = sectionGroupList.childNodes[0] as HTMLElement;
	strictEqual(section.id, "0-EB15C30446636CBE!18745" /* corresponds to the child section in the mock notebooks */,
		"The only rendered child should be the section");
});
