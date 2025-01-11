import {AuditRiskDTO, ContentAcceptedUser} from '@model';
import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseAuditRiskListDTO<T> {
  auditRisks: AuditRiskDTO[];
  pagination: Pagination;

}
