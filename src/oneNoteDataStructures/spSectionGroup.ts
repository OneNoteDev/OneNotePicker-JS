import {SectionGroup} from './sectionGroup';

// TODO (machiam) is this correct?
export interface SpSectionGroup extends SectionGroup {
	siteId: string;
	siteCollectionId: string;
	selfUrl: string;
}
