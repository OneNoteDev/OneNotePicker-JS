import * as React from 'react';
import { ExpandableNode } from '../treeView/expandableNode';
import { Section } from '../../oneNoteDataStructures/section';
import { RecentSectionHeaderComponent } from './recentSectionHeaderComponent';
import { CommonNodeProps } from '../treeView/commonNodeProps';
import { ExpandableNodeRenderStrategy } from '../treeView/expandableNodeRenderStrategy';

export interface RecentSectionsNodeProps extends CommonNodeProps {
	sections: Section[];
	expanded?: boolean;
	node: ExpandableNodeRenderStrategy;
}

/**
 * Presentation component that extends the 'Create' UX with notebook-specific
 * UI.
 */
export class RecentSectionsNode extends React.Component<RecentSectionsNodeProps> {
	render() {
		return (
			<ExpandableNode
				globals={this.props.globals}
				expanded={this.isExpanded()}
				node={this.props.node}
				treeViewId={this.props.treeViewId}
				id={this.props.id}
				tabbable={this.props.tabbable}
				focusOnMount={this.props.focusOnMount}
				ariaSelected={this.props.ariaSelected}>
				<RecentSectionHeaderComponent selected={this.props.node.isSelected()} expanded={this.isExpanded()}
											  name={this.props.node.getName()} {...this.props}/>
			</ExpandableNode>
		);
	}

	isExpanded(): boolean {
		return !!this.props.expanded;
	}
}
