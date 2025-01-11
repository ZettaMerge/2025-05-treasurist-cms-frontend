import {Component, EventEmitter, OnInit, Output, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {AssetmentService} from '@api';
import {AssessmentSelectDTO} from '@model';
import * as _ from 'lodash';
import {number} from "ngx-custom-validators/src/app/number/validator";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'fe-open-account-form-risk-assessment',
  templateUrl: './fe-open-account-form-risk-assessment.component.html',
  styleUrls: ['./fe-open-account-form-risk-assessment.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FeOpenAccountFormRiskAssessmentComponent implements OnInit, OnChanges {

  @Input() userId;
  @Input() type;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  assetmentData: any;
  assetment: AssessmentSelectDTO = {} as AssessmentSelectDTO;
  isShowNoSuitTestDetail = false;

  riskDataList = [
    {
      id: 1, title: 'ปัจจุบันท่านอายุ',
      value: [
        {id: 1, name: 'ตั้งแต่ 60 ปีขึ้นไป', isAllow: false, isNotAllow: false},
        {id: 2, name: '45-59 ปี', isAllow: false, isNotAllow: false},
        {id: 3, name: '35-44 ปี', isAllow: false, isNotAllow: false},
        {id: 4, name: 'น้อยกว่า 35 ปี', isAllow: false, isNotAllow: false},
      ]
    },
    {
      id: 2,
      title: 'ปัจจุบันท่านมีภาระทางการเงินและค่าใช้จ่ายประจำเช่น ค่าผ่อนบ้าน รถ ค่าใช้จ่ายส่วนตัวและค่าเลี้ยงดูครอบครัวเป็นสัดส่วนเท่าใด',
      value: [
        {id: 1, name: 'มากกว่าร้อยละ 75 ของรายได้ทั้งหมด', isAllow: false, isNotAllow: false},
        {id: 2, name: 'ระหว่างร้อยละ 50 ถึงร้อยละ 75 ของรายได้ทั้งหมด', isAllow: false, isNotAllow: false},
        {id: 3, name: 'ตั้งแต่ร้อยละ 25 แต่น้อยกว่าร้อยละ 50 ของรายได้ทั้งหมด', isAllow: false, isNotAllow: false},
        {id: 4, name: 'น้อยกว่าร้อยละ 25 ของรายได้ทั้งหมด', isAllow: false, isNotAllow: false},
      ]
    },
    {
      id: 3, title: 'ท่านมีสถานะภาพทางการเงินในปัจจุบันอย่างไร',
      value: [
        {id: 1, name: 'มีทรัพย์สินน้อยกว่าหนี้สิน', isAllow: false, isNotAllow: false},
        {id: 2, name: 'มีทรัพย์สินเท่ากับหนี้สิน', isAllow: false, isNotAllow: false},
        {id: 3, name: 'มีทรัพย์สินมากกว่าหนี้สิน', isAllow: false, isNotAllow: false},
        {
          id: 4,
          name: 'มีความมั่นใจว่ามีเงินออมหรือเงินลงทุนเพียงพอสำหรับการใช้ชีวิตหลังเกษียณอายุแล้ว',
          isAllow: false,
          isNotAllow: false
        },
      ]
    },
    {
      id: 4, title: 'ท่านเคยมีประสบการณ์หรือมีความรู้ในการลงทุนในทรัพย์สินกลุ่มใดต่อไปนี้บ้าง (เลือกได้มากว่า 1 ข้อ)',
      value: [
        {id: 1, name: 'เงินฝากธนาคาร', isAllow: false},
        {id: 2, name: 'พันธบัตรรัฐบาล หรือกองทุนรวมพันธบัตรรัฐบาล', isAllow: false},
        {id: 3, name: 'หุ้นกู้ หรือกองทุนรวมตราสารหนี้', isAllow: false},
        {id: 4, name: 'หุ้นสามัญ หรือกองทุนรวมหุ้น หรือสินทรัพย์อื่นที่มีความเสี่ยงสูง', isAllow: false},
      ]
    },
    {
      id: 5, title: 'ระยะเวลาที่ท่านคาดว่าจะไม่มีความจำเป็นต้องใช้เงินลงทุนนี้',
      value: [
        {id: 1, name: 'ไม่เกิน 1 ปี', isAllow: false, isNotAllow: false},
        {id: 2, name: 'ตั้งแต่ 1 แต่น้อยกว่า 3 ปี', isAllow: false, isNotAllow: false},
        {id: 3, name: 'ตั้งแต่ 3 ถึง 5 ปี', isAllow: false, isNotAllow: false},
        {id: 4, name: 'มากกว่า 5 ปี', isAllow: false, isNotAllow: false},
      ]
    },
    {
      id: 6, title: 'ความสามารถในการรับความเสี่ยงของท่าน คือ',
      value: [
        {id: 1, name: 'เน้นเงินต้นต้องปลอดภัยและได้รับผลตอบแทนสม่ำเสมอแต่ต่ำได้', isAllow: false, isNotAllow: false},
        {
          id: 2,
          name: 'เน้นโอกาสได้รับผลตอบแทนสม่ำเสมอ แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้บ้าง',
          isAllow: false,
          isNotAllow: false
        },
        {
          id: 3,
          name: 'เน้นโอกาสได้รับผลตอบแทนสูง แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้มากขึ้น',
          isAllow: false,
          isNotAllow: false
        },
        {
          id: 4,
          name: 'เน้นโอกาสได้รับผลตอบแทนสูงในระยะยาว แต่อาจเสี่ยงที่จะสูญเสียเงินต้นส่วนใหญ่ได้',
          isAllow: false,
          isNotAllow: false
        },
      ]
    },
    {
      id: 7,
      img: 'assets/img/graphProfit.png',
      title: 'เมื่อพิจารณารูปแสดงตัวอย่างผลตอบแทนของกลุ่มการลงทุนที่อาจเกิดขึ้นด้านล่าง ท่านเต็มใจที่จะลงทุนในกลุ่มการลงทุนใดมากที่สุด',
      value: [
        {
          id: 1,
          name: 'กลุ่มการลงทุนที่ 1 มีโอกาสได้รับผลตอบแทน 2.5% โดยไม่ขาดทุนเลย',
          isAllow: false,
          isNotAllow: false
        },
        {
          id: 2,
          name: 'กลุ่มการลงทุนที่ 2 มีโอกาสได้รับผลตอบแทนสูงสุด 7% แต่อาจมีผลขาดทุนได้ถึง 1%',
          isAllow: false,
          isNotAllow: false
        },
        {
          id: 3,
          name: 'กลุ่มการลงทุนที่ 3 มีโอกาสได้รับผลตอบแทนสูงสุด 15% แต่อาจมีผลขาดทุนได้ถึง 5%',
          isAllow: false,
          isNotAllow: false
        },
        {
          id: 4,
          name: 'กลุ่มการลงทุนที่ 4 มีโอกาสได้รับผลตอบแทนสูงสุด 25% แต่อาจมีผลขาดทุนได้ถึง 15%',
          isAllow: false,
          isNotAllow: false
        },
      ]
    },
    {
      id: 8,
      title: 'ถ้าท่านเลือกลงทุนในทรัพย์สินที่มีโอกาสได้รับผลตอบแทนมาก แต่มีโอกาสขาดทุนสูงด้วยเช่นกัน ท่านจะรู้สึกอย่างไร',
      value: [
        {id: 1, name: 'กังวลและตื่นตระหนกกลัวขาดทุน', isAllow: false, isNotAllow: false},
        {id: 2, name: 'ไม่สบายใจแต่พอเข้าใจได้บ้าง', isAllow: false, isNotAllow: false},
        {id: 3, name: 'เข้าใจและรับความผันผวนได้ในระดับหนึ่ง', isAllow: false, isNotAllow: false},
        {
          id: 4,
          name: 'ไม่กังวลกับโอกาสขาดทุนสูง และหวังกับผลตอบแทนที่อาจจะได้รับสูงขึ้น',
          isAllow: false,
          isNotAllow: false
        },
      ]
    },
    {
      id: 9, title: 'ท่านจะรู้สึกกังวล / รับไม่ได้เมื่อมูลค่าเงินลงทุนของท่านมีการปรับตัวลดลงในสัดส่วนเท่าใด',
      value: [
        {id: 1, name: '5% หรือน้อยกว่า', isAllow: false, isNotAllow: false},
        {id: 2, name: 'มากกว่า 5%-10%', isAllow: false, isNotAllow: false},
        {id: 3, name: 'มากกว่า 10%-20%', isAllow: false, isNotAllow: false},
        {id: 4, name: 'มากกว่า 20% ขึ้นไป', isAllow: false, isNotAllow: false},
      ]
    },
    {
      id: 10,
      title: 'หากปีที่แล้วท่านลงทุนไป 100,000 บาท ปีนี้ท่านพบว่ามูลค่าเงินลงทุนลงลดลงเหลือ 85,000 บาท ท่านจะทำอย่างไร',
      value: [
        {id: 1, name: 'ตกใจ และต้องการขายการลงทุนที่เหลือทิ้ง', isAllow: false, isNotAllow: false},
        {
          id: 2,
          name: 'กังวลใจ และจะปรับเปลี่ยนการลงทุนบางส่วนไปในทรัพย์สินที่เสี่ยงน้อยลง',
          isAllow: false,
          isNotAllow: false
        },
        {id: 3, name: 'อดทนถือต่อไปได้และรอผลตอบแทนปรับตัวกลับมา', isAllow: false, isNotAllow: false},
        {
          id: 4,
          name: 'ยังมั่นใจ เพราะเข้าใจว่าต้องลงทุนระยะยาว และจะเพิ่มเงินลงทุนในแบบเดิมเพื่อเฉลี่ยต้นทุน',
          isAllow: false,
          isNotAllow: false
        },
      ]
    },
    {
      id: 11,
      title: 'หากการลงทุนในสัญญาซื้อขายล่วงหน้า (อนุพันธ์) และหุ้นกู้ที่มีอนุพันธ์แฝงประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลว ท่านอาจจะสูญเงินลงทุนทั้งหมดและอาจต้องลงเงินชดเชยเพิ่มบางส่วนท่านยอมรับได้เพียงใด',
      value: [
        {id: 1, name: 'ไม่ได้', isAllow: false, isNotAllow: false},
        {id: 2, name: 'ได้', isAllow: false, isNotAllow: false},
      ]
    },
    {
      id: 12, title: 'นอกเหนือจากความเสี่ยงในการลงทุนแล้ว ท่านสามารถรับความเสี่ยงด้านอัตราแลกเปลี่ยนได้เพียงใด',
      value: [
        {id: 1, name: 'ไม่ได้', isAllow: false, isNotAllow: false},
        {id: 2, name: 'ได้', isAllow: false, isNotAllow: false},
      ]
    },
    {
      id: 13,
      title: 'การลงทุนในสินค้าโภคภัณฑ์เช่น ทองคำ หรือ น้ำมันดิบ มีโอกาสได้รับผลตอบแทนสูง แต่ก็มีความเสี่ยงจากปัจจัยระดับมหภาคของโลกมาเกี่ยวข้องด้วยเช่นกัน คุณสามารถรับความเสี่ยงจากการลงทุนสินค้าโภคภัณฑ์ได้หรือไม่',
      value: [
        {id: 1, name: 'ไม่ได้', isAllow: false, isNotAllow: false},
        {id: 2, name: 'ได้', isAllow: false, isNotAllow: false},
      ]
    },
  ];

  constructor(
    private assetmentService: AssetmentService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {

    // if (this.type) {
    //   this.getByIdHaveType();
    // } else {
    //   this.getById();
    // }
  }

  ngOnInit(): void {
    if (this.type) {
      this.getByIdHaveType();
    } else {
      this.getById();
    }
  }

  onSelectRisk(event, indexRisk, indexValue, riskValue, asseMent) {
    console.log('indexRisk', indexRisk);
    console.log('indexValue', indexValue);


    if (event) {
      console.log('risk value', riskValue);
      console.log('asseMent ', asseMent);
      for (const assementNo of this.riskDataList) {
        if (assementNo.id === asseMent.id) {
          for (const riskChoice of assementNo.value) {
            if (indexRisk === 3) {
              this.riskDataList[indexRisk].value[indexValue].isAllow = event;
            } else {
              if (riskChoice.id === riskValue.id) {
                riskChoice.isAllow = true;
                this.riskDataList[indexRisk].value[indexValue].isAllow = event;
              } else {
                riskChoice.isAllow = false;
              }
            }
          }
        }
      }
      console.log('riskDataList', this.riskDataList);
    }
  }


  getById() {
    this.spinner.show('global');
    this.assetmentService.assetmentIdGet$(this.userId)
      .subscribe(data => {
        console.log('data', data);
        this.assetmentData = data;
        console.log('this.assetmentData', this.assetmentData);
        console.log('havee asset');
        this.setSuitTest();
        this.spinner.hide('global');
      });
  }

  getByIdHaveType() {
    this.spinner.show('global');
    this.assetmentService.assetmentIdGet$(this.userId)
      .subscribe(data => {
        console.log('data', data);
        this.assetmentData = data;
        console.log('this.assetmentData', this.assetmentData);
        if (_.isEmpty(this.assetmentData)) {
          this.isShowNoSuitTestDetail = true;
        } else if (!_.isEmpty(this.assetmentData)) {
          this.setSuitTest();
        }

        this.spinner.hide('global');
      });
  }

  setSuitTest() {

    if (this.assetmentData) {
      for (const assetmentNo of this.assetmentData) {
        const findAssetmentNo = _.findIndex(this.riskDataList, indexAss => indexAss.id === assetmentNo.assessmentNo);

        for (const choiceNo of this.riskDataList) {

          const findChoiceNo = _.findIndex(choiceNo.value, c => c.id === _.toNumber(assetmentNo.choiceNo.toString()));

          if (findChoiceNo >= 0) {
            this.riskDataList[findAssetmentNo].value[findChoiceNo].isAllow = true;
          }

        }
      }
    }

  }

  onSubmit(form) {
    this.spinner.show('global');

    const assementData = _.map(this.riskDataList, (item) => ({
      assessmentNo: item.id,
      choiceNo: _.chain(item.value).filter((c) => c.isAllow).map(w => w.id
      ).value(),
    }));

    this.assetment = assementData;
    console.log('this.assetment', this.assetment);

    let req = this.assetmentService.assetmentPost$(this.assetment, this.userId)
      .subscribe(data => {
        console.log('data', data);
        this.spinner.hide('global');
        this.save.emit();
      });
  }

  onCancel() {
    this.cancel.emit();
  }
}
