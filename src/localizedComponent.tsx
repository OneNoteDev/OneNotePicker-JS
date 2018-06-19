import * as React from 'react';

import { Strings } from './strings';

export interface LocalizedComponentProps {
	stringOverrides: {} | undefined;
}

/**
 * Wrapper component that sets localized strings.
 */
export class LocalizedComponent extends React.Component<LocalizedComponentProps, {}> {
	constructor(props: LocalizedComponentProps) {
		super(props);
		Strings.setOverrides(props.stringOverrides);
	}

	render() {
		return (<div>{this.props.children}</div>);
	}
}
