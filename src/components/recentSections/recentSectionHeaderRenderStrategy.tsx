import * as React from 'react';
import { LeafNode } from '../treeView/leafNode';
import { RecentSectionsCommonProperties } from './recentSectionsCommonProperties';
import { Constants } from '../../constants';
import { RecentSectionRenderStrategy } from './recentSectionRenderStrategy';
import { ExpandableNodeRenderStrategy } from '../treeView/expandableNodeRenderStrategy';
import { InnerGlobals } from '../../props/globalProps';
import { Section } from '../../oneNoteDataStructures/section';

export class RecentSectionHeaderRenderStrategy extends RecentSectionsCommonProperties implements ExpandableNodeRenderStrategy {
	onClickBinded = () => {};
	onExpandBinded = () => {};
	onCollapseBinded = () => {};

	constructor(private sections: Section[], private expanded: boolean, private props: InnerGlobals, private onRecentSectionsClick: (expanded: boolean) => void) {
		super();
		this.expanded = expanded;
		this.onExpandBinded = () => { this.onRecentSectionsClick(true); };
		this.onCollapseBinded = () => { this.onRecentSectionsClick(false); };
	}

	/*
	We decoupled the render strategy from the component in this case and thus do not need to return an element here.
	The Recent Sections component needs to be able to maintain its own state and pass an onExpand callback as props to the
	Expandable Node component. This allows the Expandable Node component to inform the Recent Sections component of a
	click event through a callback so that the Recent Sections component can update its state properly. We will revisit
	this quirk when we refactor the next time.
	*/
	element(): JSX.Element {
		return <span></span>;
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		const recentSectionRenderStrategies: RecentSectionRenderStrategy[] = this.sections ?
			this.sections.map(section => new RecentSectionRenderStrategy(section, this.props)) : [];
		const sections = recentSectionRenderStrategies.map((renderStrategy, i) =>
			<LeafNode globals={this.props} node={renderStrategy} treeViewId={Constants.TreeView.id}
					  key={renderStrategy.getId() + 'recent-section'}
					  id={renderStrategy.getId()}
					  ariaSelected={this.props.ariaSelectedId ? renderStrategy.isAriaSelected() : false}
					  level={childrenLevel} setsize={this.sections.length} posinset={i + 1}></LeafNode>);

		return [...sections];
	}

	isExpanded(): boolean {
		return this.expanded;
	}

	isSelected(): boolean {
		return this.props.selectedId === this.getId();
	}

	isAriaSelected(): boolean {
		return this.props.ariaSelectedId ? this.props.ariaSelectedId === this.getId() : false;
	}

	getId() {
		return Constants.TreeView.recentSectionsId;
	}
}
