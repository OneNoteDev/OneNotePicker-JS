import {expect} from "chai";
import OneNotePicker from "../src/oneNotePicker.vue";
import Simple from "../src/simple";

describe("TopLevel", () => {
	it("should work", () => {
		let picker = new OneNotePicker();
		// noinspection TsLint
		 expect(picker).to.exist;
	});

	it("should get coverage", () => {
		let coverage = new Simple();
		coverage.age = 10;
		coverage.greet();
		expect(coverage.age).to.equal(10);
	});
});
