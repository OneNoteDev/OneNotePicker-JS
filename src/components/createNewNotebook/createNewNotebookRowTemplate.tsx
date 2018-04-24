import * as React from 'react';
import { ChevronSvg } from '../icons/chevron.svg';
import { NotebookClosedIconSvg } from '../icons/notebookClosedIcon.svg';

export class CreateNewNotebookRowTemplate extends React.Component<{}, {}> {
	render() {
		return (
			<div className='notebook'>
				<div className='chevron-icon closed' style={{ visibility: 'hidden' }}>
					<ChevronSvg />
				</div>
				<div className='picker-icon'>
					<NotebookClosedIconSvg />
				</div>
				{this.props.children}
			</div>
		);
	}
}
