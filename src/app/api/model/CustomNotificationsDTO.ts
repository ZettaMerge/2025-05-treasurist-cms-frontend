import {DocumentFileDTO} from './DocumentFileDTO';

export interface ReferTo {
  id: number;
  title: string;
}

export interface ReferentFrom {
  id: number;
  title: string;
}

export interface CustomNotificationsDTO {
  agentUserIds: string;
  balanceIds: string;
  customerUserIds: string;
  detail: string;
  docFiles: string;
  documentFiles: DocumentFileDTO[];
  id: number;
  isPublishAgent: boolean;
  isPublishCustomer: boolean;
  publishedBy: string;
  publishedDate: Date;
  referTo: ReferTo[];
  referentFrom: ReferentFrom;
  referentNotiId: number;
  status: string;
  title: string;
  type: string;
}


