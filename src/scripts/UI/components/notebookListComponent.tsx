/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />

import {NotebookComponent} from "./notebookComponent";
import {SectionProps} from "./sectionComponent";
import {ComponentBase} from "../componentBase";
import {Constants} from "../../constants";
import * as OneNoteApi from "oneNoteApi";

export interface NotebookListProps {
	curSectionId: string;
	notebooks: OneNoteApi.Notebook[];
	onSectionClicked: Function;
};

class NotebookListComponentClass extends ComponentBase<{}, NotebookListProps> {
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

	render() {
		let notebookRows = [];

		let curSectionIdPath = this.generateCurSectionIdPath();

		this.props.notebooks.forEach((notebook) => {
			notebookRows.push(
				<NotebookComponent notebook={notebook} curSectionId={this.props.curSectionId} path={notebook.name}
					onSectionClicked={this.onSectionClicked.bind(this)} curSectionIdPath={curSectionIdPath} />);
		});
		return (
			<ul id={Constants.Ids.notebookList} className="SectionPickerState SectionPicker" style="display: block;">
				{notebookRows}
			</ul>
		);
	}
}

let myComponent = NotebookListComponentClass.componentize();
export {myComponent as NotebookListComponent};
