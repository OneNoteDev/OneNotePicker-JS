<template>
	<li>
		<a class="is-active" @click="selectNotebook(notebook.id)">{{ notebook.name }}</a>
		<ul>
			<section-group-item v-for="sectionGroup in notebook.sectionGroups" :key="sectionGroup" :section-group="sectionGroup"></section-group-item>
			<section-item v-for="section in notebook.sections" :key="section" :section="section"></section-item>
		</ul>
	</li>
</template>

<script>
//import Vue from "vue";
//import Component from "vue-class-component";
//
//import SectionItem from "./sectionItem.vue";
//import SectionGroupItem from "./sectionGroupItem.vue";
//
//@Component({
//	name: "notebook-item",
//	components: { SectionItem, SectionGroupItem },
//	props: {
//		notebook: { required: true },
//	}
//})
//
//export default class NotebookItem extends Vue {
//	selectNotebook(notebookId: string): void {
//		this.$store.dispatch('selectNotebook', notebookId);
//	}
//}

export default {
    name: "notebook-item",
	props: {
        notebook: {required: true }
	},
	methods: {
		selectNotebook(notebookId) {
			this.$store.dispatch('selectNotebook', notebookId);
		}
	}
}
</script>
