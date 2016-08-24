/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />
import {NotebookComponent} from "./notebookComponent";
import {NotebookListComponent} from "./notebookListComponent";
import {LoadingElementComponent} from "./loadingElementComponent";
import {SectionPickerPopupMessageComponent} from "./sectionPickerPopupMessageComponent";
import {ComponentBase} from "../componentBase";
import {Constants} from "../../constants";
import {Status} from "../../status";

export interface PopupProps {
	notebooks: OneNoteApi.Notebook[];
	status: Status;
	onSectionClicked: Function;
	curSectionId: string;
	noNotebooksFound: string;
	notebookLoadFailureMessage: string;
}

class OneNotePickerPopupComponentClass extends ComponentBase<{}, PopupProps> {
	// Retrieves the styling information from the CurrentlySelectedSection in order to anchor
	// the popup component in the correct place
	handlePopoverInsertion(element: HTMLElement) {
		let saveToLocationContainer = document.getElementById(Constants.Ids.saveToLocationContainer);
		if (saveToLocationContainer) {
			let boundingRect: ClientRect = saveToLocationContainer.getBoundingClientRect();
			element.style.width = boundingRect.width + "px";
		}
	}

	render() {
		let componentToRender;
		if (this.props.status === Status.InProgress || this.props.status === Status.NotStarted) {
			componentToRender = <LoadingElementComponent prop />;
		} else if (this.props.status === Status.Failed) {
			componentToRender = <SectionPickerPopupMessageComponent message={this.props.notebookLoadFailureMessage} />;
		} else if (!this.props.notebooks || this.props.notebooks.length === 0) {
			componentToRender = <SectionPickerPopupMessageComponent message={this.props.noNotebooksFound} />;
		} else {
			componentToRender = <NotebookListComponent curSectionId={this.props.curSectionId} onSectionClicked={this.props.onSectionClicked} notebooks={this.props.notebooks} />;
		}

		return (
			<div className="SectionPickerPopup" {...this.onElementDraw(this.handlePopoverInsertion) }>
				<div id={Constants.Ids.sectionPickerContainer} className="SectionPickerContainer">
					{componentToRender}
				</div>
			</div>
		);
	}
}

let myComponent = OneNotePickerPopupComponentClass.componentize();
export {myComponent as OneNotePickerPopupComponent};
