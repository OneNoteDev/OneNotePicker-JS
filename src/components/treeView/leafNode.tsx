import * as React from 'react';

import {RenderableNode} from './renderableNode';

export interface LeafNodeProps {
	treeViewId: string;
	node: RenderableNode;
	id: string;
	tabbable?: boolean;
}

export class LeafNode extends React.Component<LeafNodeProps, {}> {
	render() {
		// TODO don't use href?
		return (
			<li role='treeitem'>
				<a href='#' onClick={this.props.node.onClick.bind(this)} data-treeviewid={this.props.treeViewId}
					data-id={this.props.id} tabIndex={this.props.tabbable ? 0 : -1}>
					{this.props.node.element()}
				</a>
			</li>);
	}
}
