import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CheckPermissionService, FundService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerPortfolioDTO, CustomerPortOverviewDTO} from '@model';
import {Router} from "@angular/router";
import {PnStorageService} from "@postnerd-core";
import {PermissionEnum} from "@app/core/variables/permission.enum";

@Component({
  selector: 'fe-customer-portfolio-detail',
  templateUrl: './fe-customer-portfolio-detail.component.html',
  styleUrls: ['./fe-customer-portfolio-detail.component.scss']
})
export class FeCustomerPortfolioDetailComponent implements OnInit, OnChanges{

  @Input() fundPlanId: number;
  @Input() fcnAccountId: string;
  @Input() fundCode: string;

  fundPlanData: CustomerPortOverviewDTO = {} as CustomerPortOverviewDTO;
  canView: boolean;

  constructor(
    private fundService: FundService,
    private spinner: NgxSpinnerService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.fundPlanId) {
      this.getFundPlanById();
    }
  }

  ngOnInit(): void {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.OrderTransaction).then(result => {
      if (result) {
        this.canView = result.canView;
      }
      console.log('this.canView', this.canView);
    });
    // this.getFundPlanById();
  }

  goToTransactionList(mode) {
    const url = `./order/transaction/${this.fcnAccountId}/${mode}`;
    window.open(url, '_blank');
  }

  goToDividendDetail(fundPlanData) {
    console.log('fcnAccountId', fundPlanData?.fcnAccountId);
    const url = `./customer/dividend/${fundPlanData?.fcnAccountId}`;
    window.open(url, '_blank');
  }

  goToDcaDetail(fundPlanData) {
    const url = `./customer/dca/${fundPlanData?.fcnAccountId}`;
    window.open(url, '_blank');
  }

  getFundPlanById() {
    this.spinner.show('global');
    console.log('this.fundPlanId', this.fundPlanId);
    this.fundService.fundPlanByIdGet$(this.fundPlanId).subscribe(
      (data) => {
        this.fundPlanData = data;
        console.log('data plans', this.fundPlanData);
        this.spinner.hide('global');
      });
    // this.fundPlanByIdGet$
  }

}
