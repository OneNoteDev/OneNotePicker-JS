import Vue from "vue";
import Component from "vue-class-component";

@Component({
	props: ["itemName"],
	template: '<li><a v-text="itemName" @click="onClick"></a></li>'
})

export default class MenuItem extends Vue {
	onClick(): void {
		window.alert("hello");
	}
}
