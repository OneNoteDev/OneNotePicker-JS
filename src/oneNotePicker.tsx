import * as React from 'react';

import './oneNotePicker.scss';

import { OneNotePickerBase } from './oneNotePickerBase';
import { NotebookRenderStrategy } from './components/notebookRenderStrategy';
import { SharedNotebookRenderStrategy } from './components/sharedNotebookRenderStrategy';
import { ExpandableNode } from './components/treeView/expandableNode';
import { LeafNode } from './components/treeView/leafNode';
import { ExpandableNodeRenderStrategy } from './components/treeView/expandableNodeRenderStrategy';
import { GlobalProps } from './props/globalProps';
import { Notebook } from './oneNoteDataStructures/notebook';
import { SharedNotebook } from './oneNoteDataStructures/sharedNotebook';
import { CreateNewNotebookNode } from './components/createNewNotebook/createNewNotebookNode';
import { Section } from './oneNoteDataStructures/section';
import { RecentSectionsNode } from './components/recentSections/recentSectionsNode';

export interface OneNotePickerProps extends GlobalProps {
	notebooks: Notebook[];
	sharedNotebooks?: SharedNotebook[];
	recentSections?: Section[];
}

export class OneNotePicker extends OneNotePickerBase<OneNotePickerProps, {}> {
	protected rootNodes(): JSX.Element[] {
		const { notebooks, sharedNotebooks, recentSections, globals } = this.props;
		const { focusOnMount, ariaSelectedId } = globals;

		const notebookRenderStrategies: ExpandableNodeRenderStrategy[] =
			notebooks.map(notebook => new NotebookRenderStrategy(notebook, globals));

		const sharedNotebookRenderStrategies: ExpandableNodeRenderStrategy[] = sharedNotebooks ?
			sharedNotebooks.map(sharedNotebook => new SharedNotebookRenderStrategy(sharedNotebook, globals)) : [];

		const noPersonalNotebooks = notebookRenderStrategies.length === 0;

		// The key here is guaranteed to be unique as there is only one max 'Create notebook' affordance
		const createNewNotebookExists = this.props.globals.callbacks.onNotebookCreated;
		const createNewNotebook = createNewNotebookExists ?
			[<CreateNewNotebookNode key='createnewnotebooknode' {...this.props.globals} level={1} tabbable={true} focusOnMount={focusOnMount}></CreateNewNotebookNode>] :
			[];

		const recentSectionsExists = this.props.recentSections && this.props.recentSections.length > 0;

		const recentSectionNodes = recentSectionsExists ?
			[<RecentSectionsNode key='recentsectionsnode' {...this.props.globals} level={1} tabbable={true}
								 focusOnMount={!createNewNotebookExists && focusOnMount} sections={recentSections || []}
								 treeViewId={this.treeViewId()}></RecentSectionsNode>] : [];
		
		const notebookNodes = notebookRenderStrategies.map((renderStrategy, i) =>
			!!this.props.globals.callbacks.onSectionSelected || !!this.props.globals.callbacks.onPageSelected ?
				<ExpandableNode globals={this.props.globals} expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={this.treeViewId()} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={!createNewNotebookExists && !recentSectionsExists && i === 0} focusOnMount={!createNewNotebookExists && !recentSectionsExists && focusOnMount && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}></ExpandableNode> :
				<LeafNode globals={this.props.globals} node={renderStrategy} treeViewId={this.treeViewId()} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={!createNewNotebookExists && i === 0} focusOnMount={!createNewNotebookExists && !recentSectionsExists && focusOnMount && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}></LeafNode>);

		const sharedNotebookNodes = sharedNotebookRenderStrategies.map((renderStrategy, i) =>
			!!this.props.globals.callbacks.onSectionSelected || !!this.props.globals.callbacks.onPageSelected ?
				<ExpandableNode globals={this.props.globals} expanded={renderStrategy.isExpanded()} node={renderStrategy}
					treeViewId={this.treeViewId()} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={!createNewNotebookExists && noPersonalNotebooks && i === 0}
					focusOnMount={!createNewNotebookExists && !recentSectionsExists && focusOnMount && noPersonalNotebooks && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : noPersonalNotebooks && i === 0}></ExpandableNode> :
				<LeafNode globals={this.props.globals} node={renderStrategy} treeViewId={this.treeViewId()} key={renderStrategy.getId()}
					id={renderStrategy.getId()} tabbable={!createNewNotebookExists && noPersonalNotebooks && i === 0}
					focusOnMount={!createNewNotebookExists && !recentSectionsExists && focusOnMount && noPersonalNotebooks && i === 0}
					ariaSelected={ariaSelectedId ? renderStrategy.isAriaSelected() : noPersonalNotebooks && i === 0}></LeafNode>);

		return [...recentSectionNodes, ...createNewNotebook, ...notebookNodes, ...sharedNotebookNodes];
	}
}
