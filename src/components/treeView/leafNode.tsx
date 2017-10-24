import * as React from 'react';

import {CommonNodeProps} from './commonNodeProps';
import {NodeRenderStrategy} from './nodeRenderStrategy';
import {TreeViewNavigationUtils} from './treeViewNavigationUtils';

export interface LeafNodeProps extends CommonNodeProps {
	node: NodeRenderStrategy;
}

export class LeafNode extends React.Component<LeafNodeProps, {}> {
	onKeyDown(event: KeyboardEvent) {
		TreeViewNavigationUtils.normalizeKeyboardEventBehaviour(event);

		TreeViewNavigationUtils.handleMovementKeyboardEvent(this.props.id, this.props.treeViewId, event, this.props.globals.callbacks.onAccessibleSelection);

		switch (event.keyCode) {
			case 32:
				// Space
				this.props.node.onClickBinded();
				break;
			default:
				break;
		}
	}

	componentDidMount() {
		let { focusOnMount, id } = this.props;
		if (focusOnMount) {
			let self = document.querySelector(`[data-id='${id}']`) as HTMLElement;
			self.focus();
		}
	}

	private get level() {
		return this.props.level || 1;
	}

	private get descendentId() {
		return this.props.treeViewId + this.props.id;
	}

	render() {
		return (
			<li aria-label={this.props.node.getName()} role='treeitem' aria-level={this.level}
				id={this.descendentId} aria-selected={this.props.ariaSelected}>
				<a className='picker-row' onClick={this.props.node.onClickBinded} onKeyDown={this.onKeyDown.bind(this)}
					data-treeviewid={this.props.treeViewId} data-id={this.props.id} tabIndex={this.props.tabbable ? 0 : -1}
					role='presentation'>
					{this.props.node.element()}
				</a>
			</li>);
	}
}
