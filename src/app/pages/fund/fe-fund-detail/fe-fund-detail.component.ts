import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {AssetService, CheckPermissionService, FundService} from '@api';
import * as _ from 'lodash';
import {FundByIdDTO} from '../../../api/model/FundByIdDTO';
import {FundUpdateByIdDTO} from '@model';
import {PnStorageService} from "@postnerd-core";
import {PermissionEnum} from "@app/core/variables/permission.enum";

@Component({
  selector: 'fe-fund-detail',
  templateUrl: './fe-fund-detail.component.html',
  styleUrls: ['./fe-fund-detail.component.scss']
})
export class FeFundDetailComponent implements OnInit {

  fundId: string;
  dataSub: Subscription;
  status: boolean;
  fundData: FundByIdDTO = {} as FundByIdDTO;
  fundUpdateData: FundUpdateByIdDTO = {} as FundUpdateByIdDTO;
  aimcName: any;
  calFlag: boolean;

  canCreate: boolean;
  canView: boolean;

  aimcList = [];
  calFlagList = [
    {value: true, label: 'ใช่'},
    {value: false, label: 'ไม่ใช่'}
  ];

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fundService: FundService,
    protected assetService: AssetService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnInit(): void {

    // CHECK PERMISSION
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.FundData).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.canView = result.canView;
      }

      console.log('result', result);
    });


    this.fundId = this.route.snapshot.paramMap.get('id');
    console.log('fundId', this.fundId);
    if (this.fundId) {
      this.getFundById();
      // this.getAimcDropdown();
    }
  }

  getAimcDropdown() {
    this.assetService.aimcDropdownGet$().subscribe(aimcData => {
      console.log('data dd', aimcData);
      for (const aimc of aimcData) {
        this.aimcList.push({id: aimc.id, name: `${aimc.aimcName} (${aimc.categoryCode})`});
      }
      console.log('thaimc list', this.aimcList);
    });

  }


  getFundById() {
    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.fundService.fundByIdGet$(_.toNumber(this.fundId), undefined).subscribe(data => {
      console.log('dataa fundd', data);
      this.fundData = data;
      this.status = this.fundData.isActive;


      if (this.fundData.calFlag === 'Y') {
        this.calFlag = true;
      } else {
        this.calFlag = false;
      }
      this.spinner.hide('global');
    });
  }

  onChangeCalFlag(event) {
    if (event) {
      this.fundData.calFlag = event;
    }
  }

  aimcOnchange(event) {
    if (event) {
      console.log('event', event);
      this.aimcName = event.aimcName;
      this.assetService.assetTypeDropdownGet$(event.id).subscribe(data => {
        console.log('fund type data', data);
        for (const fundType of data) {
          console.log('dataa fund type iss', fundType.enFundType);
          this.fundData.fundType = fundType.enFundType;
        }
      });
    } else {
      console.log('no event', event);
      this.fundData.fundType = undefined;
      console.log('dataa fund type iss', event);

    }
  }

  onSave(form) {

    if (form.invalid) {
      return;
    } else {
      this.spinner.show('global');
      if (this.aimcName) {
        this.fundUpdateData.aimcCatName = this.aimcName;
      } else {
        this.fundUpdateData.aimcCatName = this.fundData.aimcCatName;
      }

      if (this.calFlag === true) {
        this.fundUpdateData.calFlag = 'Y';
      } else {
        this.fundUpdateData.calFlag = 'N';
      }

      if (_.isNil(this.status)) {
        this.fundUpdateData.isActive = false;
      } else {
        this.fundUpdateData.isActive = this.status;
      }


      this.fundUpdateData.remark = this.fundData.remark;

      console.log('fundUpdateData', this.fundUpdateData);

      this.fundService.fundUpdatePut$(this.fundData.id, this.fundUpdateData).subscribe(data => {
        console.log('dataa fund update', data);
        this.router.navigate([`./fund`]);
        this.spinner.hide('global');
      });
    }

  }

  onStatusChange(e) {
    console.log('event', e);
  }

  goBack() {
    this.router.navigate([`./fund`]);
  }

}
