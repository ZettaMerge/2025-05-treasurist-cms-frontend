import { Injectable } from '@angular/core';
import {
  AimcCategoryDTO,
  AssetDropdownDTO, AssetTypeDTO,
} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(protected api: PnApiClientService) { }

  public assetDropdownGet$(fcnAccountId?: string): Observable<Array<AssetDropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/asset-management-companies/all`, { fcnAccountId });
  }

  public assetTypeDropdownGet$(aimcCategoryId?: number): Observable<Array<AssetTypeDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/asset-types/all`, { aimcCategoryId });
  }

  public aimcDropdownGet$(): Observable<Array<AimcCategoryDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/aimc-categories/all`);
  }

  public assetFundMappingDropdownGet$(fcnAccountId?: string): Observable<Array<AssetDropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/asset-management-companies/dropdown-from-fund-mapping`, { fcnAccountId });
  }

  public assetFundMappingDropdownWithoutFundMappingGet$(): Observable<Array<AssetDropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/asset-management-companies/dropdown-without-fund-mapping`, undefined);
  }



}
