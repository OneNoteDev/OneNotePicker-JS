import * as React from 'react';
import { LeafNode } from '../treeView/leafNode';
import { RecentSectionsCommonProperties } from './recentSectionsCommonProperties';
import { Constants } from '../../constants';
import { RecentSectionRenderStrategy } from './recentSectionRenderStrategy';
import { ExpandableNodeRenderStrategy } from '../treeView/expandableNodeRenderStrategy';
import { RecentSectionsNodeProps } from './recentSectionsNode';
import { ChevronSvg } from '../icons/chevron.svg';
import { NotebookOpenedIconSvg } from '../icons/notebookOpenedIcon.svg';
import { NotebookClosedIconSvg } from '../icons/notebookClosedIcon.svg';

export class RecentSectionHeaderRenderStrategy extends RecentSectionsCommonProperties implements ExpandableNodeRenderStrategy {
	onClickBinded = this.onClick.bind(this);
	expanded = true;

	constructor(private globals: RecentSectionsNodeProps) {
		super();
	}

	element(): JSX.Element {
		return (
			<div className={this.isSelected() ? 'picker-selectedItem recent-sections' : 'recent-sections'} title='recent-sections'>
				<div className={this.isExpanded() ? 'chevron-icon opened' : 'chevron-icon closed'}>
					<ChevronSvg />
				</div>
				<div className='picker-icon'>
					{this.isExpanded() ? <NotebookOpenedIconSvg /> : <NotebookClosedIconSvg />}
				</div>
				<div className='picker-label'>
					<label>{this.getName()}</label>
				</div>
			</div>);
	}

	getChildren(childrenLevel: number): JSX.Element[] {
		const recentSectionRenderStrategies: RecentSectionRenderStrategy[] = this.globals.sections ?
			this.globals.sections.map(section => new RecentSectionRenderStrategy(section, this.globals)) : [];
		const sections = recentSectionRenderStrategies.map((renderStrategy, i) =>
			<LeafNode globals={this.globals} node={renderStrategy} treeViewId={Constants.TreeView.id} key={renderStrategy.getId()}
					id={renderStrategy.getId()} ariaSelected={this.globals.ariaSelectedId ? renderStrategy.isAriaSelected() : i === 0}
					  level={childrenLevel}></LeafNode>);

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

	getId() {
		return Constants.TreeView.recentSectionsId;
	}

	private onClick() {
		this.expanded = !this.expanded;
	}
}
