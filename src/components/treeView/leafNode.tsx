import * as React from 'react';

import { CommonNodeProps } from './commonNodeProps';
import { NodeRenderStrategy } from './nodeRenderStrategy';
import { TreeViewNavigationUtils } from './treeViewNavigationUtils';

export interface LeafNodeProps extends CommonNodeProps {
	node: NodeRenderStrategy;
}

export class LeafNode extends React.Component<LeafNodeProps, {}> {
	onClick() {
		this.props.node.onClickBinded()
		this.props.globals.callbacks.onAccessibleSelection(this.props.id);
	}

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
		const { focusOnMount, id } = this.props;
		if (focusOnMount) {
			const self = document.querySelector(`[data-id='${id}']`) as HTMLElement;
			self.focus();
		}
	}

	private level() {
		return this.props.level || 1;
	}

	private descendentId() {
		return this.props.treeViewId + this.props.id;
	}

	render() {
		return (
			<li>
				<a id={this.descendentId()} className='picker-row' onClick={this.onClick.bind(this)} onKeyDown={this.onKeyDown.bind(this)}
					data-treeviewid={this.props.treeViewId} data-id={this.props.id} tabIndex={this.props.tabbable ? 0 : -1}
					role='treeitem' aria-labelledby={this.descendentId()} aria-level={this.level()}
					aria-selected={this.props.ariaSelected} aria-setsize={this.props.setsize} aria-posinset={this.props.posinset}>
					{this.props.node.element()}
				</a>
			</li>);
	}
}
