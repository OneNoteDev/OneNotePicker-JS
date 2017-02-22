/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />

import {ExpandableEntityComponentBase, ExpandableEntityState, ExpandableEntityProps} from "./expandableEntityComponentBase";
import {SectionComponent} from "./sectionComponent";
import {SectionGroupComponent} from "./sectionGroupComponent";
import {SectionInfo} from "./oneNotePickerComponent";
import {Utils} from "../../utils";

export interface SectionGroupProps extends ExpandableEntityProps {
	sectionGroup: OneNoteApi.SectionGroup;
	onSectionClicked: (sectionInfo: SectionInfo) => void;
}

class SectionGroupComponentClass extends ExpandableEntityComponentBase<ExpandableEntityState, SectionGroupProps> {
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
		let sectionGroups = this.props.sectionGroup.sectionGroups;

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
		let sections = this.props.sectionGroup.sections;

		if (sections) {
			sections.forEach((section) => {
				let path = this.props.path + " > " + section.name;

				let curSectionIdPath: string[];
				if (this.isPartOfCurSectionIdPath()) {
					curSectionIdPath = this.props.curSectionIdPath.splice(1);
				}

				sectionRows.push(
					<SectionComponent section={section} curSectionId={this.props.curSectionId}
						onSectionClicked={this.props.onSectionClicked} path={path}
						parentId={this.props.sectionGroup.id} curSectionIdPath={curSectionIdPath} tabIndex={this.props.tabIndex} />);
			});
		}

		return sectionRows;
	}

	getEntityClassName() {
		return "SectionGroup";
	}

	getId() {
		return this.props.sectionGroup.id;
	}

	getImageClassName() {
		return "SectionGroupImage";
	}

	getImagePath() {
		return Utils.getImageResourceUrl("section_group.png");
	}

	getLabel() {
		return this.props.sectionGroup.name;
	}
}

let component = SectionGroupComponentClass.componentize();
export {component as SectionGroupComponent};
