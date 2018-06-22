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
export class RecentSectionsNode extends React.Component<RecentSectionsNodeProps, { expanded: boolean }> {
	constructor(props: RecentSectionsNodeProps) {
		super(props);
		this.state = {
			expanded: !!this.props.expanded
		};
	}

	render() {
		return (
			<ExpandableNode
				onExpand={(expanded) => {
					this.setState({expanded});
				}}
				globals={this.props.globals}
				expanded={this.state.expanded}
				node={this.props.node}
				treeViewId={this.props.treeViewId}
				id={this.props.id}
				tabbable={this.props.tabbable}
				focusOnMount={this.props.focusOnMount}
				ariaSelected={this.props.ariaSelected}>
				<RecentSectionHeaderComponent selected={this.props.node.isSelected()} expanded={this.state.expanded}
											  name={this.props.node.getName()} {...this.props}/>
			</ExpandableNode>
		);
	}
}
