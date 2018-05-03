import * as React from 'react';

import { OneNotePickerProps, OneNotePicker } from './oneNotePicker';
import { OneNoteSingleNotebookPickerProps, OneNoteSingleNotebookPicker } from './oneNoteSingleNotebookPicker';
import { GlobalProps } from './props/globalProps';

export interface OneNotePickerDropdownState {
	popupVisible: boolean;
}

export interface PickerProperties extends GlobalProps {
	dropdownLabel: string;
	popupDirection: 'bottom' | 'top';
	popupContentOverride?: JSX.Element;
}

export abstract class GenericOneNotePickerDropdown<T extends PickerProperties> extends React.Component<T, OneNotePickerDropdownState> {
	private wrapperRef: Node;

	constructor(props: T) {
		super(props);
		this.state = {
			popupVisible: false
		};
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.setWrapperRef = this.setWrapperRef.bind(this);
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

	private setWrapperRef(node) {
		this.wrapperRef = node as Node;
	}

	private handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target) && this.state.popupVisible) {
			this.setState({
				popupVisible: false
			});
		}
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	abstract getPickerElement(arg: T): JSX.Element;

	render() {
		// TODO (machiam/jane) We should not modify props. We should copy to new object before passing it down.
		const newCallbacks = { ...this.props.globals.callbacks };

		if (newCallbacks.onSectionSelected) {
			const decorated = newCallbacks.onSectionSelected;
			newCallbacks.onSectionSelected = (section, breadcrumbs) => {
				this.onPickerItemClicked();
				decorated(section, breadcrumbs);
			};
		}

		if (newCallbacks.onPageSelected) {
			const decorated = newCallbacks.onPageSelected;
			newCallbacks.onPageSelected = (page, breadcrumbs) => {
				this.onPickerItemClicked();
				decorated(page, breadcrumbs);
			};
		}

		this.props.globals.callbacks = newCallbacks;

		return (
			<div className='picker-dropdown' ref={this.setWrapperRef}>
				<div className='picker-dropdown-padding'>
					<a className='picker-dropdown-toggle' onClick={this.onClick.bind(this)}>
						<div className='dropdown-arrow-container'>
							<svg version='1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<polygon id='XMLID_10_' points='3.5,7 4.4,6.1 8,9.7 11.7,6.1 12.6,7 8,11.5' />
							</svg>
						</div>
						<div className='picker-dropdown-toggle-label' title={this.props.dropdownLabel}>
							{this.props.dropdownLabel}
						</div>
					</a>
				</div>
				{this.state.popupVisible ?
					<div className={'picker-popup ' + (this.props.popupDirection === 'top' ? 'popup-upwards' : '')}>
						{this.props.popupContentOverride ? this.props.popupContentOverride : this.getPickerElement(this.props)}
					</div> :
					undefined}
			</div>
		);
	}
}

export class OneNotePickerDropdown extends GenericOneNotePickerDropdown<OneNotePickerProps & PickerProperties> {
	getPickerElement(args: OneNotePickerProps) {
		return <OneNotePicker {...args} />;
	}
}

export class OneNoteSingleNotebookDropdown extends GenericOneNotePickerDropdown<OneNoteSingleNotebookPickerProps & PickerProperties> {
	getPickerElement(args: OneNoteSingleNotebookPickerProps) {
		return <OneNoteSingleNotebookPicker {...args} />;
	}
}

