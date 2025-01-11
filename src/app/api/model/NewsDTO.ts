import { NewsImageDTO } from './NewsImageDTO';

export interface NewsDTO {
  createdBy: string;
  createdDate: Date;
  deletedBy: string;
  deletedDate: Date;
  updatedBy: string;
  updatedDate: Date;
  id: number;
  title: string;
  detail: string;
  status: string;
  coverImage: string;
  images: NewsImageDTO[];
  isFeature: boolean;
  isPinned: boolean;
}
