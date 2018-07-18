import * as React from 'react';
import { SectionIconSvg } from '../icons/sectionIcon.svg';

export interface CreateNewSectionRowTemplateProps {
	isSelected?: boolean;
}

export class CreateNewSectionRowTemplate extends React.Component<CreateNewSectionRowTemplateProps, {}> {
	render() {
		return (
			<div className={this.props.isSelected ? 'picker-selectedItem section' : 'section'}>
				<div className='picker-icon'>
					<SectionIconSvg />
				</div>
				{this.props.children}
			</div>
		);
	}
}
