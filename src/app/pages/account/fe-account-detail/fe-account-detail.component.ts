import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  CurrentAddressDTO,
  CustomerProfileDTO,
  IdDocumentAddressDTO,
  MailingAddressDTO,
  OpenAccountDTO,
  WorkAddressDTO
} from '@model';
import {AccountService, CustomerService, MasterBankService} from '@api';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import {ModalComponent} from '@postnerd-core';

@Component({
  selector: 'fe-account-detail',
  templateUrl: './fe-account-detail.component.html',
  styleUrls: ['./fe-account-detail.component.scss']
})
export class FeAccountDetailComponent implements OnInit {

  @ViewChild('formNoteModal') formNoteModal: ModalComponent;
  @ViewChild('rejectDetailModal') rejectDetailModal: ModalComponent;
  @ViewChild('riskModal') modal: ModalComponent;
  @ViewChild('cddModal') cddModal: ModalComponent;

  accountId: string;
  date: any;
  userId: any;
  accountData: OpenAccountDTO = {} as OpenAccountDTO;
  idDocumentAddressData: IdDocumentAddressDTO = {} as IdDocumentAddressDTO;
  currentAddressData: CurrentAddressDTO = {} as CurrentAddressDTO;
  mailingAddressData: MailingAddressDTO = {} as MailingAddressDTO;
  workAddressData: WorkAddressDTO = {} as WorkAddressDTO;
  dataSub: Subscription;
  bankCode: string;
  branchBankCode: string;

  isResendEmailText: boolean;

  fx = true;
  comMo = false;

