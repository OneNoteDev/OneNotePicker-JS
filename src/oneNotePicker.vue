<template>
	<ul class="menu-list">
		<notebook-item v-for="notebook in notebooks" :key="notebook" :notebook="notebook"></notebook-item>
	</ul>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import NotebookItem from "./components/notebookItem.vue";

@Component({
	name: "onenote-picker",
	components: { "notebook-item": NotebookItem },
	props: {
		notebooks: { required: true }
	}
})

export default class OneNotePicker extends Vue {
}
</script>
