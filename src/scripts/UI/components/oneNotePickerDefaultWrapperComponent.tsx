/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />

import {OneNotePickerComponent, OneNotePickerProps} from "./oneNotePickerComponent";
import {SectionProps} from "./sectionComponent";
import {SectionInfo} from "./oneNotePickerComponent";
import {ComponentBase} from "../componentBase";

interface OneNotePickerDefaultWrapperState {
	curSection?: SectionInfo;
}

export interface OneNotePickerDefaultWrapperProps extends OneNotePickerProps {
	initialSection?: SectionProps;
}

/**
 * Acts as a wrapper over the OneNotePickerComponent, providing some basic default
 * functionality. In particular, when a section is clicked, the current section is
 * updated as state, and its information is passed down the hierarchy as props.
 */
class OneNotePickerDefaultWrapperComponentClass extends ComponentBase<OneNotePickerDefaultWrapperState, OneNotePickerDefaultWrapperProps> {
	getInitialState(): OneNotePickerDefaultWrapperState {
		return {
			curSection: this.props.initialSection
		};
	}

	onSectionClicked(sectionInfo: SectionInfo) {
		this.setState({
			curSection: sectionInfo
		});
		this.props.onSectionClicked(sectionInfo);
	}

	render() {
		let curSectionId: string = undefined;
		let curSectionPath: string = undefined;
		if (this.state.curSection) {
			curSectionId = this.state.curSection.section.id;
			curSectionPath = this.state.curSection.path;
		}

		return (
			<OneNotePickerComponent
				status={this.props.status}
				onSectionClicked={this.onSectionClicked.bind(this)}
				onPopupToggle={this.props.onPopupToggle}
				curSectionId={curSectionId} textToDisplay={curSectionPath}
				localizedStrings={this.props.localizedStrings}
				notebooks={this.props.notebooks}/>
		);
	}
}

let myComponent = OneNotePickerDefaultWrapperComponentClass.componentize();
export {myComponent as OneNotePickerDefaultWrapperComponent};
