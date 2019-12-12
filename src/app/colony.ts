import { IcollectionInfo } from './collection-info';

export interface Icolony {
  id: number;
  name: string;
  beeCount: number;
  hiveCount: number;
  collectionInfo: IcollectionInfo[];
}
