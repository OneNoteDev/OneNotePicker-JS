import {ComponentBase} from "../componentBase";
import {Utils} from "../../utils";

export interface SectionProps {
	section: OneNoteApi.Section;
	path: string;
	parentId?: string;
	curSectionId: string;
	onSectionClicked: Function;
}

class SectionComponentClass extends ComponentBase<{}, SectionProps> {
	render() {
		let isSelected = this.props.curSectionId === this.props.section.id;
		let className = "EntityImageAndNameContainer" + (isSelected ? " SelectedSection" : "");
		return (
			<li id={this.props.section.id} className="Section">
				<div {...this.enableInvoke(this.props.onSectionClicked, 51, this.props)} className={className} >
					<div className="ExpandCollapseContainer">
						<div className="Expand">
							<img className="ExpandImage" src={Utils.getImageResourceUrl("arrow_right.png")} />
						</div>
					</div>
					<div className="EntityImage">
						<img className="SectionImage" src={Utils.getImageResourceUrl("section.png")} />
						</div>
					<div className="EntityNameContainer">
						<label className="EntityName" alt={this.props.section.name} title={this.props.section.name}>{this.props.section.name}</label>
					</div>
				</div>
			</li>
		);
	};
};

let component = SectionComponentClass.componentize();
export {component as SectionComponent};
