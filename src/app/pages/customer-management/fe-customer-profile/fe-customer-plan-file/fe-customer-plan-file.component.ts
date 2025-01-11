import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '@postnerd-core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AccountService} from '@api';

@Component({
  selector: 'fe-customer-plan-file',
  templateUrl: './fe-customer-plan-file.component.html',
  styleUrls: ['./fe-customer-plan-file.component.scss']
})
export class FeCustomerPlanFileComponent implements OnInit {

  @ViewChild('detailfileModal') detailfileModal: ModalComponent;
  @Input() data: any;
  @Input() account: boolean;
  @Input() customer: boolean;

  mode: string;
  fileType: string;
  accountFile: any;

  fileData = [
    {fileName: 'Bank Account', type: 'bankAcc', typeForAccountFile: 'BankAccount'},
    {fileName: 'Amendment Form', type: 'app', typeForAccountFile: 'Others'},
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
  }

  getOpenAccountFile() {
    this.spinner.show('global');
    this.accountService.accountFileGet$(this.data.userId, this.fileType).subscribe(data => {
      console.log('data file iss', data);
      this.accountFile = data;
      this.spinner.hide('global');
      this.detailfileModal.open();

    });
  }

  getOpenCusTomerFile() {
    this.spinner.show('global');
    this.accountService.accountFileGet$(this.data.id, this.fileType).subscribe(data => {;
      this.accountFile = data;
      this.spinner.hide('global');
      this.detailfileModal.open();
    });
  }


  onOpenFileDetailModal(mode, customerData) {

    if (this.customer) {
      this.fileType = mode.typeForAccountFile;
      this.mode = mode.fileName;
      this.getOpenCusTomerFile();
    } else if (this.account) {
      this.fileType = mode.typeForAccountFile;
      this.mode = mode.fileName;
      this.getOpenAccountFile();
    }
  }

}
