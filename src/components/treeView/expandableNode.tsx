import * as React from 'react';

import {RenderableExpandableNode} from './renderableNode';

export interface ExpandableNodeProps {
	// This id lets us scope keyboard navigation to elements with the same id
	treeViewId: string;
	expanded: boolean;
	node: RenderableExpandableNode;
}

export interface ExpandableNodeState {
	expanded: boolean;
}

/**
 * Accessible TreeView parent node that supports keyboard navigation outlined in the
 * spec: https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView
 * The design and interactability is defined by the injected RenderableExpandableNode
 * object, allowing for extensibility.
 */
export class ExpandableNode extends React.Component<ExpandableNodeProps, ExpandableNodeState> {
	constructor(props: ExpandableNodeProps) {
		super(props);
		this.state = { expanded: props.expanded };
	}

	protected onClick() {
		this.setState({ expanded: !this.state.expanded });
		this.props.node.onClick();
	}

	render() {
		// TODO don't use href?
		return (
			<li aria-expanded={this.state.expanded} role='treeitem' data-treeviewid={this.props.treeViewId}>
				<a href='#' onClick={this.onClick.bind(this)} tabIndex={0}>
					{this.props.node.element()}
				</a>
				{this.state.expanded ?
					<ul role='group'>
						{this.props.node.getChildren()}
					</ul> : undefined}
			</li>);
	}
}
