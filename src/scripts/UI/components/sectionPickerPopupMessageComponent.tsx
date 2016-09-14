import {ComponentBase} from "../componentBase";
import {Constants} from "../../constants";

interface MessageProps {
	message: string;
};

class SectionPickerPopupMessageComponentClass extends ComponentBase<{}, MessageProps> {
	render() {
		// Labels don't display two consecutive spaces so we only need to trim
		let messageToShow = this.props.message ? this.props.message.trim() : "";

		// We trust embedded html so we are able to embed links for actionable messages
		return (
			<label id={Constants.Ids.sectionPickerPopupMessage}
				className="SectionPickerState SectionPickerPopupMessage">{m.trust(messageToShow)}</label>
		);
	};
};

let component = SectionPickerPopupMessageComponentClass.componentize();
export {component as SectionPickerPopupMessageComponent};
