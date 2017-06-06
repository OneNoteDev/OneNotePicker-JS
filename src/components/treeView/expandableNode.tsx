import * as React from 'react';

import {ExpandableNodeRenderStrategy} from './expandableNodeRenderStrategy';

export interface ExpandableNodeProps {
	// This id lets us scope keyboard navigation to elements with the same id
	treeViewId: string;
	expanded: boolean;
	node: ExpandableNodeRenderStrategy;
	id: string;
	tabbable?: boolean;
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
		this.setState({ expanded: !this.state.expanded });
		this.props.node.onClick();
	}

	onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();

		if (event.keyCode !== 9) {
			// Allow tabbing out
			event.preventDefault();
		}
		
		let navigatables: NodeListOf<HTMLElement>;
		switch (event.keyCode) {
			case 13:
				// Enter
				this.onClick();
				break;
			case 35:
				// End
				navigatables = this.getAllNavigatables();
				if (navigatables.length > 0) {
					navigatables[navigatables.length - 1].focus();
				}
				break;
			case 36:
				// Home
				navigatables = this.getAllNavigatables();
				if (navigatables.length > 0) {
					navigatables[0].focus();
				}
				break;
			case 37:
				// Left arrow
				this.setState({ expanded: false });
				break;
			case 38:
				// Up arrow
				let prev = this.getNavigatableWithOffset(-1);
				if (!!prev) {
					prev.focus();
				}
				break;
			case 39:
				// Right arrow
				this.setState({ expanded: true });
				break;
			case 40:
				// Down arrow
				let next = this.getNavigatableWithOffset(1);
				if (!!next) {
					next.focus();
				}
				break;
			default:
				break;
		}
	}

	private getNavigatableWithOffset(offset: number): HTMLElement | undefined {
		let navigatables = this.getAllNavigatables();

		// Depending on the offset, we don't have to check all elements. For example, if we're going
		// backwards by n, we don't need to check the first n elements etc.
		let startIndex = offset < 0 ? 0 - offset : 0;
		let endIndex = offset > 0 ? navigatables.length - offset : navigatables.length;
		for (let i = startIndex; i < endIndex; i++) {
			let currentElem = navigatables[i];
			if (currentElem.getAttribute('data-id') === this.props.id) {
				return navigatables[i + offset];
			}
		}

		return undefined;
	}

	private getAllNavigatables(): NodeListOf<HTMLElement> {
		return document.querySelectorAll(`[data-treeviewid=${this.props.treeViewId}]`) as NodeListOf<HTMLElement>;
	}

	render() {
		return (
			<li aria-expanded={this.state.expanded} role='treeitem'>
				<a onClick={this.onClick.bind(this)} onKeyDown={this.onKeyDown.bind(this)}
					data-treeviewid={this.props.treeViewId} data-id={this.props.id} tabIndex={this.props.tabbable ? 0 : -1}>
					{this.props.node.element()}
				</a>
				{this.state.expanded ?
					<ul role='group'>
						{this.props.node.getChildren()}
					</ul> : undefined}
			</li>);
	}
}
