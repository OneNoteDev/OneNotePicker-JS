import * as React from 'react';

import { LocalizedComponent } from './localizedComponent';

import { OneNoteSingleNotebookPickerProps, OneNoteSingleNotebookPicker } from './oneNoteSingleNotebookPicker';

export interface OneNoteSingleNotebookDropdownState {
	popupVisible: boolean;
}

export interface OneNoteSingleNotebookDropdownProps extends OneNoteSingleNotebookPickerProps {
	dropdownLabel: string;
	popupDirection: 'bottom' | 'top';
	popupContentOverride?: JSX.Element;
}

export class OneNoteSingleNotebookDropdown extends React.Component<OneNoteSingleNotebookDropdownProps, OneNoteSingleNotebookDropdownState> {
	private wrapperRef: Node;

	constructor(props: OneNoteSingleNotebookDropdownProps) {
		super(props);
		this.state = {
			popupVisible: false
		};

		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
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

	render() {
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

		const newProps = { ...this.props };
		newProps.globals.callbacks = newCallbacks;

		return (
			<LocalizedComponent stringOverrides={this.props.globals.strings}>
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
							{this.props.popupContentOverride ? this.props.popupContentOverride : <OneNoteSingleNotebookPicker {...newProps} />}
						</div> :
						undefined}
				</div>
			</LocalizedComponent>	
		);
	}
}
