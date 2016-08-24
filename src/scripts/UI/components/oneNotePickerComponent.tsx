/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />
import {CurrentlySelectedSectionComponent} from "./currentlySelectedSectionComponent";
import {OneNotePickerPopupComponent} from "./oneNotePickerPopupComponent";
import {SectionProps} from "./sectionComponent";
import {ComponentBase} from "../componentBase";
import {Status} from "../../status";

interface OneNotePickerState {
	popupVisible?: boolean;
}

export interface OneNotePickerProps {
	notebooks: OneNoteApi.Notebook[];
	status: string;
	onPopupToggle: Function;
	onSectionClicked: Function;
	textToDisplay: string;
	curSectionId: string;
	localizedStrings: any;
}

class OneNotePickerComponentClass extends ComponentBase<OneNotePickerState, OneNotePickerProps> {
	getInitialState(): OneNotePickerState {
		return {
			popupVisible: false
		};
	}

	onSectionLocationContainerClicked() {
		let newState = !this.state.popupVisible;
		this.setState({
			popupVisible: newState
		});
		this.props.onPopupToggle(newState);
	}

	onSectionClicked(section: SectionProps) {
		this.setState({
			popupVisible: false
		});
		this.props.onSectionClicked(section);
		this.props.onPopupToggle(false);
	}

	getStatusEnumFromString(statusAsString: string): Status {
		switch (statusAsString) {
			case "Succeeded":
				return Status.Succeeded;
			case "InProgress":
				return Status.InProgress;
			case "Failed":
				return Status.Failed;
			case "NotStarted":
				return Status.NotStarted;
			default:
				throw Error("Invalid status passed into OneNotePickerComponent: " + statusAsString);
		};
	}

	getTextToDisplayFromStatus(status: Status): string {
		let textToDisplay: string;
		switch (status) {
			case Status.Succeeded:
				if (!this.props.textToDisplay) {
					throw Error("Status is Succeeded but no text passed in to display to user");
				}
				textToDisplay = this.props.textToDisplay;
				break;
			case Status.InProgress:
			case Status.NotStarted:
				textToDisplay = this.props.localizedStrings.loadingNotebooks;
				break;
			case Status.Failed:
				textToDisplay = this.props.localizedStrings.defaultLocation;
				break;
			default:
				throw Error("Invalid status passed into getTextToDisplayFromStatus in OneNotePickerComponent: " + status);
		}
		return textToDisplay;
	}

	render() {
		let status = this.getStatusEnumFromString(this.props.status);
		let textToDisplay = this.getTextToDisplayFromStatus(status);

		return (
			<div>
				<CurrentlySelectedSectionComponent
					textToDisplay={textToDisplay}
					onSectionLocationContainerClicked={this.onSectionLocationContainerClicked.bind(this)} />
				{ this.state.popupVisible
					? (<OneNotePickerPopupComponent
						notebooks={this.props.notebooks}
						status={status}
						onSectionClicked={this.onSectionClicked.bind(this) }
						curSectionId={this.props.curSectionId}
						noNotebooksFound={this.props.localizedStrings.noNotebooksFound}
						notebookLoadFailureMessage={this.props.localizedStrings.notebookLoadFailureMessage}/>)
					: undefined
				}
			</div>
		);
	}
}

let myComponent = OneNotePickerComponentClass.componentize();
export {myComponent as OneNotePickerComponent};
