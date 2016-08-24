import {ComponentBase} from "../componentBase";
import {Constants} from "../../constants";
import {Utils} from "../../utils";

class LoadingElementComponentClass extends ComponentBase<{}, {}> {
	render() {
		return (
			<img id={Constants.Ids.loadingImage} src={Utils.getImageResourceUrl("loading_circle.gif")}
				className="SectionPickerState SectionPickerLoading"/>
		);
	};
};

let component = LoadingElementComponentClass.componentize();
export {component as LoadingElementComponent};
