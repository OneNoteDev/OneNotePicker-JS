import * as React from 'react';
import { ChevronSvg } from '../icons/chevron.svg';
import { RecentSectionsNodeProps } from './recentSectionsNode';
import { RecentSectionsIconSvg } from '../icons/recentSectionsIcon.svg';

export interface RecentSectionHeaderProps extends RecentSectionsNodeProps {
	selected: boolean;
	expanded: boolean;
	name: string;
	onRecentSectionsClick: (expanded: boolean) => void;
}

export class RecentSectionHeaderComponent extends React.Component<RecentSectionHeaderProps, {}> {
	constructor(public props: RecentSectionHeaderProps) {
		super(props);
	}

	render() {
		return (
			<div className={this.props.selected ? 'picker-selectedItem recent-sections' : 'recent-sections'} onClick={this.onClick.bind(this)}
				 title='recent-sections'>
				<div className={this.props.expanded ? 'chevron-icon opened' : 'chevron-icon closed'}>
					<ChevronSvg/>
				</div>
				<div className='picker-icon'>
					<RecentSectionsIconSvg/>
				</div>
				<div className='picker-label'>
					<label style={{fontWeight: 500, color: '#3c3c3c'}}>{this.props.name}</label>
				</div>
			</div>
		);
	}

	private onClick() {
		this.props.onRecentSectionsClick(!this.props.expanded);
	}
}
