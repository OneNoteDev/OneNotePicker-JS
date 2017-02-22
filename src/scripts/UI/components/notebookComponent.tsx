/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />

import {ExpandableEntityComponentBase, ExpandableEntityState, ExpandableEntityProps} from "./expandableEntityComponentBase";
import {SectionComponent, SectionProps} from "./sectionComponent";
import {SectionGroupComponent} from "./sectionGroupComponent";
import {SectionInfo} from "./oneNotePickerComponent";
import {Utils} from "../../utils";

export interface NotebookProps extends ExpandableEntityProps {
	notebook: OneNoteApi.Notebook;
	onSectionClicked: (sectionInfo: SectionInfo) => void;
}

class NotebookComponentClass extends ExpandableEntityComponentBase<ExpandableEntityState, NotebookProps> {
	getDirectChildren(): any[] {
		let directChildren = this.getChildSectionGroups();
		let childSections = this.getChildSections();
		childSections.forEach((section) => {
			directChildren.push(section);
		});
		return directChildren;
	}

	private getChildSectionGroups(): any[] {
		let sectionGroupRows = [];
		let sectionGroups = this.props.notebook.sectionGroups;

		if (sectionGroups) {
			sectionGroups.forEach((sectionGroup) => {
				let path = this.props.path + " > " + sectionGroup.name;

				let curSectionIdPath: string[];
				if (this.isPartOfCurSectionIdPath()) {
					curSectionIdPath = this.props.curSectionIdPath.splice(1);
				}

				sectionGroupRows.push(
					<SectionGroupComponent curSectionId={this.props.curSectionId}
						path={path} sectionGroup={sectionGroup} onSectionClicked={this.props.onSectionClicked}
						curSectionIdPath={curSectionIdPath} tabIndex={this.props.tabIndex}/>);
			});
		}

		return sectionGroupRows;
	}

	private getChildSections(): any[] {
		let sectionRows = [];
		let sections = this.props.notebook.sections;

		if (sections) {
			sections.forEach((section) => {
				let path = this.props.path + " > " + section.name;
				sectionRows.push(
					<SectionComponent section={section} curSectionId={this.props.curSectionId}
						onSectionClicked={this.props.onSectionClicked} path={path}
						parentId={this.props.notebook.id} tabIndex={this.props.tabIndex}/>);
			});
		}

		return sectionRows;
	}

	getEntityClassName() {
		return "Notebook";
	}

	getId() {
		return this.props.notebook.id;
	}

	getImageClassName() {
		return "NotebookImage";
	}

	getImagePath() {
		return Utils.getImageResourceUrl("notebook.png");
	}

	getLabel() {
		return this.props.notebook.name;
	}
};

let component = NotebookComponentClass.componentize();
export {component as NotebookComponent};
