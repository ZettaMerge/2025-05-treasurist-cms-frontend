import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {ModalComponent} from '@postnerd-core';
import * as _ from 'lodash';
import {OpenAccountDTO} from "@model";
import {number} from "ngx-custom-validators/src/app/number/validator";
import {consolidateMessages} from "@angular/localize/src/tools/src/extract/translation_files/utils";

@Component({
  selector: 'fe-open-account-form-confirm-image-status',
  templateUrl: './fe-open-account-form-confirm-image-status.component.html',
  styleUrls: ['./fe-open-account-form-confirm-image-status.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FeOpenAccountFormConfirmImageStatusComponent implements OnInit, OnChanges {

  @Input() data;
  @Input() isValidRelationPosition;
  @Input() isValidCriminal;
  @Input() isValidFatca;
  @Input() isValidCriminalYes;
  @Input() isValidFatcaYes;
  @Input() isValidVulnerableNo1;
  @Input() isValidVulnerableNo2;
  @Input() isValidVulnerableNo3;
  @ViewChild('detailCriminalModal') detailCriminalModal: ModalComponent;
  @ViewChild('detailAmericanCitizenModal') detailAmericanCitizenModal: ModalComponent;

  @Output() getUpdateFlag = new EventEmitter();

  // เป็นบุคคลที่ทีข้อมูลในการสื่อสารตัดสินใจ อาทิ ผู้ที่มีความบกพร่องทางการได้ยินหรือการมองเห็น หรือภาวะบกพร่องทางสุขภาไใช่หรือไม่?

  vulnerableAge = '';
  vulnerableInvest = '';
  vulnerable = '';
  vulnerableDetail: any;
  isVulnerable1No = false;
  isVulnerable1Yes = false;
  isVulnerable2No = false;
  isVulnerable2Yes = false;
  isVulnerable3No = false;
  isVulnerable3Yes = false;


  // เป็นผู้มีสถานะภาพทางการเมืองหรือเป็นสมาชิกในครอบครัวหรือเป็นผุ้ใกล้ชิดกับบุคคลผู้มีสถานะภาพทางการเมืองหรือไม่?
  isRelationPoliticalNo = false;
  isRelationPoliticalYes = false;

  // ประวัติอาชญากรรม
  isCriminalNo = false;
  isCriminalYes = false;

  // พลเมืองอเมริกัน
  isAmericanNo = false;
  isAmericanYes = false;

  criminalData = [];
  americanDaData = [];

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

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.data.id) {
      // check vulnerable
      if (this.data.vulnerableFlag === true) {
        const convertJson = this.data.vulnerableDetail.split(',');
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
        this.data.vulnerableDetail = JSON.stringify(this.vulnerableDataList);
        this.isValidVulnerableNo1 = false;
        this.isValidVulnerableNo2 = false;
        this.isValidVulnerableNo3 = false;
      } else if (this.data.vulnerableFlag === false) {
        for (let i = 0; i < 3; i++) {
          this.vulnerableDataList[i].isNotAllow = true;
        }
        this.isValidVulnerableNo1 = false;
        this.isValidVulnerableNo2 = false;
        this.isValidVulnerableNo3 = false;
      }

      // check ผู้มีสถานะทางการเมือง
      if (this.data.relatedPoliticalPerson === true) {
        this.isRelationPoliticalYes = true;
        this.isValidRelationPosition = false;

      } else if (this.data.relatedPoliticalPerson === false) {
        this.isRelationPoliticalNo = true;
        this.isValidRelationPosition = false;
      }
      // check criminal
      if (this.data.cddNo3 === true) {
        this.isCriminalYes = true;
        this.isValidCriminal = false;

        if (this.isCriminalYes && this.data.cddNo3Choice) {
          const convertJson = this.data.cddNo3Choice.split(',');
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
        this.data.cddNo3Choice = JSON.stringify(this.criminalDataList);

      } else if (this.data.cddNo3 === false) {
        this.isCriminalNo = true;
        this.isValidCriminal = false;
      }


      // check american
      if (this.data.fatca === true) {
        this.isAmericanYes = true;
        this.isValidFatca = false;

        if (this.isAmericanYes && this.data.cddNo4Choice) {
          console.log('income cddNo3Choice', this.data.cddNo4Choice);
          const convertJson = this.data.cddNo4Choice.split(',');
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
        this.data.cddNo4Choice = JSON.stringify(this.americanDataList);

      } else if (this.data.fatca === false) {
        this.isAmericanNo = true;
        this.isValidFatca = false;
      }
    }

  }

  ngOnInit(): void {

  }

  onOpenDetailCriminalModal() {
    this.detailCriminalModal.open();
  }

  onOpenDetailAmericanCitizenModal() {
    this.detailAmericanCitizenModal.open();
  }

  onChangeVulnerable(event, index, type) {
    console.log('index', index);

    if (index === 0) {
      this.isValidVulnerableNo1 = false;
    } else if (index === 1) {
      this.isValidVulnerableNo2 = false;
    } else {
      this.isValidVulnerableNo3 = false;
    }
    console.log('isValidVulnerableNo1', this.isValidVulnerableNo1);
    console.log('isValidVulnerableNo2', this.isValidVulnerableNo2);
    console.log('isValidVulnerableNo3', this.isValidVulnerableNo3);

    if (event) {
      if (type === 'vulnerableNo') {
        this.vulnerableDataList[index].isNotAllow = event;
        this.vulnerableDataList[index].isAllow = false;
        this.data.vulnerableDetail = JSON.stringify(this.vulnerableDataList);
        // this.getUpdateFlag.emit('vulnerableFlag');
      } else if (type === 'vulnerableYes') {
        this.vulnerableDataList[index].isAllow = event;
        this.vulnerableDataList[index].isNotAllow = false;
        this.data.vulnerableDetail = JSON.stringify(this.vulnerableDataList);
        // this.getUpdateFlag.emit('vulnerableFlag');
      }
    }
  }

  onChangeRelationPolitical(event, type) {
    this.isValidRelationPosition = false;
    if (event) {
      if (type === 'relationPoliticalNo') {
        this.isRelationPoliticalNo = event;
        this.isRelationPoliticalYes = false;
        this.data.relatedPoliticalPerson = false;
        this.data.politicalRelatePersonPosition = null;
        this.isValidRelationPosition = false;
        this.getUpdateFlag.emit('politicalFlag');
      } else if (type === 'relationPoliticalYes') {
        this.isRelationPoliticalYes = event;
        this.isRelationPoliticalNo = false;
        this.data.relatedPoliticalPerson = true;
        this.isValidRelationPosition = false;
        this.getUpdateFlag.emit('politicalFlag');
      }
    }

  }

  onChangeCriminal(event, type) {
    this.isValidCriminal = false;
    if (event) {
      if (type === 'criminalNo') {
        this.isCriminalNo = event;
        this.isCriminalYes = false;
        this.data.cddNo3 = false;
        this.getUpdateFlag.emit('criminalFlag');
      } else if (type === 'criminalYes') {
        this.isCriminalYes = event;
        this.isCriminalNo = false;
        this.data.cddNo3 = true;
        this.getUpdateFlag.emit('criminalFlag');
      }
    }

  }

  onChangeAmerican(event, type) {
    this.isValidFatca = false;
    if (event) {
      if (type === 'ameRicanNo') {
        this.isAmericanNo = event;
        this.isAmericanYes = false;
        this.data.fatca = false;
        this.getUpdateFlag.emit('americanFlag');
      } else if (type === 'ameRicanYes') {
        this.isAmericanYes = event;
        this.isAmericanNo = false;
        this.data.fatca = true;
        this.getUpdateFlag.emit('americanFlag');
      }
    }

  }

  onSelectCriminalChange(event, criminalData, index) {
    console.log('event', event);
    this.isValidCriminalYes = false;
    if (event) {
      this.criminalDataList[index].isAllow = event;
      this.data.cddNo3Choice = JSON.stringify(this.criminalDataList);
      this.getUpdateFlag.emit('criminalFlag');
    }
  }

  onSelectAmericanChange(event, americanData, index) {
    this.isValidFatcaYes = false;
    if (event) {
      this.americanDataList[index].isAllow = event;
      this.data.cddNo4Choice = JSON.stringify(this.americanDataList);
      this.getUpdateFlag.emit('americanFlag');
    }
  }


}
