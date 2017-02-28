import {HelperFunctions} from "../../helperFunctions";
import {Constants} from "../../../scripts/constants";
import {Status} from "../../../scripts/status";
import {OneNotePickerPopupComponent, PopupProps} from "../../../scripts/UI/components/oneNotePickerPopupComponent";

let mockPopupProps: PopupProps = HelperFunctions.getMockPopupProps();
let defaultComponent;
QUnit.module("oneNotePickerPopupComponent", {
	beforeEach: () => {
		defaultComponent = <OneNotePickerPopupComponent
			notebooks={mockPopupProps.notebooks}
			status={mockPopupProps.status}
			onSectionClicked={mockPopupProps.onSectionClicked}
			curSectionId={ mockPopupProps.curSectionId }
			noNotebooksFound={ mockPopupProps.noNotebooksFound}
			notebookLoadFailureMessage={ mockPopupProps.notebookLoadFailureMessage }
			/>;
	}
});

test("The notebook list should be displayed when the notebooks is non empty, and the status is Succeeded", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);

	ok(!document.getElementById(Constants.Ids.sectionPickerPopupMessage), "The popup message should not be rendered");
	ok(!document.getElementById(Constants.Ids.loadingImage), "The loading image should not be rendered");

	let notebookList = document.getElementById(Constants.Ids.notebookList);
	ok(notebookList, "The notebooks list should be rendered");
	strictEqual(notebookList.childNodes.length, mockPopupProps.notebooks.length,
		"The notebook list should have the same number of list items as the number of notebooks");
});

test("The loading image should be displayed when the status is set is InProgress", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<OneNotePickerPopupComponent
			notebooks={undefined}
			status={Status.InProgress}
			onSectionClicked={mockPopupProps.onSectionClicked}
			curSectionId={ mockPopupProps.curSectionId }
			noNotebooksFound={ mockPopupProps.noNotebooksFound}
			notebookLoadFailureMessage={ mockPopupProps.notebookLoadFailureMessage }
		/>);

	ok(!document.getElementById(Constants.Ids.sectionPickerPopupMessage), "The popup message should not be rendered");
	ok(!document.getElementById(Constants.Ids.notebookList), "The notebooks list should not be rendered");
	ok(document.getElementById(Constants.Ids.loadingImage), "The loading image should be rendered");
});

test("The loading image should be displayed when the status is set is InProgress, even if the notebooks is non empty", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<OneNotePickerPopupComponent
			notebooks={mockPopupProps.notebooks}
			status={Status.InProgress}
			onSectionClicked={mockPopupProps.onSectionClicked}
			curSectionId={ mockPopupProps.curSectionId }
			noNotebooksFound={ mockPopupProps.noNotebooksFound}
			notebookLoadFailureMessage={ mockPopupProps.notebookLoadFailureMessage }
		/>);

	ok(!document.getElementById(Constants.Ids.sectionPickerPopupMessage), "The popup message should not be rendered");
	ok(!document.getElementById(Constants.Ids.notebookList), "The notebooks list should not be rendered");
	ok(document.getElementById(Constants.Ids.loadingImage), "The loading image should be rendered");
});

test("The noNotebooksFound message should be displayed with notebooks is empty, and the status is Succeeded", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<OneNotePickerPopupComponent
			notebooks={[]}
			status={mockPopupProps.status}
			onSectionClicked={mockPopupProps.onSectionClicked}
			curSectionId={ mockPopupProps.curSectionId }
			noNotebooksFound={ mockPopupProps.noNotebooksFound}
			notebookLoadFailureMessage={ mockPopupProps.notebookLoadFailureMessage }
		/>);

	ok(!document.getElementById(Constants.Ids.notebookList), "The notebooks list should not be rendered");
	ok(!document.getElementById(Constants.Ids.loadingImage), "The loading image should not be rendered");
	let message = document.getElementById(Constants.Ids.sectionPickerPopupMessage).innerText;
	strictEqual(message, mockPopupProps.noNotebooksFound,
		"Message displayed should be the noNotebooksFound message");
});

test("The notebookLoadFailureMessage message should be displayed when status is Failed", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<OneNotePickerPopupComponent
			notebooks={mockPopupProps.notebooks}
			status={Status.Failed}
			onSectionClicked={mockPopupProps.onSectionClicked}
			curSectionId={ mockPopupProps.curSectionId }
			noNotebooksFound={ mockPopupProps.noNotebooksFound}
			notebookLoadFailureMessage={ mockPopupProps.notebookLoadFailureMessage }
		/>);

	ok(!document.getElementById(Constants.Ids.notebookList), "The notebooks list should not be rendered");
	ok(!document.getElementById(Constants.Ids.loadingImage), "The loading image should not be rendered");
	let message = document.getElementById(Constants.Ids.sectionPickerPopupMessage).innerText;
	strictEqual(message, mockPopupProps.notebookLoadFailureMessage,
		"Message displayed should be the notebookLoadFailureMessage message");
});

test("The notebookLoadFailureMessage message should correctly display HTML elements within it", () => {
	let errorMessage = "hello world";
	let errorHTML = "<p>" + errorMessage + "</p>";
	let controllerInstance = HelperFunctions.mountToFixture(
		<OneNotePickerPopupComponent
			notebooks={mockPopupProps.notebooks}
			status={Status.Failed}
			onSectionClicked={mockPopupProps.onSectionClicked}
			curSectionId={ mockPopupProps.curSectionId }
			noNotebooksFound={ mockPopupProps.noNotebooksFound}
			notebookLoadFailureMessage={ errorHTML }
		/>);

	ok(!document.getElementById(Constants.Ids.notebookList), "The notebooks list should not be rendered");
	ok(!document.getElementById(Constants.Ids.loadingImage), "The loading image should not be rendered");
	let popupElement = document.getElementById(Constants.Ids.sectionPickerPopupMessage);
	strictEqual(popupElement.innerText, errorMessage, "Message displayed should be the notebookLoadFailureMessage message");
	strictEqual(popupElement.innerHTML, errorHTML, "Message displayed should preserve the HTML element as part of the message");
});
