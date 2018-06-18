import { Strings } from '../../strings';
import { Constants } from '../../constants';

export class RecentSectionsCommonProperties {
	getId(): string {
		return Constants.TreeView.recentSectionsId;
	}

	getName(): string {
		return Strings.get('Label.RecentSections');
	}

	isSelected(): boolean {
		return false;
	}

	isAriaSelected(): boolean {
		return false;
	}
}
