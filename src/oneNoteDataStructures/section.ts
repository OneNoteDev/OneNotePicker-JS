import Page from './page';

interface Section {
	id: string;
	name: string;
	expanded: boolean;
	pages: Page[] | undefined;
}

export default Section;
