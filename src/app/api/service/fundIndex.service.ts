import { Injectable } from "@angular/core";
import {
  AccountDTO,
  BankAccountDTO,
  ListResponseAccountATSDTO,
  OpenAccountDTO,
  ContentDTO,
  AccountFileDTO,
  CddScoreDTO,
  FundIndexTypeDTO,
  ListResponseFundIndexDTO,
  ListResponseFundIndexIndexTypeDTO,
  IndexTypeDTO,
  FundIndexDTO,
  FundIndexCalculateFundDTO,
  CalculateIndexTransactionDTO,
} from "@model";
import { PnApiClientService } from "@postnerd-core";
import { Observable } from "rxjs";
import { apiBaseUrl } from "../api-base-url";
import { IndexType } from "typescript";

@Injectable({
  providedIn: "root",
})
export class FundIndexService {
  constructor(protected api: PnApiClientService) { }

  public fundIndexIndexTypeListGet$(
    columnName?: string,
    direction?: string,
    isActive?: boolean,
    limit?: number,
    name?: string,
    page?: number
  ): Observable<ListResponseFundIndexIndexTypeDTO<IndexTypeDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/fund-index/index-type`, {
      columnName,
      direction,
      isActive,
      limit,
      name,
      page,
    });
  }

  public fundIndexIndexTypeIdGet$(id: number): Observable<IndexTypeDTO> {
    return this.api.get(
      `${apiBaseUrl()}/manage/fund-index/index-type/${encodeURIComponent(
        String(id)
      )}`,
      undefined
    );
  }

  public fundIndexIndexTypePost$(dto: IndexTypeDTO): Observable<IndexTypeDTO> {
    return this.api.post(
      `${apiBaseUrl()}/manage/fund-index/index-type`,
      dto,
      undefined
    );
  }

  public fundIndexIndexTypePut$(
    id: number,
    dto: IndexTypeDTO
  ): Observable<IndexTypeDTO> {
    return this.api.put(
      `${apiBaseUrl()}/manage/fund-index/index-type/${encodeURIComponent(
        String(id)
      )}`,
      dto,
      undefined
    );
  }

  public fundIndexIndexTypeDelete$(id: number): Observable<any> {
    return this.api.delete(
      `${apiBaseUrl()}/manage/fund-index/index-type/${encodeURIComponent(
        String(id)
      )}`,
      undefined
    );
  }

  public fundIndexTypeListGet$(
    page?: number,
    limit?: number,
    amcCode?: string,
    fundCode?: string,
    indexTypeId?: number,
    isActive?: boolean,
    keyword?: string,
    columnName?: string,
    direction?: string
  ): Observable<ListResponseFundIndexDTO<FundIndexTypeDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/fund-index`, {
      page,
      limit,
      amcCode,
      fundCode,
      indexTypeId,
      isActive,
      keyword,
      columnName,
      direction,
    });
  }

  public fundIndexPost$(dto: FundIndexDTO): Observable<any> {
    return this.api.post(
      `${apiBaseUrl()}/manage/fund-index`,
      dto,
      undefined
    );
  }

  public fundIndexPut$(
    dto: IndexTypeDTO
  ): Observable<IndexTypeDTO> {
    return this.api.put(
      `${apiBaseUrl()}/manage/fund-index`,
      dto,
      undefined
    );
  }

  public fundIndexDelete$(id: number): Observable<any> {
    return this.api.delete(
      `${apiBaseUrl()}/manage/fund-index/${encodeURIComponent(
        String(id)
      )}`,
      undefined
    );
  }

  public fundIndexPatch$(id: number): Observable<any> {
    return this.api.patch(
      `${apiBaseUrl()}/manage/fund-index/${encodeURIComponent(
        String(id)
      )}/update-is-active`,
      undefined
    );
  }

  public fundIndexByFundCodeGet$(fundCode: string): Observable<IndexTypeDTO> {
    return this.api.get(
      `${apiBaseUrl()}/manage/fund-index/fund-code/${encodeURIComponent(
        String(fundCode)
      )}`,
      undefined
    );
  }

  public fundIndexTypeALlListGet$(
    page?: number,
    limit?: number,
    amcCode?: string,
    fundCode?: string,
    indexTypeId?: number,
    isActive?: boolean,
    keyword?: string,
    columnName?: string,
    direction?: string
  ): Observable<ListResponseFundIndexDTO<FundIndexTypeDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/fund-index/all-fund`, {
      page,
      limit,
      amcCode,
      fundCode,
      indexTypeId,
      isActive,
      keyword,
      columnName,
      direction,
    });
  }

  public fundIndexCalculateFundAllPost$(dto: FundIndexCalculateFundDTO): Observable<any> {
    return this.api.post(
      `${apiBaseUrl()}/manage/fund-index/calculate-fund-all`, dto, undefined
    );
  }

  public fundIndexCalculateFundIndexPost$(dto: FundIndexCalculateFundDTO): Observable<any> {
    return this.api.post(
      `${apiBaseUrl()}/manage/fund-index/calculate-fund-index`, dto, undefined
    );
  }

  public fundIndexLastCalculateIndexTransactionGet$(): Observable<CalculateIndexTransactionDTO> {
    return this.api.get(
      `${apiBaseUrl()}/manage/fund-index/last-calculate-index-transaction`);
  }

}
