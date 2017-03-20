/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />

import {ComponentBase} from "../componentBase";
import {Utils} from "../../utils";

export interface ExpandableEntityState {
	isOpened: boolean;
}

export interface ExpandableEntityProps {
	curSectionId: string;
	curSectionIdPath?: string[];
	path: string;
	tabIndex: number;
}

/**
 * Represents an expandable entity that can contain sections or additional expandable
 * entities as direct children. Render() is a template method that requires several
 * abstract method 'steps' to be defined.
 */
export abstract class ExpandableEntityComponentBase
	<TState extends ExpandableEntityState, TProps extends ExpandableEntityProps>
	extends ComponentBase<TState, TProps> {

	abstract getDirectChildren(): any[];
	abstract getEntityClassName(): string;
	abstract getId(): string;
	abstract getImageClassName(): string;
	abstract getImagePath(): string;
	abstract getLabel(): string;

	getInitialState() {
		return {
			isOpened: this.isPartOfCurSectionIdPath()
		} as TState;
	}

	protected isPartOfCurSectionIdPath(): boolean {
		if (this.props.curSectionIdPath) {
			if (this.props.curSectionIdPath[0] === this.getId()) {
				return true;
			}
		}
		return false;
	}

	onClicked(id: string, event: UIEvent) {
		this.setState({
			isOpened: !this.state.isOpened
		} as TState);
		event.stopPropagation();
	}

	render() {
		let childRows = this.getDirectChildren();
		let openedClassName = this.state.isOpened ? "Opened" : "Closed";

		let className = this.getEntityClassName() + " " + openedClassName;
		let labelText = this.getLabel();

		return (
			<li role="treeitem" className={className} {...this.enableInvoke(this.onClicked.bind(this), this.props.tabIndex, this.getId()) }
					aria-expanded={this.state.isOpened}>
				<div className="EntityImageAndNameContainer">
					<div className="ExpandCollapseContainer">
						<div className="Expand">
							<img className="ExpandImage" src={Utils.getImageResourceUrl("arrow_right.png")} />
						</div>
						<div className="Collapse">
							<img className="CollapseImage" src={Utils.getImageResourceUrl("arrow_down.png")} />
						</div>
					</div>
					<div className="EntityImage">
						<img className={this.getImageClassName()} src={this.getImagePath()}/>
					</div>
					<div className="EntityNameContainer">
						<label className="EntityName">{labelText}</label>
					</div>
				</div>
				<ul role="group">
					{childRows}
				</ul>
			</li>
		);
	}
}