  vulnerableDataList = [
    {id: 1, title: 'มีอายุตั้งแต่ 60 ปี', isAllow: false, isNotAllow: false, value: '60YearsOld'},
    {
      id: 2,
      title: 'ไม่มีความรู้ด้านการเงินและการลงทุน และ/หรือ ไม่มีประสบการณ์ลงทุน',
      isAllow: false,
      isNotAllow: false,
      value: 'NoInvestmentKnowledge'
    },
    {
      id: 3,
      title: 'มีข้อจำกัดในการสื่อสารหรือตัดสินใจ เช่น มีความบกพร่องทางการได้ยินหรือการมองเห็น หรือมีภาวะทางสุขภาพ',
      isAllow: false,
      isNotAllow: false,
      value: 'Disability'
    },
  ];
  criminalDataList = [
    {id: 1, title: 'มีความสัมพันธ์กับการเมืองมีประวัติการกระทำผิดกฎหมายฟอกเงินในช่วงสามปีที่ผ่านมา', isAllow: false},
    {id: 2, title: 'เคยถูกปฎิเสธการเปิดบัญชีจากสถาบันการเงิน', isAllow: false},
    {id: 3, title: 'เคยหรืออยู่ระหว่างการถูกฟ้องร้อง/ถูกบังคับคดีทางศาล', isAllow: false},
    {
      id: 4,
      title: 'มีบุคคลที่ได้รับผลประโยชน์จากการทำธุรกรรม หรือมีอำนาจควบคุมการทำธุรกรรม (ตรวจสอบนอมอนี)',
      isAllow: false
    },
  ];
  americanDataList = [
    {id: 1, title: 'มีสัญชาติอเมริกัน / เกิดที่สหรับอเมริกา / มีที่อยู่ถาวรสหรัฐอเมริกา', isAllow: false},
    {
      id: 2,
      title: 'มีที่อยู่ปัจจุบัน หรือที่อยู่เพื่อการติดต่อ หรือที่อยู่เพื่อรับส่งไปรษณีย์แทน ในสหรัฐอเมริกา',
      isAllow: false
    },
    {id: 3, title: 'มีที่อยู่ชั่วคราวในสหรัฐอเมริกา หรือ เคยอาศัยอยู่ในอเมริกาเกินกว่า 183 วัน', isAllow: false},
    {id: 4, title: 'มีหมายเลขโทรศัพท์ในสหรัฐอเมริกา', isAllow: false},
    {
      id: 5,
      title: 'มีการมอบอำนาจให้บุคคลอื่นที่มีที่อยู่ในสหรัฐอเมริกา ดำเนินการเกี่ยวข้องกับบัญชีแทน',
      isAllow: false
    },
    {id: 6, title: 'มีการตั้งคำสั่งทำรายการโอนเงินเป็นประจำล่วงหน้าไปยังบัญชีที่อยู่ในสหรัฐอเมริกา', isAllow: false},
    {id: 7, title: 'เป็นบริษัทที่มีการจดทะเบียนจัดตั้งในสหรัฐอเมริกา', isAllow: false},
    {
      id: 7,
      title: 'เป็นบริษัทที่มีข้อมูลบ่งชี้ได้ว่า มีความเกี่ยวพันกับสหรัฐอเมริกาซึ่งมีบุคคลอเมริกัน เป็นผู้ถือหุ้นไม่ว่าทางตรงหรือทางอ้อม ในสัดส่วนของหุ้นรวมกันเกินกว่า 10%',
      isAllow: false
    },
  ];


  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    protected dropdownBankService: MasterBankService,
  ) {
  }

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.getCustomerProfileById();
    console.log('accountId ID', this.accountId);
    // this.toastrService.error('Delete success.');
    // this.toastrService.success('Delete success.');

  }

  goBack() {
    this.router.navigate([`./account/account-ats-approval`]);
  }

  convertDate(date) {
    return date ? moment(date, 'YYYYMMDD').format('DD/MM/YYYY') : '-';
    // if (date) {
    //   const convertDate = moment(date, 'YYYYMMDD');
    //   date = convertDate.format('DD/MM/YYYY');
    //   return date;
    // } else {
    //   date = '-';
    //   return date;
    // }
  }

  getCustomerProfileById() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.accountService.openAccountDetailIdGet$(_.toNumber(this.accountId)).subscribe(data => {
      this.accountData = data;
      this.userId = data.userId;


      // check vunerable เปราะบาง
      if (this.accountData.vulnerableFlag === true) {
        const convertJson = this.accountData.vulnerableDetail.split(',');
        const vulnerableDetail = [];
        convertJson.forEach(vulnerable => {
          vulnerableDetail.push({value: vulnerable});
        });
        let vulList = this.vulnerableDataList;
        // check sourceIncome

        for (const vunerable of vulnerableDetail) {
          const valIndex = _.findIndex(this.vulnerableDataList, i => i.value === vunerable.value);

          if (valIndex >= 0) {
            this.vulnerableDataList[valIndex].isAllow = true;
            console.log('valList', vulList);
          }
          console.log('valList', vulList);
        }

        // หา vulnerable ที่ไม่ใช่ true
        const groupByVulnerable = _.groupBy(vulList, 'isAllow');
        const selectDataFalse = groupByVulnerable.false;

        console.log('groupByVulnerable', groupByVulnerable);
        console.log('selectDataFalse', selectDataFalse);
        console.log('valList', vulList);
        if (selectDataFalse) {
          for (const vulnerableFalseData of selectDataFalse) {
            const indexFalse = _.findIndex(vulList, i => i.value === vulnerableFalseData.value);

            if (indexFalse >= 0) {
              this.vulnerableDataList[indexFalse].isNotAllow = true;
            }
          }
        }

      } else if (this.accountData.vulnerableFlag === false) {
        for (let i = 0; i < 3; i++) {
          this.vulnerableDataList[i].isNotAllow = true;
        }
      }
      // check criminal
      if (this.accountData.cddNo3 === true) {

        if (this.accountData.cddNo3 && this.accountData.cddNo3Choice) {
          const convertJson = this.accountData.cddNo3Choice.split(',');
          const cddChoice3Array = [];
          convertJson.forEach(cddChoice => {
            cddChoice3Array.push({value: Number(cddChoice)});
          });
          // check sourceIncome

          for (const cddChoice3 of cddChoice3Array) {
            const cddIndex = _.findIndex(this.criminalDataList, i => i.id === cddChoice3.value);

            if (cddIndex >= 0) {
              this.criminalDataList[cddIndex].isAllow = true;
            }
          }
        }

      }


      // check american
      if (this.accountData.fatca === true) {

        if (this.accountData.fatca && this.accountData.cddNo4Choice) {
          console.log('income cddNo3Choice', this.accountData.cddNo4Choice);
          const convertJson = this.accountData.cddNo4Choice.split(',');
          const cddChoice4Array = [];
          console.log('convertJson', convertJson);
          convertJson.forEach(cddChoice => {
            cddChoice4Array.push({value: Number(cddChoice)});
          });
          // check sourceIncome

          for (const cddChoice4 of cddChoice4Array) {
            const cddIndex = _.findIndex(this.americanDataList, i => i.id === cddChoice4.value);

            console.log('index iss', cddIndex);
            if (cddIndex >= 0) {
              this.americanDataList[cddIndex].isAllow = true;
            }
          }
        }

      }

      // check Bank
      if (this.accountData.bankCode) {
        this.dropdownBankService.dropdownBankGet$().subscribe(data => {
          const findBankCode = data.find(bc => bc.bankCode === this.accountData.bankCode);
          this.bankCode = findBankCode.thName;
        });
      }

      if (this.accountData.branchCode) {
        this.dropdownBankService.dropdownBankBranchGet$(this.accountData.bankCode).subscribe(data => {
          const findBranchCode = data.find(bc => bc.branchCode === this.accountData.branchCode);
          this.branchBankCode = findBranchCode.thName;
        });
        // const findBankCpde = _.find()
      }

      this.spinner.hide('global');
      console.log('data by id', this.accountData);
    });
  }

  onClickApprove(id) {
    this.spinner.show('global');
    if (id) {
      console.log('on nect save approve', id);
      this.accountService.accountApprovePut$(id).subscribe(data => {
        this.router.navigate([`./account/account-ats-approval`]);
        this.spinner.hide('global');
      }, (error) => {
        console.log('error', error);
        // this.isError = false;
        if (error && error.error) {
          const errors = JSON.parse(error.error);
          this.toastrService.error(`${errors.errorMessage}`);
        }
      });
    }
  }

  onClickReSendEmail(userId) {
    this.spinner.show('global');
    if (userId) {
      this.accountService.accountResendRegisterEmailPut$(userId).subscribe(data => {
        this.toastrService.success(`ระบบได้ส่งอีเมลแจ้งเตือนสำเร็จ`);
        this.isResendEmailText = true;
        setTimeout(() => {
          this.isResendEmailText = false;
          this.getCustomerProfileById();
        }, 100000);
        this.spinner.hide('global');
      });
    }

  }

  goToNoteForm(event) {
    if (event) {
      this.accountId = _.toNumber(this.accountId);
      this.formNoteModal.open();
    }

  }

  goToRejectDetail(event) {
    if (event) {
      this.accountId = _.toNumber(this.accountId);
      this.rejectDetailModal.open();
    }
  }

  onOpenRiskModal() {
    this.modal.open();
  }

  openCddScoreModal(event) {
    this.cddModal.open();
  }

  close(event) {
    console.log('on nect save reject', event);
    this.spinner.show('global');
    if (event) {
      console.log('on nect save reject', event);
      this.accountData.accountStatus = 'Rejected';
      this.accountService.openAccountPost$(this.accountData).subscribe(data => {
        this.formNoteModal.close();
        this.router.navigate([`./account/account-ats-approval`]);
        this.spinner.hide('global');
      });
    }
  }

  save(event) {
    console.log('save reject');
    this.spinner.show('global');
    if (event) {
      console.log('save reject', event);
      this.accountData.accountStatus = 'Rejected';
      this.accountService.openAccountPost$(this.accountData).subscribe(data => {
        this.formNoteModal.close();
        this.router.navigate([`./account/account-ats-approval`]);
        this.spinner.hide('global');
      });
    }
  }

  onGetCddScore() {
    this.getCustomerProfileById();
    this.cddModal.close();
  }

}
