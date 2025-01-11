import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalComponent, PopupService} from '@postnerd-core';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  AccountFileDTO,
  AssessmentSelectDTO,
  CurrentAddressDTO,
  IdDocumentAddressDTO,
  MailingAddressDTO,
  OpenAccountDTO,
  WorkAddressDTO
} from '@model';
import {AccountService, AssetmentService, DropdownService, MasterBankService} from '@api';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'fe-open-account-form-general',
  templateUrl: './fe-open-account-form-general.component.html',
  styleUrls: ['./fe-open-account-form-general.component.scss']
})
export class FeOpenAccountFormGeneralComponent implements OnInit {
  @ViewChild('riskModal') modal: ModalComponent;
  @ViewChild('rejectDetailModal') rejectDetailModal: ModalComponent;

  openAccountData: OpenAccountDTO = {} as OpenAccountDTO;
  idDocumentAddressData: IdDocumentAddressDTO = {} as IdDocumentAddressDTO;
  currentAddressData: CurrentAddressDTO = {} as CurrentAddressDTO;
  mailingAddressData: MailingAddressDTO = {} as MailingAddressDTO;
  workAddressData: WorkAddressDTO = {} as WorkAddressDTO;

  isCurrentIdDocument: boolean;
  isCurrentOther: boolean;
  openAccountId: any;
  userId: any;
  dateType: any;
  date: any;

  bankCode: any;
  bankBranchCode: any;

  dataSub: Subscription;

  // fileUpload
  bankAccountFile: any;
  applicationFormFile: any;
  idCardFrontFile: any;
  suitabilityFile: any;
  fatcaFile: any;
  othersFile: any;

  // currentAddress
  isCurrentAddress: boolean;

  // occupation
  isValidWorkAddress: boolean;
  isValidMailAddress: boolean;
  isValidMailMethod: boolean;

  // income
  isValidIncomeSourceCountry: boolean;
  isValidIncomeSource: boolean;
  isValidInvestMent: boolean;

  // ยืนยันสถานภาพ
  isValidRelationPosition: boolean;
  isValidFatca: boolean;
  isValidCriminal: boolean;
  isValidCriminalYes: boolean;
  isValidFatcaYes: boolean;
  isValidVulnerableNo1: boolean;
  isValidVulnerableNo2: boolean;
  isValidVulnerableNo3: boolean;

  // suitTest
  assetmentTest: any;

  isAddressIdCard = false;
  isAddressOther = false;
  accountValid = false;
  isError: boolean;
  isBankAccountFile: boolean;
  isApplicationFormFile: boolean;
  isIdCardFrontFile: boolean;
  isSuitabilityFile: boolean;
  isFatcaFile: boolean;
  isOthersFile: boolean;
  isAssetment: boolean;

