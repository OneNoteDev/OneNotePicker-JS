<template>
    <li>
        <a :class="{'is-active': isActive}" @click="selectSectionGroup(sectionGroup.id)">{{ sectionGroup.name }}</a>
        <ul>
			<section-group-item v-for="group in sectionGroup.sectionGroups" :key="group" :section-group="group"></section-group-item>
            <section-item v-for="section in sectionGroup.sections" :key="section" :section="section"></section-item>
        </ul>
    </li>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";

    import SectionItem from "./sectionItem.vue";

    @Component({
        name: "section-group-item",
        components: { SectionItem },
        props: {
            sectionGroup: { required: true },
        }
    })
    export default class SectionGroupItem extends Vue {
        sectionGroup;
		active = false;

		selectSectionGroup(sectionGroupId: string): void {
			this.$store.dispatch('selectSectionGroup', sectionGroupId);
		}

		get isActive() {
		    return this.$store.state.pickerState.selectedSectionGroupId == this.sectionGroup.id;
		}
    }
</script>
