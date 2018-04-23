import { Strings } from '../../strings';
import { Constants } from '../../constants';

export class CreateNewSectionCommonProperties {
	constructor(private parentId: string) { }

	getId(): string {
		return Constants.TreeView.createNewSectionIdPrefix + this.parentId;
	}

	getName(): string {
		return Strings.get('Label.CreateSection');
	}

	isSelected(): boolean {
		return false;
	}

	isAriaSelected(): boolean {
		return false;
	}
}
