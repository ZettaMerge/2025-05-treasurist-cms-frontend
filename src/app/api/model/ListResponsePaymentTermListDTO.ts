import { PaymentTermDTO, Pagination} from '@model';

export interface ListResponsePaymentTermListDTO<T> {
  paymentTerms: PaymentTermDTO[];
  pagination: Pagination;

}
