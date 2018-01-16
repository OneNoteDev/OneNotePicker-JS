import * as React from 'react';

import {OneNoteSingleNotebookPickerProps, OneNoteSingleNotebookPicker} from './oneNoteSingleNotebookPicker';

export interface OneNoteSingleNotebookDropdownState {
	popupVisible: boolean;
}

export interface OneNoteSingleNotebookDropdownProps extends OneNoteSingleNotebookPickerProps {

}

export class OneNoteSingleNotebookDropdown extends React.Component<OneNoteSingleNotebookDropdownProps, OneNoteSingleNotebookDropdownState> {
	constructor() {
		super();
		this.state = {
			popupVisible: false
		};
	}

	onClick() {
		this.setState({
			popupVisible: !this.state.popupVisible
		});
	}

	onPickerItemClicked() {
		this.setState({
			popupVisible: false
		});
	}

	render() {
		let newCallbacks = { ...this.props.globals.callbacks };
		
		if (newCallbacks.onSectionSelected) {
			let decorated = newCallbacks.onSectionSelected;
			newCallbacks.onSectionSelected = (section, breadcrumbs) => {
				this.onPickerItemClicked();
				decorated(section, breadcrumbs);
			};
		}

		if (newCallbacks.onPageSelected) {
			let decorated = newCallbacks.onPageSelected;
			newCallbacks.onPageSelected = (page, breadcrumbs) => {
				this.onPickerItemClicked();
				decorated(page, breadcrumbs);
			};
		}

		let newProps = { ...this.props };
		newProps.globals.callbacks = newCallbacks;

		return (
			<div>
				<div>
					<button onClick={this.onClick.bind(this)}>Click me</button>
				</div>
				{this.state.popupVisible ?
					<div>
						<OneNoteSingleNotebookPicker {...newProps} />
					</div> :
					undefined}
			</div>
		);
	}
}
