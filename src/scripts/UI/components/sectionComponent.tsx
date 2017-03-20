import {ComponentBase} from "../componentBase";
import {Utils} from "../../utils";
import {SectionInfo} from "./oneNotePickerComponent";

export interface SectionProps extends SectionInfo {
	onSectionClicked: (sectionInfo: SectionInfo) => void;
	tabIndex: number;
}

class SectionComponentClass extends ComponentBase<{}, SectionProps> {
	private sectionInfo: SectionInfo;

	constructor(props: SectionProps) {
		super(props);

		// We don't simply pass up the entire props so we can validate easier with our tests
		this.sectionInfo = {
			section: props.section,
			path: props.path,
			parentId: props.parentId,
		};
		if (props.curSectionId) {
			this.sectionInfo.curSectionId = props.curSectionId;
		}
	}

	render() {
		let isSelected = this.props.curSectionId === this.props.section.id;
		let className = "EntityImageAndNameContainer" + (isSelected ? " SelectedSection" : "");
		return (
			<li role="treeitem" id={this.props.section.id} className="Section" aria-selected={isSelected} {...this.enableInvoke(this.props.onSectionClicked, this.props.tabIndex, this.sectionInfo) } >
				<div className={className}>
					<div className="ExpandCollapseContainer">
						<div className="Expand">
							<img className="ExpandImage" src={Utils.getImageResourceUrl("arrow_right.png")} />
						</div>
					</div>
					<div className="EntityImage">
						<img className="SectionImage" src={Utils.getImageResourceUrl("section.png")} />
						</div>
					<div className="EntityNameContainer">
						<label className="EntityName">{this.props.section.name}</label>
					</div>
				</div>
			</li>
		);
	};
};

let component = SectionComponentClass.componentize();
export {component as SectionComponent};
