import * as React from 'react';
import { SectionIconSvg } from '../icons/sectionIcon.svg';

export class CreateNewSectionRowTemplate extends React.Component<{}, {}> {
	render() {
		return (
			<div className='section'>
				<div className='picker-icon'>
					<SectionIconSvg />
				</div>
				{this.props.children}
			</div>
		);
	}
}
