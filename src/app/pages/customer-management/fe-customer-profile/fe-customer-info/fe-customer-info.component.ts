import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent } from '@postnerd-core';
import * as moment from 'moment';
import { AccountService, CustomerService, MasterBankService } from '@api';
import { CurrentAddressDTO, IdDocumentAddressDTO, MailingAddressDTO, OpenAccountDTO, WorkAddressDTO } from '@model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'fe-customer-info',
  templateUrl: './fe-customer-info.component.html',
  styleUrls: ['./fe-customer-info.component.scss']
})
export class FeCustomerInfoComponent implements OnInit, OnChanges {

  @Input() data;
  @ViewChild('formNoteModal') formNoteModal: ModalComponent;
  @ViewChild('rejectDetailModal') rejectDetailModal: ModalComponent;
  @ViewChild('riskModal') modal: ModalComponent;
  @ViewChild('cddModal') cddModal: ModalComponent;

  @Output() onEmitAccountId = new EventEmitter();

  accountId: string;
  date: any;
  userId: any;
  accountData: OpenAccountDTO = {} as OpenAccountDTO;

  vulnerableDataList = [
    { id: 1, title: 'มีอายุตั้งแต่ 60 ปี', isAllow: false, isNotAllow: false, value: '60YearsOld' },
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
    { id: 1, title: 'มีความสัมพันธ์กับการเมืองมีประวัติการกระทำผิดกฎหมายฟอกเงินในช่วงสามปีที่ผ่านมา', isAllow: false },
    { id: 2, title: 'เคยถูกปฎิเสธการเปิดบัญชีจากสถาบันการเงิน', isAllow: false },
    { id: 3, title: 'เคยหรืออยู่ระหว่างการถูกฟ้องร้อง/ถูกบังคับคดีทางศาล', isAllow: false },
    {
      id: 4,
      title: 'มีบุคคลที่ได้รับผลประโยชน์จากการทำธุรกรรม หรือมีอำนาจควบคุมการทำธุรกรรม (ตรวจสอบนอมอนี)',
      isAllow: false
    },
  ];
  americanDataList = [
    { id: 1, title: 'มีสัญชาติอเมริกัน / เกิดที่สหรับอเมริกา / มีที่อยู่ถาวรสหรัฐอเมริกา', isAllow: false },
    {
      id: 2,
      title: 'มีที่อยู่ปัจจุบัน หรือที่อยู่เพื่อการติดต่อ หรือที่อยู่เพื่อรับส่งไปรษณีย์แทน ในสหรัฐอเมริกา',
      isAllow: false
    },
    { id: 3, title: 'มีที่อยู่ชั่วคราวในสหรัฐอเมริกา หรือ เคยอาศัยอยู่ในอเมริกาเกินกว่า 183 วัน', isAllow: false },
    { id: 4, title: 'มีหมายเลขโทรศัพท์ในสหรัฐอเมริกา', isAllow: false },
    {
      id: 5,
      title: 'มีการมอบอำนาจให้บุคคลอื่นที่มีที่อยู่ในสหรัฐอเมริกา ดำเนินการเกี่ยวข้องกับบัญชีแทน',
      isAllow: false
    },
    { id: 6, title: 'มีการตั้งคำสั่งทำรายการโอนเงินเป็นประจำล่วงหน้าไปยังบัญชีที่อยู่ในสหรัฐอเมริกา', isAllow: false },
    { id: 7, title: 'เป็นบริษัทที่มีการจดทะเบียนจัดตั้งในสหรัฐอเมริกา', isAllow: false },
    {
      id: 7,
      title: 'เป็นบริษัทที่มีข้อมูลบ่งชี้ได้ว่า มีความเกี่ยวพันกับสหรัฐอเมริกาซึ่งมีบุคคลอเมริกัน เป็นผู้ถือหุ้นไม่ว่าทางตรงหรือทางอ้อม ในสัดส่วนของหุ้นรวมกันเกินกว่า 10%',
      isAllow: false
    },
  ];

  statusFx = true;
  statusCommo = false;

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    protected dropdownBankService: MasterBankService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data.id) {
      this.getAccountId();
    }
  }

  ngOnInit(): void {
    // if (this.data.id) {
    //   this.getAccountId();
    // }
  }

  getAccountId() {
    this.spinner.show('global');
    // console.log('dataa issssss maring', this.data);

    this.customerService.customerIdInfoGet$(this.data.id).subscribe(data => {
      // console.log('accountId', data);
      if (data.accountId) {
        this.accountService.openAccountDetailIdGet$(data.accountId).subscribe(accData => {
          console.log('acc Data', accData);
          this.onEmitAccountId.emit(accData);
          this.accountData = accData;
          this.userId = data.userId;


          // check vunerable เปราะบาง
          if (this.accountData.vulnerableFlag === true) {

            if (this.accountData.vulnerableDetail) {
              const convertJson = this.accountData.vulnerableDetail.split(',');
              const vulnerableDetail = [];
              convertJson.forEach(vulnerable => {
                vulnerableDetail.push({ value: vulnerable });
              });
              const vulList = this.vulnerableDataList;
              // check sourceIncome

              for (const vunerable of vulnerableDetail) {
                const valIndex = _.findIndex(this.vulnerableDataList, i => i.value === vunerable.value);

                if (valIndex >= 0) {
                  this.vulnerableDataList[valIndex].isAllow = true;
                  // console.log('valList', vulList);
                }
                // console.log('valList', vulList);
              }

              // หา vulnerable ที่ไม่ใช่ true
              const groupByVulnerable = _.groupBy(vulList, 'isAllow');
              const selectDataFalse = groupByVulnerable.false;

              // console.log('groupByVulnerable', groupByVulnerable);
              // console.log('selectDataFalse', selectDataFalse);
              // console.log('valList', vulList);
              if (selectDataFalse) {
                for (const vulnerableFalseData of selectDataFalse) {
                  const indexFalse = _.findIndex(vulList, i => i.value === vulnerableFalseData.value);

                  if (indexFalse >= 0) {
                    this.vulnerableDataList[indexFalse].isNotAllow = true;
                  }
                }
              }
            } else {
              for (let i = 0; i < 3; i++) {
                this.vulnerableDataList[i].isAllow = true;
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
                cddChoice3Array.push({ value: Number(cddChoice) });
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
              // console.log('income cddNo3Choice', this.accountData.cddNo4Choice);
              const convertJson = this.accountData.cddNo4Choice.split(',');
              const cddChoice4Array = [];
              // console.log('convertJson', convertJson);
              convertJson.forEach(cddChoice => {
                cddChoice4Array.push({ value: Number(cddChoice) });
              });
              // check sourceIncome

              for (const cddChoice4 of cddChoice4Array) {
                const cddIndex = _.findIndex(this.americanDataList, i => i.id === cddChoice4.value);

                // console.log('index iss', cddIndex);
                if (cddIndex >= 0) {
                  this.americanDataList[cddIndex].isAllow = true;
                }
              }
            }

          }


        });
      }
      this.spinner.hide('global');
    });

    // this.getDataById();
  }


  onOpenRiskModal() {
    this.modal.open();
  }

  openCddScoreModal(event) {
    this.cddModal.open();
  }

}
