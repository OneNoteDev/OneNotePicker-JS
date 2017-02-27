import {HelperFunctions} from "../../helperFunctions";
import {Constants} from "../../../scripts/constants";
import {SectionPickerPopupMessageComponent} from "../../../scripts/UI/components/sectionPickerPopupMessageComponent";

let defaultMessage = "hello world";
let defaultComponent;
QUnit.module("sectionPickerPopupMessageComponent", {
	beforeEach: () => {
		defaultComponent = <SectionPickerPopupMessageComponent
			message={defaultMessage} />;
	}
});

test("The component should simply consist of a label", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);
	let fixtureNodes = HelperFunctions.getFixture().childNodes;
	strictEqual(fixtureNodes.length, 1, "Only one element should be rendered");
	strictEqual((fixtureNodes[0] as HTMLElement).tagName, "LABEL", "The only element is a label");
});

test("The rendered message should be the message prop", () => {
	let controllerInstance = HelperFunctions.mountToFixture(defaultComponent);
	strictEqual(document.getElementById(Constants.Ids.sectionPickerPopupMessage).innerText, defaultMessage,
		"The rendered message should be the prop message");
});

test("The rendered message should strip whitespace from the message prop and limit spaces to one consecutive space", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<SectionPickerPopupMessageComponent message="    hello    world  " />);
	strictEqual(document.getElementById(Constants.Ids.sectionPickerPopupMessage).innerText, "hello world",
		"The rendered message should be the prop message with whitespace stripped");
});

test("The rendered message should be the message prop if it's the empty string", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<SectionPickerPopupMessageComponent message="" />);
	strictEqual(document.getElementById(Constants.Ids.sectionPickerPopupMessage).innerText, "",
		"The rendered message should be the empty string");
});

test("The rendered message should be the empty string if the message prop is undefined", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<SectionPickerPopupMessageComponent message={undefined} />);
	strictEqual(document.getElementById(Constants.Ids.sectionPickerPopupMessage).innerText, "",
		"The rendered message should be the empty string");
});

test("The rendered message should be the empty string if the message prop is null", () => {
	let controllerInstance = HelperFunctions.mountToFixture(
		<SectionPickerPopupMessageComponent message={null} />);
	strictEqual(document.getElementById(Constants.Ids.sectionPickerPopupMessage).innerText, "",
		"The rendered message should be the empty string");
});
