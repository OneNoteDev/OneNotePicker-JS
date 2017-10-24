import * as React from 'react';

import {CommonNodeProps} from './commonNodeProps';
import {ExpandableNodeRenderStrategy} from './expandableNodeRenderStrategy';
import {TreeViewNavigationUtils} from './treeViewNavigationUtils';

export interface ExpandableNodeProps extends CommonNodeProps {
	expanded: boolean;
	node: ExpandableNodeRenderStrategy;
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

	onClick() {
		let { node } = this.props;
		let nextExpandState = !this.state.expanded;

		this.setState({ expanded: nextExpandState });

		if (nextExpandState && node.onExpandBinded) {
			node.onExpandBinded();
		}
		node.onClickBinded();

		this.props.globals.callbacks.onAccessibleSelection(node.getId());
	}

	onKeyDown(event: KeyboardEvent) {
		TreeViewNavigationUtils.normalizeKeyboardEventBehaviour(event);

		TreeViewNavigationUtils.handleMovementKeyboardEvent(this.props.id, this.props.treeViewId, event, this.props.globals.callbacks.onAccessibleSelection);

		switch (event.keyCode) {
			case 32:
				// Space
				this.onClick();
				break;
			case 37:
				// Left arrow
				this.setState({ expanded: false });
				break;
			case 39:
				// Right arrow
				if (this.props.node.onExpandBinded) {
					this.props.node.onExpandBinded();
				}
				this.setState({ expanded: true });
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
			<li aria-label={this.props.node.getName()} aria-expanded={this.state.expanded} role='treeitem' aria-level={this.level}
				id={this.descendentId} aria-selected={this.props.ariaSelected}>
				<a className='picker-row' onClick={this.onClick.bind(this)} onKeyDown={this.onKeyDown.bind(this)}
					data-treeviewid={this.props.treeViewId} data-id={this.props.id} tabIndex={this.props.tabbable ? 0 : -1}
					role='presentation'>
					{this.props.node.element()}
				</a>
				{this.state.expanded ?
					<ul role='group' aria-label={this.props.node.getName()}>
						{this.props.node.getChildren(this.level + 1)}
					</ul> : undefined}
			</li>);
	}
}
