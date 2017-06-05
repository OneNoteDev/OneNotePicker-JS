import * as React from 'react';

import {RenderableNode} from './renderableNode';

export interface LeafNodeProps {
	treeViewId: string;
	node: RenderableNode;
}

export class LeafNode extends React.Component<LeafNodeProps, {}> {
	render() {
		// TODO don't use href?
		return (
			<li role='treeitem' data-treeviewid={this.props.treeViewId}>
				<a href='#' onClick={this.props.node.onClick.bind(this)} tabIndex={0}>
					{this.props.node.element()}
				</a>
			</li>);
	}
}
