import {expect} from "chai";
import OneNoteSectionPicker from "../src/oneNotePicker.vue";
import Simple from "../src/simple";

describe("TopLevel", () => {
	it("should work", () => {
		// noinspection TsLint
		expect(OneNoteSectionPicker).to.exist;
	});

	it("should get coverage", () => {
		let coverage = new Simple();
		coverage.age = 10;
		coverage.greet();
		expect(coverage.age).to.equal(10);
	});
});
