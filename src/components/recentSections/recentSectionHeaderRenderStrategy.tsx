import * as React from 'react';
import { LeafNode } from '../treeView/leafNode';
import { RecentSectionsCommonProperties } from './recentSectionsCommonProperties';
import { Constants } from '../../constants';
import { RecentSectionRenderStrategy } from './recentSectionRenderStrategy';
import { ExpandableNodeRenderStrategy } from '../treeView/expandableNodeRenderStrategy';
import { RecentSectionsNodeProps } from './recentSectionsNode';

export class RecentSectionHeaderRenderStrategy extends RecentSectionsCommonProperties implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);
	expanded = true;

	constructor(private globals: RecentSectionsNodeProps) {
		super();
	}

	element(): JSX.Element {
		return (
			<div className={this.isSelected() ? 'picker-selectedItem recentHeader' : 'recentHeader'} title='recent-sections'>
				<div className='recent-sections'>
					<label>{this.getName()}</label>
				</div>
			</div>
		);
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		const recentSectionRenderStrategies: RecentSectionRenderStrategy[] = this.globals.sections ?
			this.globals.sections.map((section, i) => new RecentSectionRenderStrategy(section, this.globals, i)) : [];
		const sections = recentSectionRenderStrategies.map((renderStrategy, i) =>
			<LeafNode globals={this.globals} node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} ariaSelected={this.globals.ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}></LeafNode>);

		return [...sections];
	}

	isExpanded(): boolean {
		return this.expanded;
	}

	isSelected(): boolean {
		return this.globals.selectedId === this.getId();
	}

	isAriaSelected(): boolean {
		return this.globals.ariaSelectedId ? this.globals.ariaSelectedId === this.getId() : false;
	}

	private onClick() {
		// const onRecentHeaderSelected = this.globals.callbacks.onRecentHeaderSelected;
		// if (!!onRecentHeaderSelected) {
		// 	onRecentHeaderSelected(this.section, OneNoteItemUtils.getAncestry(this.section));
		// }
	}
}