  // อาชีพ
  occupationId: any;


  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    protected dropdownBankService: MasterBankService,
    private assetmentService: AssetmentService,
    private toastrService: ToastrService,
    protected dropdownService: DropdownService,
  ) {
  }

  ngOnInit(): void {
    this.openAccountId = this.route.snapshot.paramMap.get('id');

    if (this.openAccountId) {
      this.getOpenAccountData();
    }
  }

  getOpenAccountData() {

    this.spinner.show('global');

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.accountService.openAccountIdGet$(
      _.toNumber(this.openAccountId)
    ).subscribe((data) => {
      this.openAccountData = data;
      this.userId = data.userId;

      if (data.idDocumentAddress) {
        this.idDocumentAddressData = data.idDocumentAddress;
      }
      if (data.currentAddress) {
        this.currentAddressData = data.currentAddress;
      }
      if (data.mailingAddress) {
        this.mailingAddressData = data.mailingAddress;
      }
      if (data.workAddress) {
        this.workAddressData = data.workAddress;
      }

      // check Business
      if (data.businessTypeId && data.businessTypeId !== '180') {
        // ประเภืธุรกิจที่ไม่ใช่อื่นๆ set businessTypeOther
        this.openAccountData.businessTypeOther = null;
      }

      // chec Political position
      if (data.relatedPoliticalPerson && data.relatedPoliticalPerson !== true) {
        this.openAccountData.politicalRelatePersonPosition = null;
      }

      // checkBirthDate

      if (this.openAccountData.birthdate) {
        this.date = moment(this.openAccountData.birthdate, 'YYYY-MM-DD').add(1, 'day').toDate();
        this.openAccountData.birthdate = this.date;
      }

      // check ที่อยู่ปัจจุบัน
      if (this.openAccountData.currentAddressFlag !== null && this.openAccountData.currentAddressFlag === 'IdDocument') {
        this.isCurrentIdDocument = true;
      } else if (!this.openAccountData.currentAddressFlag && this.openAccountData.currentAddress !== null) {
        this.isCurrentOther = true;
      }

      // check Bank
      if (data.bankCode) {
        const bankCode = data.bankCode;
        this.dropdownBankService.dropdownBankGet$().subscribe(data => {
          const findBankCode = data.find(bc => bc.bankCode === bankCode);
          this.bankCode = findBankCode;
        });
        // const findBankCpde = _.find()
      }

      if (data.branchCode) {
        const branchCode = data.branchCode;
        this.dropdownBankService.dropdownBankBranchGet$(data.bankCode).subscribe(data => {
          const findBranchCode = data.find(bc => bc.branchCode === branchCode);
          this.bankBranchCode = findBranchCode;
        });
        // const findBankCpde = _.find()
      }

      if (this.openAccountId) {
        // check Suitest

        const assetment = this.assetmentService.assetmentIdGet$(this.userId).subscribe(data => {
          console.log('data', data);
          this.assetmentTest = [];
          if (data) {
            this.assetmentTest = data;
          }
        });

        const BankAccount = this.accountService.accountFileGet$(this.userId, 'BankAccount').subscribe(data => {
          this.bankAccountFile = [];
          if (data) {
            this.bankAccountFile = data;
          }

          console.log('bankAccountFile data', data);
          console.log('bankAccountFile data', this.bankAccountFile);
        });
        const ApplicationForm = this.accountService.accountFileGet$(this.userId, 'ApplicationForm').subscribe(data => {
          this.applicationFormFile = [];
          if (data) {
            this.applicationFormFile = data;
          }
        });
        const IdCardFront = this.accountService.accountFileGet$(this.userId, 'IdCardFront').subscribe(data => {
          this.idCardFrontFile = [];
          if (data) {
            this.idCardFrontFile = data;
          }
        });
        const Suitability = this.accountService.accountFileGet$(this.userId, 'Suitability').subscribe(data => {
          this.suitabilityFile = [];
          if (data) {
            this.suitabilityFile = data;
          }
        });
        const Fatca = this.accountService.accountFileGet$(this.userId, 'Fatca').subscribe(data => {
          this.fatcaFile = [];
          if (data) {
            this.fatcaFile = data;
          }
        });
        const Others = this.accountService.accountFileGet$(this.userId, 'Others').subscribe(data => {
          this.othersFile = [];
          if (data) {
            this.othersFile = data;
          }
        });

      }

      this.spinner.hide('global');
    });
  }

  bankOnchange(event, type) {
    console.log('event', event);
    console.log('openAccountData.bankName', this.openAccountData.bankName);

    if (event && type === 'bank') {
      this.bankCode = event;
      this.openAccountData.bankCode = event ? event.bankCode : null;
    } else if (event && type === 'bankBranch') {
      this.openAccountData.branchCode = event ? event.branchCode : null;
    }
    console.log('bankCode', this.bankCode);
  }

  onChangCheckBoxAddressIdCard(event) {
    console.log('onChangCheckBoxCurrentAddressIdCard', event);
    this.isCurrentAddress = false;
    if (event && event === true) {
      this.isCurrentOther = false;
      this.openAccountData.currentAddressFlag = 'IdDocument';
      this.isCurrentIdDocument = event;
      console.log('have current flag', this.openAccountData.currentAddressFlag);
    } else if (event && event === false) {
      this.isCurrentOther = false;
      this.openAccountData.currentAddressFlag = null;
      this.isCurrentIdDocument = event;
    }

    console.log(' this.openAccountData.currentAddressFlag', this.openAccountData.currentAddressFlag);


  }

  onChangCheckBoxAddressOther(event) {
    console.log('onChangCheckBoxAddressOther', event);
    this.isValidWorkAddress = false;
    this.isCurrentAddress = false;
    if (event) {
      this.isCurrentIdDocument = false;
      this.isCurrentOther = event;
      this.openAccountData.currentAddressFlag = null;
    }

  }

  onSaveRisk(event) {
    this.isAssetment = false;
    this.modal.close();
    this.getRiskAssetment();
  }

  onSaveDraft(event) {
    this.spinner.show('global');

    this.accountValid = false;
    this.isError = false;

    if (!this.openAccountData.username) {
      console.log('nodata', this.openAccountData.username);
      this.spinner.hide('global');
      this.accountValid = true;
    }

    if (this.accountValid) {
      console.log('accountValid', this.accountValid);
      this.spinner.hide('global');
      return;
    } else {

      if (this.openAccountId) {
        console.log('have id');
        let req;

        this.openAccountData.isDraft = true;
        this.openAccountData.accountType = 'Individual';
        this.openAccountData.accountStatus = 'Draft';

        if (this.openAccountData.cardExpiredDate) {
          this.openAccountData.cardExpiredDate = moment(this.openAccountData.cardExpiredDate).format('YYYYMMDD');
        } else {
          this.openAccountData.cardExpiredDate = null;
        }

        if (this.openAccountData.maritalStatus && this.openAccountData.maritalStatus === 'Married') {
          this.openAccountData.spouseCardType = this.openAccountData.identificationCardType;
          this.openAccountData.spousePassportCountry = null;
          this.openAccountData.spouseTitle = '';
          this.openAccountData.spouseTitleOther = '';
          this.openAccountData.spouseCardNumber = '';
        } else {
          this.openAccountData.spouseCardType = null;
          this.openAccountData.spousePassportCountry = null;
          this.openAccountData.spouseTitle = null;
          this.openAccountData.spouseTitleOther = null;
          this.openAccountData.spouseCardNumber = null;
          this.openAccountData.spouseEnFirstname = null;
          this.openAccountData.spouseEnLastName = null;
          this.openAccountData.spouseThFirstname = null;
          this.openAccountData.spouseThLastname = null;

        }


        if (this.openAccountData.birthdate) {
          this.dateType = moment(this.openAccountData.birthdate).toString();
          this.date = moment(this.dateType).format('YYYY-MM-DDThh:mm:ss.990Z');
          this.openAccountData.birthdate = this.date;
        }


        // ที่อยู่บัตรประชาชน
        if (this.idDocumentAddressData && this.idDocumentAddressData.roomNo || this.idDocumentAddressData.building || this.idDocumentAddressData.district
          || this.idDocumentAddressData.floor || this.idDocumentAddressData.moo || this.idDocumentAddressData.no || this.idDocumentAddressData.postalCode
          || this.idDocumentAddressData.province || this.idDocumentAddressData.road || this.idDocumentAddressData.soi || this.idDocumentAddressData.subDistrict
        ) {
          // console.log('idDocumentAddressData', this.idDocumentAddressData);
          this.idDocumentAddressData.country = 'TH';
          this.openAccountData.idDocumentAddress = this.idDocumentAddressData;
          // console.log('idDocumentAddressData', this.openAccountData.idDocumentAddress);
        } else {
          // console.log('no sumting idDocumentAddressData');
          // this.openAccountData.idDocumentAddress = null;
        }

        // ที่อยู่ปัจจุบัน
        if (this.openAccountData.currentAddressFlag && this.openAccountData.currentAddressFlag === 'IdDocument') {
          this.openAccountData.currentAddress = this.idDocumentAddressData;
        } else {
          console.log('ถ้าไม่มี current flag');
          if (this.currentAddressData && this.currentAddressData.roomNo || this.currentAddressData.building || this.currentAddressData.district
            || this.currentAddressData.floor || this.currentAddressData.moo || this.currentAddressData.no || this.currentAddressData.postalCode
            || this.currentAddressData.province || this.currentAddressData.road || this.currentAddressData.soi || this.currentAddressData.subDistrict) {
            this.currentAddressData.country = 'TH';
            this.openAccountData.currentAddress = this.currentAddressData;
          } else {
            // this.openAccountData.currentAddress = null;
          }

        }

        // ข้อมูลอาชีพ
        // ที่อยู่ที่ทำงาน && check อาชีพ
        // ที่อยู่ที่ทำงาน
        if (this.openAccountData.workAddressFlag && this.openAccountData.workAddressFlag === 'IdDocument') {
          // console.log('IdDocument');
          this.openAccountData.workAddress = this.openAccountData.idDocumentAddress;
        } else if (this.openAccountData.workAddressFlag && this.openAccountData.workAddressFlag === 'Current') {
          // console.log('Current');
          this.openAccountData.workAddress = this.openAccountData.currentAddress;
        } else if (!this.openAccountData.workAddressFlag) {
          // console.log('no work flag');

          // NOTE เกษตรกร = 20, พระภิกษุ /นักบวช = 25, แม่บ้าน/พ่อบ้าน = 80, เกษียณอายุ = 120, นักลงทุน = 90, นักเรียน/นักศึกษา = 140
          if (this.openAccountData.occupationId === '20' || this.openAccountData.occupationId === '25' ||
            this.openAccountData.occupationId === '80' || this.openAccountData.occupationId === '120' ||
            this.openAccountData.occupationId === '90' || this.openAccountData.occupationId === '140') {

            this.openAccountData.workAddressFlag = null;
            this.openAccountData.workAddress = null;
            // console.log('occ ใช่อาชีพพวกนั้น');

          } else {
            // console.log('occ ไม่ใช่อาชีพพวกนั้น');
            if (this.workAddressData && this.workAddressData.roomNo || this.workAddressData.building || this.workAddressData.district
              || this.workAddressData.floor || this.workAddressData.moo || this.workAddressData.no || this.workAddressData.postalCode
              || this.workAddressData.province || this.workAddressData.road || this.workAddressData.soi || this.workAddressData.subDistrict) {
              // console.log('มี address');
              this.workAddressData.country = 'TH';
              this.openAccountData.workAddress = this.workAddressData;
            } else {
              // console.log('ไม่มี address');
              this.openAccountData.workAddress = null;
            }

          }
        }

        // ที่อยู่ในการจัดส่งเอกสาร
        if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'IdDocument') {
          this.openAccountData.mailingAddress = this.openAccountData.idDocumentAddress;
        } else if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'Current') {
          console.log('mailing', this.currentAddressData);
          this.openAccountData.mailingAddress = this.openAccountData.currentAddress;

        } else if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'Work') {
          this.openAccountData.mailingAddress = this.openAccountData.workAddress;
        } else if (!this.openAccountData.mailAddressFlag) {
          console.log('no mail flag');
          if (this.mailingAddressData && this.mailingAddressData.roomNo || this.mailingAddressData.building || this.mailingAddressData.district
            || this.mailingAddressData.floor || this.mailingAddressData.moo || this.mailingAddressData.no || this.mailingAddressData.postalCode
            || this.mailingAddressData.province || this.mailingAddressData.road || this.mailingAddressData.soi || this.mailingAddressData.subDistrict) {
            this.mailingAddressData.country = 'TH';
            this.openAccountData.mailingAddress = this.mailingAddressData;
          } else {
            // this.openAccountData.mailingAddress = null;
          }

        }


        // // แหล่งที่มาของรายได้
        if (this.openAccountData.incomeSource) {
          const convertJson = JSON.parse(this.openAccountData?.incomeSource);
          const groupByIncomeSource = _.groupBy(convertJson, 'isAllow');
          const selectIncomeData = groupByIncomeSource.true;
          const incomeSourceData = [];

          selectIncomeData.forEach(item => {
            incomeSourceData.push(item.value);
          });
          this.openAccountData.incomeSource = incomeSourceData.toString();
        }

        // // วัตถุประสงค์ในการลงทุน
        if (this.openAccountData.investmentObjective) {
          const convertJson = JSON.parse(this.openAccountData?.investmentObjective);
          const groupByInvest = _.groupBy(convertJson, 'isAllow');
          const selectInvestData = groupByInvest.true;
          const investData = [];

          selectInvestData.forEach(item => {
            investData.push(item.value);
          });
          this.openAccountData.investmentObjective = investData.toString();
        }


        // เปราะบาง
        if (this.openAccountData.vulnerableDetail) {
          const convertJson = JSON.parse(this.openAccountData?.vulnerableDetail);
          const groupByAllow = _.groupBy(convertJson, 'isAllow');
          const groupByNotAllow = _.groupBy(convertJson, 'isNotAllow');
          const selectAllowData = groupByAllow.true;
          const selectNotAllowData = groupByNotAllow.true;

          if (selectAllowData !== undefined) {
            console.log('!= undefined');
            const vulnerableData = [];
            selectAllowData.forEach(item => {
              vulnerableData.push(item.value);
            });
            this.openAccountData.vulnerableDetail = vulnerableData.toString();
            this.openAccountData.vulnerableFlag = true;
          } else {
            console.log('undefined');
            this.openAccountData.vulnerableDetail = null;
            this.openAccountData.vulnerableFlag = false;
          }
        } else {

        }


        // ประวัติอาชญากรรม
        if (this.openAccountData.cddNo3Choice) {
          const convertJson = JSON.parse(this.openAccountData?.cddNo3Choice);
          const groupByCriminal = _.groupBy(convertJson, 'isAllow');
          const selectCriminalData = groupByCriminal.true;
          const cirminalData = [];

          selectCriminalData.forEach(item => {
            cirminalData.push(item.id);
          });
          this.openAccountData.cddNo3Choice = cirminalData.toString();
        }

        // พลเมืองอเมริกัน

        if (this.openAccountData.cddNo4Choice) {
          const convertJson = JSON.parse(this.openAccountData?.cddNo4Choice);
          const groupByAmerican = _.groupBy(convertJson, 'isAllow');
          const selectAmericanData = groupByAmerican.true;
          const americanData = [];

          selectAmericanData.forEach(item => {
            americanData.push(item.id);
          });
          this.openAccountData.cddNo4Choice = americanData.toString();
        }


        req = this.accountService.openAccountPost$(this.openAccountData).subscribe(data => {
            console.log('data', data);
            this.spinner.hide('global');
            this.router.navigate([`./account/open-account`]);
          },
          (error) => {
            console.log('error', error.error);
            this.isError = false;
            if (error && error.error) {
              console.log('error.error', error.error);
              const err = JSON.parse(error.error);
              console.log('errr', err);
              this.isError = true;
            }

          });

        console.log('this.openaccount', this.openAccountData);

      } else {
        console.log('dont,t have id');
        let req;
        this.openAccountData.isDraft = true;
        this.openAccountData.accountType = 'Individual';
        this.openAccountData.accountStatus = 'Draft';

        if (this.openAccountData.cardExpiredDate) {
          this.openAccountData.cardExpiredDate = moment(this.openAccountData.cardExpiredDate).format('YYYYMMDD');
        } else {
          this.openAccountData.cardExpiredDate = null;
        }


        if (this.openAccountData.birthdate) {
          this.dateType = moment(this.openAccountData.birthdate).toString();
          this.date = moment(this.dateType).format('YYYY-MM-DDThh:mm:ss.990Z');
          this.openAccountData.birthdate = this.date;
        }

        if (this.openAccountData.maritalStatus && this.openAccountData.maritalStatus === 'Married') {
          this.openAccountData.spouseCardType = this.openAccountData.identificationCardType;
          this.openAccountData.spousePassportCountry = null;
          this.openAccountData.spouseTitle = '';
          this.openAccountData.spouseTitleOther = '';
          this.openAccountData.spouseCardNumber = '';
        } else {
          this.openAccountData.spouseCardType = null;
          this.openAccountData.spousePassportCountry = null;
          this.openAccountData.spouseTitle = null;
          this.openAccountData.spouseTitleOther = null;
          this.openAccountData.spouseCardNumber = null;
          this.openAccountData.spouseEnFirstname = null;
          this.openAccountData.spouseEnLastName = null;
          this.openAccountData.spouseThFirstname = null;
          this.openAccountData.spouseThLastname = null;
        }

// set address idDocumentAddressData
        if (this.idDocumentAddressData && this.idDocumentAddressData.roomNo || this.idDocumentAddressData.building || this.idDocumentAddressData.district
          || this.idDocumentAddressData.floor || this.idDocumentAddressData.moo || this.idDocumentAddressData.no || this.idDocumentAddressData.postalCode
          || this.idDocumentAddressData.province || this.idDocumentAddressData.road || this.idDocumentAddressData.soi || this.idDocumentAddressData.subDistrict) {
          console.log('idDocumentAddressData', this.idDocumentAddressData);
          this.idDocumentAddressData.country = 'TH';
          this.openAccountData.idDocumentAddress = this.idDocumentAddressData;
          console.log('idDocumentAddressData', this.openAccountData.idDocumentAddress);
        } else {
          console.log('no sumting idDocumentAddressData');
          // this.openAccountData.idDocumentAddress = null;
        }

// ที่อยู่ปัจจุบัน
        if (this.openAccountData.currentAddressFlag && this.openAccountData.currentAddressFlag === 'IdDocument') {
          this.openAccountData.currentAddress = this.idDocumentAddressData;
        } else {
          console.log('ถ้าไม่มี current flag');
          if (this.currentAddressData && this.currentAddressData.roomNo || this.currentAddressData.building || this.currentAddressData.district
            || this.currentAddressData.floor || this.currentAddressData.moo || this.currentAddressData.no || this.currentAddressData.postalCode
            || this.currentAddressData.province || this.currentAddressData.road || this.currentAddressData.soi || this.currentAddressData.subDistrict) {
            this.currentAddressData.country = 'TH';
            this.openAccountData.currentAddress = this.currentAddressData;
          } else {
            this.openAccountData.currentAddress = null;
          }

        }

// ข้อมูลอาชีพ
// find หาอาชีพ เพื่อเอามา check workAddress
        if (this.openAccountData.occupationId) {
          this.dropdownService.dropdownOccupationGet$().subscribe(data => {
            const findOccupation = data.find(occ => occ.value === this.openAccountData.occupationId);
            this.occupationId = findOccupation.name;
            console.log('findOccupation', findOccupation);
          });
        }
        // ที่อยู่ที่ทำงาน
        if (this.openAccountData.workAddressFlag && this.openAccountData.workAddressFlag === 'IdDocument') {
          console.log('IdDocument');
          this.openAccountData.workAddress = this.openAccountData.idDocumentAddress;
        } else if (this.openAccountData.workAddressFlag && this.openAccountData.workAddressFlag === 'Current') {
          console.log('Current');
          this.openAccountData.workAddress = this.openAccountData.currentAddress;
        } else if (!this.openAccountData.workAddressFlag) {
          console.log('no work flag');

          // NOTE เกษตรกร = 20, พระภิกษุ /นักบวช = 25, แม่บ้าน/พ่อบ้าน = 80, เกษียณอายุ = 120, นักลงทุน = 90, นักเรียน/นักศึกษา = 140
          if (this.openAccountData.occupationId === '20' || this.openAccountData.occupationId === '25' ||
            this.openAccountData.occupationId === '80' || this.openAccountData.occupationId === '120' ||
            this.openAccountData.occupationId === '90' || this.openAccountData.occupationId === '140') {

            this.openAccountData.workAddressFlag = null;
            this.openAccountData.workAddress = null;
            console.log('occ ใช่อาชีพพวกนั้น');

          } else {
            console.log('occ ไม่ใช่อาชีพพวกนั้น');
            if (this.workAddressData && this.workAddressData.roomNo || this.workAddressData.building || this.workAddressData.district
              || this.workAddressData.floor || this.workAddressData.moo || this.workAddressData.no || this.workAddressData.postalCode
              || this.workAddressData.province || this.workAddressData.road || this.workAddressData.soi || this.workAddressData.subDistrict) {
              console.log('มี address');
              this.workAddressData.country = 'TH';
              this.openAccountData.workAddress = this.workAddressData;
            } else {
              console.log('ไม่มี address');
              this.openAccountData.workAddress = null;
            }

          }
        }


        // ที่อยู่ในการจัดส่งเอกสาร
        if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'IdDocument') {
          this.openAccountData.mailingAddress = this.openAccountData.idDocumentAddress;
        } else if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'Current') {
          console.log('mailing', this.currentAddressData);
          this.openAccountData.mailingAddress = this.openAccountData.currentAddress;

        } else if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'Work') {
          this.openAccountData.mailingAddress = this.openAccountData.workAddress;
        } else if (!this.openAccountData.mailAddressFlag) {
          console.log('no mail flag');
          if (this.mailingAddressData && this.mailingAddressData.roomNo || this.mailingAddressData.building || this.mailingAddressData.district
            || this.mailingAddressData.floor || this.mailingAddressData.moo || this.mailingAddressData.no || this.mailingAddressData.postalCode
            || this.mailingAddressData.province || this.mailingAddressData.road || this.mailingAddressData.soi || this.mailingAddressData.subDistrict) {
            this.mailingAddressData.country = 'TH';
            this.openAccountData.mailingAddress = this.mailingAddressData;
          } else {
            this.openAccountData.mailingAddress = null;
          }

        }

        // แหล่งที่มาของรายได้
        if (this.openAccountData.incomeSource) {
          const convertJson = JSON.parse(this.openAccountData.incomeSource);
          const groupByIncomeSource = _.groupBy(convertJson, 'isAllow');
          const selectIncomeData = groupByIncomeSource.true;
          const incomeSourceData = [];

          selectIncomeData.forEach(item => {
            incomeSourceData.push(item.value);
          });
          console.log('investData', incomeSourceData.toString());
          this.openAccountData.incomeSource = incomeSourceData.toString();
        }

        // // วัตถุประสงค์ในการลงทุน
        if (this.openAccountData.investmentObjective) {
          const convertJson = JSON.parse(this.openAccountData.investmentObjective);
          const groupByInvest = _.groupBy(convertJson, 'isAllow');
          const selectInvestData = groupByInvest.true;
          const investData = [];

          selectInvestData.forEach(item => {
            investData.push(item.value);
          });
          this.openAccountData.investmentObjective = investData.toString();
        }


        // เปราะบาง
        if (this.openAccountData.vulnerableDetail) {
          const convertJson = JSON.parse(this.openAccountData.vulnerableDetail);
          const groupByAllow = _.groupBy(convertJson, 'isAllow');
          const groupByNotAllow = _.groupBy(convertJson, 'isNotAllow');
          const selectAllowData = groupByAllow.true;
          const selectNotAllowData = groupByNotAllow.true;

          if (selectAllowData !== undefined) {
            console.log('!= undefined');
            const vulnerableData = [];
            selectAllowData.forEach(item => {
              vulnerableData.push(item.value);
            });
            this.openAccountData.vulnerableDetail = vulnerableData.toString();
            this.openAccountData.vulnerableFlag = true;
          } else {
            console.log('undefined');
            this.openAccountData.vulnerableDetail = null;
            this.openAccountData.vulnerableFlag = false;
          }

        }

        // ประวัติอาชญากรรม
        if (this.openAccountData.cddNo3Choice) {
          const convertJson = JSON.parse(this.openAccountData.cddNo3Choice);
          const groupByCriminal = _.groupBy(convertJson, 'isAllow');
          const selectCriminalData = groupByCriminal.true;
          const cirminalData = [];

          selectCriminalData.forEach(item => {
            cirminalData.push(item.id);
          });
          this.openAccountData.cddNo3Choice = cirminalData.toString();
        }

        // พลเมืองอเมริกัน

        if (this.openAccountData.cddNo4Choice) {
          const convertJson = JSON.parse(this.openAccountData.cddNo4Choice);
          const groupByAmerican = _.groupBy(convertJson, 'isAllow');
          const selectAmericanData = groupByAmerican.true;
          const americanData = [];

          selectAmericanData.forEach(item => {
            americanData.push(item.id);
          });
          this.openAccountData.cddNo4Choice = americanData.toString();
        }

        req = this.accountService.openAccountPost$(this.openAccountData).subscribe(data => {
            console.log('dataaa', data);
            this.spinner.hide('global');
            this.router.navigate([`./account/open-account`]);
          },
          (error) => {
            console.log('error', error.error);
            this.isError = false;
            if (error && error.error) {
              const errors = JSON.parse(error.error);
              if (errors.errorCode === 'DT4002') {
                this.isError = true;
              } else if (errors.errorCode !== 'DT4002') {
                this.toastrService.error(`${errors.errorMessage}`);
              }
            }
          });

        console.log('this.openaccount', this.openAccountData);
      }
    }
  }

  onEmailChange(event) {
    this.accountValid = false;
  }

  getRiskAssetment() {
    if (this.openAccountId) {
      // check Suitest
      const assetment = this.assetmentService.assetmentIdGet$(this.userId).subscribe(data => {
        console.log('data', data);
        this.assetmentTest = [];
        if (data) {
          this.assetmentTest = data;
        }
      });
    }
  }

  getFile() {
    //check UploadFile
    if (this.openAccountId) {

      const BankAccount = this.accountService.accountFileGet$(this.userId, 'BankAccount').subscribe(data => {
        this.bankAccountFile = [];
        if (data) {
          this.bankAccountFile = data;
        }

        console.log('bankAccountFile data', data);
        console.log('bankAccountFile data', this.bankAccountFile);
      });
      const ApplicationForm = this.accountService.accountFileGet$(this.userId, 'ApplicationForm').subscribe(data => {
        this.applicationFormFile = [];
        if (data) {
          this.applicationFormFile = data;
        }
      });
      const IdCardFront = this.accountService.accountFileGet$(this.userId, 'IdCardFront').subscribe(data => {
        this.idCardFrontFile = [];
        if (data) {
          this.idCardFrontFile = data;
        }
      });
      const Suitability = this.accountService.accountFileGet$(this.userId, 'Suitability').subscribe(data => {
        this.suitabilityFile = [];
        if (data) {
          this.suitabilityFile = data;
        }
      });
      const Fatca = this.accountService.accountFileGet$(this.userId, 'Fatca').subscribe(data => {
        this.fatcaFile = [];
        if (data) {
          this.fatcaFile = data;
        }
      });
      const Others = this.accountService.accountFileGet$(this.userId, 'Others').subscribe(data => {
        this.othersFile = [];
        if (data) {
          this.othersFile = data;
        }
      });

    }
  }

  goBack() {
    this.router.navigate([`./account/open-account`]);
  }

  onSave(form) {
    this.spinner.show('global');
    this.accountValid = false;
    this.isCurrentAddress = false;
    this.isError = false;
    this.isAssetment = false;
    this.isBankAccountFile = false;
    this.isApplicationFormFile = false;
    this.isIdCardFrontFile = false;
    this.isSuitabilityFile = false;
    this.isFatcaFile = false;
    this.isOthersFile = false;
    this.isValidWorkAddress = false;
    this.isValidMailAddress = false;
    this.isValidMailMethod = false;
    this.isValidIncomeSourceCountry = false;
    this.isValidIncomeSource = false;
    this.isValidInvestMent = false;
    this.isValidCriminal = false;
    this.isValidFatca = false;
    this.isValidCriminalYes = false;
    this.isValidFatcaYes = false;
    this.isValidVulnerableNo1 = false;
    this.isValidVulnerableNo2 = false;
    this.isValidVulnerableNo3 = false;


    // set Data


    if (this.openAccountData.cardExpiredDate) {
      this.openAccountData.cardExpiredDate = moment(this.openAccountData.cardExpiredDate).format('YYYYMMDD');
    }


    if (this.openAccountData.birthdate) {
      this.dateType = moment(this.openAccountData.birthdate).toString();
      this.date = moment(this.dateType).format('YYYY-MM-DDThh:mm:ss.990Z');
      this.openAccountData.birthdate = this.date;
    }

    if (this.openAccountData.maritalStatus && this.openAccountData.maritalStatus === 'Married') {
      this.openAccountData.spouseCardType = this.openAccountData.identificationCardType;
      this.openAccountData.spousePassportCountry = null;
      this.openAccountData.spouseTitle = '';
      this.openAccountData.spouseTitleOther = '';
      this.openAccountData.spouseCardNumber = '';
    } else {
      this.openAccountData.spouseCardType = null;
      this.openAccountData.spousePassportCountry = null;
      this.openAccountData.spouseTitle = null;
      this.openAccountData.spouseTitleOther = null;
      this.openAccountData.spouseCardNumber = null;
      this.openAccountData.spouseEnFirstname = null;
      this.openAccountData.spouseEnLastName = null;
      this.openAccountData.spouseThFirstname = null;
      this.openAccountData.spouseThLastname = null;
    }

// set address idDocumentAddressData
    if (this.idDocumentAddressData && this.idDocumentAddressData.roomNo || this.idDocumentAddressData.building || this.idDocumentAddressData.district
      || this.idDocumentAddressData.floor || this.idDocumentAddressData.moo || this.idDocumentAddressData.no || this.idDocumentAddressData.postalCode
      || this.idDocumentAddressData.province || this.idDocumentAddressData.road || this.idDocumentAddressData.soi || this.idDocumentAddressData.subDistrict) {
      console.log('idDocumentAddressData', this.idDocumentAddressData);
      this.idDocumentAddressData.country = 'TH';
      this.openAccountData.idDocumentAddress = this.idDocumentAddressData;
      console.log('idDocumentAddressData', this.openAccountData.idDocumentAddress);
    } else {
      console.log('no sumting idDocumentAddressData');
      // this.openAccountData.idDocumentAddress = null;
    }

// ที่อยู่ปัจจุบัน
    if (this.openAccountData.currentAddressFlag && this.openAccountData.currentAddressFlag === 'IdDocument') {
      this.openAccountData.currentAddress = this.idDocumentAddressData;
    } else {
      console.log('ถ้าไม่มี current flag');
      if (this.currentAddressData && this.currentAddressData.roomNo || this.currentAddressData.building || this.currentAddressData.district
        || this.currentAddressData.floor || this.currentAddressData.moo || this.currentAddressData.no || this.currentAddressData.postalCode
        || this.currentAddressData.province || this.currentAddressData.road || this.currentAddressData.soi || this.currentAddressData.subDistrict) {
        this.currentAddressData.country = 'TH';
        this.openAccountData.currentAddress = this.currentAddressData;
      } else {
        this.openAccountData.currentAddress = null;
      }

    }

// ข้อมูลอาชีพ
// find หาอาชีพ เพื่อเอามา check workAddress
    if (this.openAccountData.occupationId) {
      this.dropdownService.dropdownOccupationGet$().subscribe(data => {
        const findOccupation = data.find(occ => occ.value === this.openAccountData.occupationId);
        this.occupationId = findOccupation.name;
        console.log('findOccupation', findOccupation);
      });
    }
    // ที่อยู่ที่ทำงาน
    if (this.openAccountData.workAddressFlag && this.openAccountData.workAddressFlag === 'IdDocument') {
      console.log('IdDocument');
      this.openAccountData.workAddress = this.openAccountData.idDocumentAddress;
    } else if (this.openAccountData.workAddressFlag && this.openAccountData.workAddressFlag === 'Current') {
      console.log('Current');
      this.openAccountData.workAddress = this.openAccountData.currentAddress;
    } else if (!this.openAccountData.workAddressFlag) {
      console.log('no work flag');

      // NOTE เกษตรกร = 20, พระภิกษุ /นักบวช = 25, แม่บ้าน/พ่อบ้าน = 80, เกษียณอายุ = 120, นักลงทุน = 90, นักเรียน/นักศึกษา = 140
      if (this.openAccountData.occupationId === '20' || this.openAccountData.occupationId === '25' ||
        this.openAccountData.occupationId === '80' || this.openAccountData.occupationId === '120' ||
        this.openAccountData.occupationId === '90' || this.openAccountData.occupationId === '140') {

        this.openAccountData.workAddressFlag = null;
        this.openAccountData.workAddress = null;
        console.log('occ ใช่อาชีพพวกนั้น');

      } else {
        console.log('occ ไม่ใช่อาชีพพวกนั้น');
        if (this.workAddressData && this.workAddressData.roomNo || this.workAddressData.building || this.workAddressData.district
          || this.workAddressData.floor || this.workAddressData.moo || this.workAddressData.no || this.workAddressData.postalCode
          || this.workAddressData.province || this.workAddressData.road || this.workAddressData.soi || this.workAddressData.subDistrict) {
          console.log('มี address');
          this.workAddressData.country = 'TH';
          this.openAccountData.workAddress = this.workAddressData;
        } else {
          console.log('ไม่มี address');
          this.openAccountData.workAddress = null;
        }

      }
    }


    // ที่อยู่ในการจัดส่งเอกสาร
    if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'IdDocument') {
      this.openAccountData.mailingAddress = this.openAccountData.idDocumentAddress;
    } else if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'Current') {
      console.log('mailing', this.currentAddressData);
      this.openAccountData.mailingAddress = this.openAccountData.currentAddress;

    } else if (this.openAccountData.mailAddressFlag && this.openAccountData.mailAddressFlag === 'Work') {
      this.openAccountData.mailingAddress = this.openAccountData.workAddress;
    } else if (!this.openAccountData.mailAddressFlag) {
      console.log('no mail flag');
      if (this.mailingAddressData && this.mailingAddressData.roomNo || this.mailingAddressData.building || this.mailingAddressData.district
        || this.mailingAddressData.floor || this.mailingAddressData.moo || this.mailingAddressData.no || this.mailingAddressData.postalCode
        || this.mailingAddressData.province || this.mailingAddressData.road || this.mailingAddressData.soi || this.mailingAddressData.subDistrict) {
        this.mailingAddressData.country = 'TH';
        this.openAccountData.mailingAddress = this.mailingAddressData;
      } else {
        this.openAccountData.mailingAddress = null;
      }

    }

    // แหล่งที่มาของรายได้
    if (this.openAccountData.incomeSource) {
      console.log('this.openAccountData.incomeSource', this.openAccountData.incomeSource);
      const convertJson = JSON.parse(this.openAccountData?.incomeSource);
      const groupByIncomeSource = _.groupBy(convertJson, 'isAllow');
      const selectIncomeData = groupByIncomeSource.true;
      const incomeSourceData = [];

      selectIncomeData.forEach(item => {
        incomeSourceData.push(item.value);
      });
      console.log('investData', incomeSourceData.toString());
      this.openAccountData.incomeSource = incomeSourceData.toString();
    }

    // // วัตถุประสงค์ในการลงทุน
    if (this.openAccountData.investmentObjective) {
      const convertJson = JSON.parse(this.openAccountData?.investmentObjective);
      const groupByInvest = _.groupBy(convertJson, 'isAllow');
      const selectInvestData = groupByInvest.true;
      const investData = [];

      selectInvestData.forEach(item => {
        investData.push(item.value);
      });
      this.openAccountData.investmentObjective = investData.toString();
    }


    // เปราะบาง
    if (this.openAccountData.vulnerableDetail) {
      const convertJson = JSON.parse(this.openAccountData?.vulnerableDetail);
      const groupByAllow = _.groupBy(convertJson, 'isAllow');
      const groupByNotAllow = _.groupBy(convertJson, 'isNotAllow');
      const selectAllowData = groupByAllow.true;
      const selectNotAllowData = groupByNotAllow.true;

      if (selectAllowData !== undefined) {
        console.log('!= undefined');
        const vulnerableData = [];
        selectAllowData.forEach(item => {
          vulnerableData.push(item.value);
        });
        this.openAccountData.vulnerableDetail = vulnerableData.toString();
        this.openAccountData.vulnerableFlag = true;
        this.isValidVulnerableNo1 = false;
        this.isValidVulnerableNo2 = false;
        this.isValidVulnerableNo3 = false;
      } else {
        console.log('undefined');
        this.openAccountData.vulnerableDetail = null;
        this.openAccountData.vulnerableFlag = false;
        this.isValidVulnerableNo1 = false;
        this.isValidVulnerableNo2 = false;
        this.isValidVulnerableNo3 = false;
      }

    }

    // ประวัติอาชญากรรม
    if (this.openAccountData.cddNo3Choice) {
      const convertJson = JSON.parse(this.openAccountData?.cddNo3Choice);
      const groupByCriminal = _.groupBy(convertJson, 'isAllow');
      const selectCriminalData = groupByCriminal.true;
      const cirminalData = [];

      selectCriminalData.forEach(item => {
        cirminalData.push(item.id);
      });
      this.openAccountData.cddNo3Choice = cirminalData.toString();
    }

    // พลเมืองอเมริกัน

    if (this.openAccountData.cddNo4Choice) {
      const convertJson = JSON.parse(this.openAccountData?.cddNo4Choice);
      const groupByAmerican = _.groupBy(convertJson, 'isAllow');
      const selectAmericanData = groupByAmerican.true;
      const americanData = [];

      selectAmericanData.forEach(item => {
        americanData.push(item.id);
      });
      this.openAccountData.cddNo4Choice = americanData.toString();
    }
    // END SECTION SET DATA

    // START SECTION CHECK VALIDATE


    if (!this.openAccountId) {
      this.spinner.hide('global');
      this.accountValid = true;
      this.toastrService.error('กรุณา Save Draft ก่อนจึงจะสามารถ สร้างได้');
      // return;
      console.log('no open data', this.openAccountId);
    }

    if (!this.openAccountData.username) {
      this.spinner.hide('global');
      console.log('nodata', this.openAccountData.username);
      this.accountValid = true;
      // return;
    }

    console.log('this.openAccountData.currentAddress', this.openAccountData.currentAddress);
    if (_.isEmpty(this.openAccountData.currentAddress) && !this.openAccountData.currentAddressFlag) {
      this.spinner.hide('global');
      console.log('err ที่อู่ปัจจุบัน');
      this.isCurrentAddress = true;
      // return;
    }

    // เช็ค Validateที่อยู่ที่ทำงาน
    // NOTE เจ้าของกิจการ / ธุรกิจส่วนตัว = 30, พนักงานบริษัท = 40, แพทย์/พยาบาล = 50, กิจการครอบครัว = 60, ข้าราชการ = 70,  นักการเมือง = 110, พนักงานรัฐวิสาหกิจ = 130, อาชีพอิสระ = 150
    // NOTE ครู/อาจารย์ = 160, อื่นๆ = 170
    if (this.openAccountData.occupationId) {
      if (this.openAccountData.occupationId === '30' || this.openAccountData.occupationId === '40' ||
        this.openAccountData.occupationId === '50' || this.openAccountData.occupationId === '60' ||
        this.openAccountData.occupationId === '70' || this.openAccountData.occupationId === '110' ||
        this.openAccountData.occupationId === '130' || this.openAccountData.occupationId === '150' ||
        this.openAccountData.occupationId === '160' || this.openAccountData.occupationId === '170') {
        this.spinner.hide('global');

        if (_.isEmpty(this.openAccountData.workAddress)) {
          this.spinner.hide('global');
          this.isValidWorkAddress = true;
          // return;
        }
        // else {
        //   this.spinner.hide('global');
        //   this.isValidWorkAddress = false;
        // }
      }
    }

    if (_.isEmpty(this.openAccountData.mailingAddress)) {
      console.log('err mailingAddress');
      this.spinner.hide('global');
      this.isValidMailAddress = true;
      // return;
    }

    console.log('this.openAccountData.mailMethod', this.openAccountData.mailMethod);
    if (_.isEmpty(this.openAccountData.mailMethod)) {
      this.spinner.hide('global');
      this.isValidMailMethod = true;
      // return;
    }

    if (_.isEmpty(this.openAccountData.incomeSourceCountry)) {
      this.spinner.hide('global');
      this.isValidIncomeSourceCountry = true;
      // return;
    }

    if (_.isEmpty(this.openAccountData.incomeSource)) {
      this.spinner.hide('global');
      this.isValidIncomeSource = true;
      // return;
    }

    if (_.isEmpty(this.openAccountData.investmentObjective)) {
      this.spinner.hide('global');
      this.isValidInvestMent = true;
      // return;
    }

    console.log('this.openAccountData.vulnerableFlag', this.openAccountData.vulnerableFlag);
    if (_.isNil(this.openAccountData.vulnerableFlag)) {
      console.log('vulnerableFlag yes');
      console.log('this.openAccountData.vulnerableFlag yes', this.openAccountData.vulnerableFlag);
      this.spinner.hide('global');
      this.isValidVulnerableNo1 = true;
      this.isValidVulnerableNo2 = true;
      this.isValidVulnerableNo3 = true;
      // return;
    }
    //
    console.log('this.openAccountData.relatedPoliticalPerson', this.openAccountData.relatedPoliticalPerson);
    if (_.isNil(this.openAccountData.relatedPoliticalPerson)) {
      this.spinner.hide('global');
      this.isValidRelationPosition = true;
      // return;
    } else if (this.openAccountData.relatedPoliticalPerson) {
      this.spinner.hide('global');
      this.isValidRelationPosition = false;
    }
    // //
    console.log('this.openAccountData.cddNo3', this.openAccountData.cddNo3);
    if (_.isNil(this.openAccountData.cddNo3)) {
      this.spinner.hide('global');
      this.isValidCriminal = true;
      // return;
    }
    //
    console.log('this.openAccountData.fatca', this.openAccountData.fatca);
    if (_.isNil(this.openAccountData.fatca)) {
      this.spinner.hide('global');
      this.isValidFatca = true;
      // return;
    }
    //

    if (this.openAccountId) {
      if (_.isEmpty(this.assetmentTest)) {
        console.log('assetment');
        this.isAssetment = true;
        this.spinner.hide('global');
        // return;
      }

      if (_.isEmpty(this.bankAccountFile)) {
        this.spinner.hide('global');
        this.isBankAccountFile = true;
        // return;
      }

      if (_.isEmpty(this.applicationFormFile)) {
        console.log('applicationFormFile');
        this.spinner.hide('global');
        this.isApplicationFormFile = true;
        // return;
      }

      if (_.isEmpty(this.idCardFrontFile)) {
        console.log('idCardFrontFile');
        this.spinner.hide('global');
        this.isIdCardFrontFile = true;
        // return;
      }

      if (_.isEmpty(this.suitabilityFile)) {
        console.log('suitabilityFile');
        this.spinner.hide('global');
        this.isSuitabilityFile = true;
        // return;
      }

      if (_.isEmpty(this.fatcaFile)) {
        console.log('fatcaFile');
        this.spinner.hide('global');
        this.isFatcaFile = true;
      }

      if (_.isEmpty(this.othersFile)) {
        console.log('othersFile');
        this.spinner.hide('global');
        this.isOthersFile = true;
        // return;
      }

    }

    console.log('dataisss', this.openAccountData);


    if (form.invalid || this.accountValid || this.isAssetment || this.isBankAccountFile || this.isApplicationFormFile
      || this.isIdCardFrontFile || this.isSuitabilityFile || this.isFatcaFile || this.isOthersFile || this.isCurrentAddress
      || this.isValidWorkAddress || this.isValidMailAddress || this.isValidMailMethod || this.isValidIncomeSourceCountry
      || this.isValidIncomeSource || this.isValidInvestMent || this.isValidRelationPosition || this.isValidCriminal
      || this.isValidFatca || this.isValidCriminalYes || this.isValidFatcaYes || this.isValidVulnerableNo1 || this.isValidVulnerableNo2
      || this.isValidVulnerableNo3
    ) {
      // console.log('invalid');
      // console.log('accountValid', this.accountValid);
      // console.log('isAssetment', this.isAssetment);
      // console.log('isBankAccountFile', this.isBankAccountFile);
      // console.log('isApplicationFormFile', this.isApplicationFormFile);
      // console.log('isIdCardFrontFile', this.isIdCardFrontFile);
      // console.log('isSuitabilityFile', this.isSuitabilityFile);
      // console.log('isFatcaFile', this.isFatcaFile);
      // console.log('isOthersFile', this.isOthersFile);
      // console.log('isCurrentAddress', this.isCurrentAddress);
      // console.log('isValidWorkAddress', this.isValidWorkAddress);
      // console.log('isValidMailAddress', this.isValidIncomeSourceCountry);
      // console.log('isValidMailMethod', this.isValidMailMethod);
      // console.log('isValidIncomeSource', this.isValidIncomeSource);
      // console.log('isValidInvestMent', this.isValidInvestMent);
      // console.log('isValidRelationPosition', this.isValidRelationPosition);
      // console.log('isValidCriminal', this.isValidCriminal);
      // console.log('isValidFatca', this.isValidFatca);
      // console.log('isValidCriminalYes', this.isValidCriminalYes);
      // console.log('isValidFatcaYes', this.isValidFatcaYes);
      // console.log('isValidVulnerableNo1', this.isValidVulnerableNo1);
      // console.log('isValidVulnerableNo2', this.isValidVulnerableNo2);
      // console.log('isValidVulnerableNo3', this.isValidVulnerableNo3);


      this.spinner.hide('global');
      return;
    } else {
      if (this.openAccountId) {
        console.log('have id');
        let req;

        this.openAccountData.isDraft = true;
        this.openAccountData.accountType = 'Individual';
        this.openAccountData.accountStatus = 'Pending';


        req = this.accountService.openAccountPost$(this.openAccountData).subscribe(data => {
            console.log('data', data);
            this.spinner.hide('global');
            this.router.navigate([`./account/open-account`]);
          },
          (error) => {
            console.log('error', error);
            this.isError = false;
            if (error && error.errorCode === 'DT4002') {
              this.isError = true;
            }

          });

        console.log('this.openaccount', this.openAccountData);

      }
    }
  }

  onOpenModal() {
    this.modal.open();
  }

  goToRejectDetail(event) {
    if (event) {
      this.openAccountId = _.toNumber(this.openAccountId);
      this.rejectDetailModal.open();
    }
  }

  getUpdateFile(event) {
    console.log('data event', event);
    if (event && event === 'ApplicationForm') {
      this.isApplicationFormFile = false;
      this.getFile();
    } else if (event && event === 'Fatca') {
      this.isFatcaFile = false;
      this.getFile();
    } else if (event && event === 'Suitability') {
      this.isSuitabilityFile = false;
      this.getFile();
    } else if (event && event === 'Others') {
      this.isOthersFile = false;
      this.getFile();
    } else if (event && event === 'BankAccount') {
      this.isBankAccountFile = false;
      this.getFile();
    } else if (event && event === 'IdCardFront') {
      this.isIdCardFrontFile = false;
      this.getFile();
    }
  }

  getUpdateFlag(event) {
    console.log('american; event', event);
    if (event) {
      if (event === 'americanFlag') {
        this.isValidFatca = false;
        console.log('american;');
      } else if (event === 'vulnerableFlag') {
        this.isValidVulnerableNo1 = false;
        this.isValidVulnerableNo2 = false;
        this.isValidVulnerableNo3 = false;
      } else if (event === 'criminalFlag') {
        this.isValidCriminal = false;
      } else if (event === 'politicalFlag') {
        this.isValidRelationPosition = false;
      }
    }
  }
}

