import * as React from 'react';

import { NodeRenderStrategy } from './nodeRenderStrategy';
import { LeafNode, LeafNodeProps } from './leafNode';
import { InnerGlobals } from '../../props/globalProps';
import { NameValidator } from '../../nameValidator';
import { Constants } from '../../constants';

export interface CreateEntityNodeProps extends InnerGlobals {
	tabbable: boolean;
	level: number;
	notStartedRenderStrategy: (onClick: () => void) => NodeRenderStrategy;
	inputRenderStrategy:
		(inputValue: string,
			onEnter: () => void,
			onInputChange: (evt: React.ChangeEvent<HTMLInputElement>) => void,
			setInputRefAndFocus: (node: HTMLInputElement) => void) => NodeRenderStrategy;
	createErrorRenderStrategy: (errorMessage: string, inputValue: string, onInputChange: (evt: React.ChangeEvent<HTMLInputElement>) => void) => NodeRenderStrategy;
	inProgressRenderStrategy: (inputValue: string) => NodeRenderStrategy;
	createEntity: (name: string) => Promise<void>;
}

export interface CreateEntityNodeState {
	status: 'NotStarted' | 'Input' | 'CreateError' | 'InProgress';
	nameInputValue: string;
	// TODO (machiam) Use the API error in a smarter way to display its message
	// tslint:disable-next-line:no-any
	lastError?: any;
}

/**
 * Functional component for creating a particular entity e.g., notebook. UI logic
 * should be passed in as props.
 */
export class CreateEntityNode extends React.Component<CreateEntityNodeProps, CreateEntityNodeState> {
	private wrapperRef: HTMLElement;
	private inputRef: HTMLInputElement;
	private componentIsMounted: boolean;

	constructor(props: CreateEntityNodeProps) {
		super(props);
		this.state = this.defaultState();

		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.setInputRefAndFocus = this.setInputRefAndFocus.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.handleEnterInput = this.handleEnterInput.bind(this);
		this.resetAndFocus = this.resetAndFocus.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
		this.componentIsMounted = true;
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		this.componentIsMounted = false;
	}

	private handleClickOutside(event) {
		if (this.state.status === 'Input' && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.handleEnterInput();
		}
	}

	private handleEnterInput() {
		if (!this.state.nameInputValue) {
			// User aborted action by clicking out when the input box is empty/whitespace
			this.resetAndFocus();
		}

		const trimmedName = this.state.nameInputValue.trim();
		if (!trimmedName || NameValidator.validateNotebookName(trimmedName)) {
			// Don't fire off request or change state if user attempts to submit invalid name
			return;
		}

		this.setState({ status: 'InProgress' });

		this.props.createEntity(trimmedName).then(() => {
			if (this.componentIsMounted) {
				this.setState(this.defaultState());
			}
		}).catch((error) => {
			this.setState({
				status: 'CreateError',
				lastError: error
			});
		});
	}

	private resetAndFocus() {
		this.setState(this.defaultState());
		const tabRef = this.wrapperRef.getElementsByTagName('a')[0];
		if (tabRef) {
			tabRef.focus();
		}
	}

	private defaultState(): CreateEntityNodeState {
		return {
			status: 'NotStarted',
			nameInputValue: ''
		};
	}

	render() {
		const { focusOnMount } = this.props;

		let renderStrategy: NodeRenderStrategy;
		switch (this.state.status) {
			case 'Input':
				renderStrategy = this.props.inputRenderStrategy(this.state.nameInputValue, this.handleEnterInput, this.onInputChange, this.setInputRefAndFocus);
				break;
			case 'CreateError':
				// TODO (machiam) Don't use JSON.stringify; parse out API error instead, or map it to a localized error
				renderStrategy = this.props.createErrorRenderStrategy(this.state.lastError ? JSON.stringify(this.state.lastError) : '', this.state.nameInputValue, this.onInputChange);
				break;
			case 'InProgress':
				renderStrategy = this.props.inProgressRenderStrategy(this.state.nameInputValue);
				break;
			default:
				renderStrategy = this.props.notStartedRenderStrategy(this.onClick);
				break;
		}

		const props: LeafNodeProps = {
			node: renderStrategy,
			treeViewId: Constants.TreeView.id,
			id: renderStrategy.getId(),
			level: this.props.level,
			ariaSelected: renderStrategy.isAriaSelected(), // TODO maybe?
			tabbable: this.props.tabbable,
			focusOnMount: focusOnMount,

			globals: this.props,
		};
		return (
			<div ref={this.setWrapperRef}>
				<LeafNode {...props}></LeafNode>
			</div>
		);
	}

	private setWrapperRef(node) {
		this.wrapperRef = node as HTMLElement;
	}

	private onClick() {
		if (this.state.status === 'NotStarted') {
			this.setState({
				status: 'Input'
			});
		}
	}

	private onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			// We could have been in the error state, so explicitly set status
			status: 'Input',
			nameInputValue: event!.target!.value
		});
	}

	private setInputRefAndFocus(node: HTMLInputElement) {
		this.inputRef = node;
		if (this.inputRef) {
			this.inputRef.focus();
		}
	}
}
