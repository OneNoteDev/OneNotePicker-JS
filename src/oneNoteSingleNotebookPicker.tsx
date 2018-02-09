import * as React from 'react';

import './oneNotePicker.scss';

import {OneNotePickerBase} from './oneNotePickerBase';
import {SectionGroupRenderStrategy} from './components/sectionGroupRenderStrategy';
import {SectionRenderStrategy} from './components/sectionRenderStrategy';
import {ExpandableNode} from './components/treeView/expandableNode';
import {LeafNode} from './components/treeView/leafNode';
import {ExpandableNodeRenderStrategy} from './components/treeView/expandableNodeRenderStrategy';
import {GlobalProps} from './props/globalProps';
import {SectionGroup} from './oneNoteDataStructures/sectionGroup';
import {Section} from './oneNoteDataStructures/section';

export interface OneNoteSingleNotebookPickerProps extends GlobalProps {
	sectionGroups: SectionGroup[];
	sections: Section[];
}

export class OneNoteSingleNotebookPicker extends OneNotePickerBase<OneNoteSingleNotebookPickerProps, {}> {
	protected get rootNodes(): JSX.Element[] {
		const { sectionGroups, sections, globals } = this.props;
		const { focusOnMount, ariaSelectedId } = globals;

		const sectionGroupRenderStrategies: ExpandableNodeRenderStrategy[] =
			sectionGroups.map(sectionGroup => new SectionGroupRenderStrategy(sectionGroup, globals));
		
		const sectionRenderStrategies: ExpandableNodeRenderStrategy[] =
			sections.map(section => new SectionRenderStrategy(section, globals));

		const noSectionGroups = sectionGroups.length === 0;

		const sectionGroupNodes = sectionGroupRenderStrategies.map((renderStrategy, i) =>
			<ExpandableNode globals={this.props.globals} expanded={renderStrategy.isExpanded()} node={renderStrategy}
				treeViewId={this.treeViewId} key={renderStrategy.getId()}
				id={renderStrategy.getId()} tabbable={i === 0} focusOnMount={focusOnMount && i === 0}
				ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}></ExpandableNode>);
		
		const sectionNodes = sectionRenderStrategies.map((renderStrategy, i) =>
			!!this.props.globals.callbacks.onPageSelected ?
				<ExpandableNode globals={this.props.globals} expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={this.treeViewId} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={noSectionGroups && i === 0}
					focusOnMount={focusOnMount && noSectionGroups && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : noSectionGroups && i === 0}></ExpandableNode> :
				<LeafNode globals={this.props.globals} node={renderStrategy} treeViewId={this.treeViewId} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={noSectionGroups && i === 0}
					focusOnMount={focusOnMount && noSectionGroups && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : noSectionGroups && i === 0}></LeafNode>);
		
		return sectionNodes.concat(sectionGroupNodes);
	}
}
