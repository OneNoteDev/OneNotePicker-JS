<template>
	<li><a @click="selectSection(section.id)">{{ section.name }}</a></li>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
	name: "section-item",
	props: {
		section: { required: true },
	}
})

export default class NotebookItem extends Vue {
	selectSection(sectionId: string): void {
		this.$store.dispatch('selectSection', sectionId);
	}
}
</script>
