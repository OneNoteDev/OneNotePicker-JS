<template>
	<li><a @click="selectSection(section.id)">{{ section.name }}</a></li>
</template>

<script>
//import Vue from "vue";
//import Component from "vue-class-component";
//
//@Component({
//	name: "section-item",
//	props: {
//		section: { required: true },
//	}
//})
//
//export default class NotebookItem extends Vue {
//	selectSection(sectionId: string): void {
//		this.$store.dispatch('selectSection', sectionId);
//	}
//}

export default {
	name: "section-item",
	props: {
		section: { required: true },
	},
	method: {
		selectSection(sectionId) {
			this.$store.dispatch('selectSection', sectionId);
		}
	}
}
</script>
