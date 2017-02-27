﻿/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />

import {NotebookComponent} from "./notebookComponent";
import {SectionProps} from "./sectionComponent";
import {SectionInfo} from "./oneNotePickerComponent";
import {ComponentBase} from "../componentBase";
import {Constants} from "../../constants";

export interface NotebookListProps {
	curSectionId: string;
	notebooks: OneNoteApi.Notebook[];
	onSectionClicked: (sectionInfo: SectionInfo) => void;
	rowTabIndex: number;
};

class NotebookListComponentClass extends ComponentBase<{}, NotebookListProps> {
	private hasScrolledIntoView = false;

	onSectionClicked(section: SectionProps) {
		this.props.onSectionClicked(section);
	}

	/**
	 * Generates a list representing the path of entity ids to the section, where the
	 * id at index 0 is the notebook id and the id at the last index is the section id.
	 */
	generateCurSectionIdPath(): string[] {
		let path = OneNoteApi.NotebookUtils.getPathFromNotebooksToSection(this.props.notebooks, s => s.id === this.props.curSectionId);
		return path ? path.map((elem) => elem.id) : undefined;
	}

	scrollToCurrentSection() {
		// We only want to call this the first time it is rendered into the view, not on state change
		if (this.props.curSectionId && !this.hasScrolledIntoView) {
			let currentSection = document.getElementById(this.props.curSectionId);
			if (currentSection && currentSection.scrollIntoView) {
				currentSection.scrollIntoView();
			}
			this.hasScrolledIntoView = true;
		}
	}

	render() {
		let notebookRows = [];

		let curSectionIdPath = this.generateCurSectionIdPath();

		this.props.notebooks.forEach((notebook) => {
			notebookRows.push(
				<NotebookComponent notebook={notebook} curSectionId={this.props.curSectionId} path={notebook.name}
					onSectionClicked={this.onSectionClicked.bind(this)} curSectionIdPath={curSectionIdPath} tabIndex={this.props.rowTabIndex} />);
		});
		return (
			<ul id={Constants.Ids.notebookList} className="SectionPickerState SectionPicker" style="display: block;" config={this.scrollToCurrentSection.bind(this)}>
				{notebookRows}
			</ul>
		);
	}
}

let myComponent = NotebookListComponentClass.componentize();
export {myComponent as NotebookListComponent};
