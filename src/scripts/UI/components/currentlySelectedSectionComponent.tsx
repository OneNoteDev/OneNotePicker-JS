import {ComponentBase} from "../componentBase";
import {Constants} from "../../constants";
import {Utils} from "../../utils";

interface CurrentlySelectedSectionProps {
	onSectionLocationContainerClicked: any;
	textToDisplay: string;
	tabIndex: number;
	expanded: boolean;
}

class CurrentlySelectedSectionClass extends ComponentBase<{}, CurrentlySelectedSectionProps> {
	render() {
		return (
			<div id={Constants.Ids.saveToLocationContainer} className="SaveToLocationContainer" >
				<a id={Constants.Ids.sectionLocationContainer} role="button" style="outline-style: none;"
					{...this.enableInvoke(this.props.onSectionLocationContainerClicked, this.props.tabIndex)} aria-expanded={this.props.expanded}>
					<div className="OpenSectionPickerArrow">
						<img className="arrowDown" src={Utils.getImageResourceUrl("dropdown_arrow.png")} />
					</div>
					<div className="SectionLocation">{this.props.textToDisplay}</div>
				</a>
			</div>
		);
	};
};

let component = CurrentlySelectedSectionClass.componentize();
export {component as CurrentlySelectedSectionComponent};
