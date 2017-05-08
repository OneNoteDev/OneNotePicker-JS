import Page from './page';

interface Section {
	id: string;
	name: string;
	expanded: boolean;
	pages: Page[] | void;
}

export default Section;
