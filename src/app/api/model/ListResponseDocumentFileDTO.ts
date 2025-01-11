import { Pagination } from '@model';
import { DocumentFileDTO } from './DocumentFileDTO';

export interface ListResponseDocumentFileDTO<T> {
  documentFiles: DocumentFileDTO[];
  pagination: Pagination;

}
