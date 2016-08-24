import {ComponentBase} from "../componentBase";
import {Constants} from "../../constants";

interface MessageProps {
	message: string;
};

class SectionPickerPopupMessageComponentClass extends ComponentBase<{}, MessageProps> {
	render() {
		// Labels don't display two consecutive spaces so we only need to trim
		let messageToShow = this.props.message ? this.props.message.trim() : "";
		return (
			<label id={Constants.Ids.sectionPickerPopupMessage}
				className="SectionPickerState SectionPickerPopupMessage">{messageToShow}</label>
		);
	};
};

let component = SectionPickerPopupMessageComponentClass.componentize();
export {component as SectionPickerPopupMessageComponent};
