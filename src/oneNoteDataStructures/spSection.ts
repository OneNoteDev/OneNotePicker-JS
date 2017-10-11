import {Section} from './section';

export interface SpSection extends Section {
	siteId: string;
	siteCollectionId: string;
	selfUrl: string;
}
