import * as React from 'react';

import { CommonNodeProps } from './commonNodeProps';
import {NodeRenderStrategy} from './nodeRenderStrategy';
import {TreeViewNavigationUtils} from './treeViewNavigationUtils';

export interface LeafNodeProps extends CommonNodeProps {
	node: NodeRenderStrategy;
}

export class LeafNode extends React.Component<LeafNodeProps, {}> {
	onKeyDown(event: KeyboardEvent) {
		TreeViewNavigationUtils.normalizeKeyboardEventBehaviour(event);

		TreeViewNavigationUtils.handleMovementKeyboardEvent(this.props.id, this.props.treeViewId, event);

		switch (event.keyCode) {
			case 32:
				// Space
				this.props.node.onClickBinded();
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<li role='treeitem'>
				<a className='picker-row' onClick={this.props.node.onClickBinded} onKeyDown={this.onKeyDown.bind(this)}
					data-treeviewid={this.props.treeViewId} data-id={this.props.id} tabIndex={this.props.tabbable ? 0 : -1}>
					{this.props.node.element()}
				</a>
			</li>);
	}
}
