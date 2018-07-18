import * as React from 'react';
import { ChevronSvg } from '../icons/chevron.svg';
import { NotebookClosedIconSvg } from '../icons/notebookClosedIcon.svg';

export interface CreateNewNotebookRowTemplateProps {
	isSelected?: boolean;
}

export class CreateNewNotebookRowTemplate extends React.Component<CreateNewNotebookRowTemplateProps, {}> {
	constructor(props: CreateNewNotebookRowTemplateProps) {
		super(props);
	}

	render() {
		return (
			<div className={this.props.isSelected ? 'picker-selectedItem notebook' : 'notebook'}>
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
