import * as React from 'react';
import { Manager, Target, Popper, Arrow } from 'react-popper';

import { ErrorInfoIconSvg } from './icons/errorInfoIcon.svg';

export interface ErrorIconWithPopoverProps {
	errorMessage: string | undefined;
}

export interface ErrorIconWithPopoverState {
	popoverIsOpen: boolean;
}

export class ErrorIconWithPopover extends React.Component<ErrorIconWithPopoverProps, ErrorIconWithPopoverState> {
	private wrapperRef: Node;

	constructor(props: ErrorIconWithPopoverProps) {
		super(props);

		this.state = {
			popoverIsOpen: false
		};

		// Used to handle if user clicks outside error icon, the popover should close
		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);

		// Used to handle if the user scrolls anywhere on the page, the popover should close
		this.scrollHandler = this.scrollHandler.bind(this);

		// Used to handle if the user hits space on the error icon, the popover should toggle visibility
		this.keyUpHandler = this.keyUpHandler.bind(this);

		// Used to handle if the user clicks the error icon, the popover should toggle visibility
		this.clickHandler = this.clickHandler.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
		window.addEventListener('scroll', this.scrollHandler, true);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		window.removeEventListener('scroll', this.scrollHandler, true);
	}

	componentWillReceiveProps() {
		this.setState({
			popoverIsOpen: false
		});
	}

	private handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target) && this.state.popoverIsOpen) {
			this.setState({
				popoverIsOpen: false
			});
		}
	}

	private setWrapperRef(node) {
		this.wrapperRef = node as Node;
	}

	private scrollHandler() {
		this.setState({
			popoverIsOpen: false
		});
	}

	private keyUpHandler(event) {
		// Space
		if (event.keyCode === 32) {
			this.clickHandler();
		}
	}

	private clickHandler() {
		this.setState({
			popoverIsOpen: !this.state.popoverIsOpen
		});
	}

	render() {
		return (
			<div ref={this.setWrapperRef} className='error-info-icon'>
				<Manager >
					<Target>
						<div
							tabIndex={0}
							style={this.props.errorMessage ? {} : { visibility: 'hidden' }}
							onClick={this.clickHandler}
							onKeyUp={this.keyUpHandler}>
							<ErrorInfoIconSvg/>
						</div>
					</Target>
					<Popper
						placement={'bottom'}
						modifiers={{
							hide: {
								enabled: false
							},
							preventOverflow: {
								enabled: true,
							},
							arrow: {
								enabled: true
							}
						}}
						className='error-info-popover popper'
						eventsEnabled={true}>
						<div
							className='error-info-popover-content'
							style={this.shouldShowPopover() ? {} : { visibility: 'hidden' }}>
							{this.props.errorMessage}
						</div>
						<Arrow className='popper__arrow' />
					</Popper>
				</Manager>
			</div>
		);
	}

	private shouldShowPopover() {
		return this.state.popoverIsOpen;
	}
}
