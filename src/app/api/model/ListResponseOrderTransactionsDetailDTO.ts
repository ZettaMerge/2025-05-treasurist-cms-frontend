import { OrderTransactionListDTO } from '@model';
import { Pagination } from './Pagination';
import { Sort } from './Sort';

export interface ListResponseOrderTransactionsDetailDTO {
  redemption: OrderTransactionListDTO;
  subscription: OrderTransactionListDTO;
}
