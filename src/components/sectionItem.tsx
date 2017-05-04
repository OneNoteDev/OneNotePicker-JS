import * as React from 'react';

class SectionItem extends React.Component<{section: OneNoteApi.Section}, null> {
	render() {
		return (
			<li>
				<a>
					<span className='ms-font-m ms-fontWeight-regular ms-fontColor-themePrimary'>
						<i className='picker-icon-left ms-Icon ms-Icon--Section'></i>
						{this.props.section.name}
					</span>
				</a>
			</li >
		);
	}
}

export default SectionItem;
