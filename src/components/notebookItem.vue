<template>
	<li>
		<a class="is-active" @click="selectNotebook(notebook.id)">{{ notebook.name }}</a>
		<ul>
			<section-item v-for="section in notebook.sections" :key="section" :section="section"></section-item>
		</ul>
	</li>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import SectionItem from "./sectionItem.vue";

@Component({
	name: "notebook-item",
	components: { "section-item": SectionItem },
	props: {
		notebook: { required: true },
	}
})

export default class NotebookItem extends Vue {
	selectNotebook(notebookId: string): void {
		this.$store.dispatch('selectNotebook', notebookId);
	}
}
</script>
