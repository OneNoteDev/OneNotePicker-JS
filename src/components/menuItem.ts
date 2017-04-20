import Vue from "vue";
import Component from "vue-class-component";

@Component({
	props: ["itemName"],
	template: `
		<a class="test" href="#" v-text="itemName"></a>`
})

export default class MenuItem extends Vue {
	onclick(): void {
		window.alert("hello");
	}
}
