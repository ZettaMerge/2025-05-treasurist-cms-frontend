import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {MailingAddressDTO, OpenAccountDTO, WorkAddressDTO} from '@model';
import {DropdownService} from "@api";

export interface CareerInfo {
  career: string;
  businessType: string;
  JobTitle: string;
  WorkName: string;
}

@Component({
  selector: 'fe-open-account-form-career',
  templateUrl: './fe-open-account-form-career.component.html',
  styleUrls: ['./fe-open-account-form-career.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FeOpenAccountFormCareerComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() workAddressData: WorkAddressDTO = {} as WorkAddressDTO;
  @Input() mailingAddressData: MailingAddressDTO = {} as MailingAddressDTO;
  @Input() isValidWorkAddress;
  @Input() isValidMailAddress;
  @Input() isValidMailMethod;

  occupationId: any;
  businessTypeId: any;

  careerInfoData: CareerInfo = {} as CareerInfo;
  isWorkAddressIdCard = false;
  isWorkAddressOther = false;
  isWorkCurrentAddress = false;

  isDocumentDeliveryAddressIdCard = false;
  isDocumentDeliveryAddressOther = false;
  isDocumentDeliveryCurrentAddress = false;
  isDocumentDeliveryWorkAddress = false;

  isOtherOccupation = true;
  isOtherBusiness = true;
  isTypeBusiness = true;
  isWorkAddress = false;

  isEmail = false;
  isPostcode = false;
  lists = [
    {id: 1, name: 'A'},
    {id: 2, name: 'B'},
    {id: 3, name: 'C'},
  ];

  receiptDocumentsList = [{id: 1, name: 'ตามอีเมล'}, {id: 2, name: 'ไปรษณีย์'}];

  constructor(
    protected dropdownService: DropdownService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.data.id) {
      // เช็คอาชีพ
      if (this.data.occupationId) {
        console.log('ocupation id', this.data.occupationId);
        this.dropdownService.dropdownOccupationGet$().subscribe(data => {
          const findOccupation = data.find(occ => occ.value === this.data.occupationId);
          this.occupationId = findOccupation;
          console.log('occ', this.occupationId);

          // check ข้อมูลอาชีพ และที่อยู่ที่ทำงาน
          if (this.occupationId) {
            console.log('have occ id', this.occupationId);
            if (this.occupationId.name === 'เกษตรกร' || this.occupationId.name === 'พระภิกษุ /นักบวช' ||
              this.occupationId.name === 'แม่บ้าน/พ่อบ้าน' || this.occupationId.name === 'เกษียณอายุ' ||
              this.occupationId.name === 'นักเรียน/นักศึกษา' || this.occupationId.name === 'นักลงทุน') {
              console.log('have occ id');
              this.isOtherOccupation = true;
              this.isOtherBusiness = true;
              this.isTypeBusiness = true;
              this.isWorkAddress = false;
              this.isWorkAddressOther = false;
              this.data.workAddress = null;
              this.data.workAddressFlag = null;
            } else if (this.occupationId.name === 'พนักงานบริษัท' || this.occupationId.name === 'แพทย์/พยาบาล' ||
              this.occupationId.name === 'ข้าราชการ' || this.occupationId.name === 'พนักงานรัฐวิสาหกิจ' ||
              this.occupationId.name === 'อาชีพอิสระ' || this.occupationId.name === 'ครู/อาจารย์' ||
              this.occupationId.name === 'นักการเมือง') {
              this.isOtherOccupation = true;
              this.isOtherBusiness = true;
              this.isTypeBusiness = true;
              this.isWorkAddress = true;
            } else if (this.occupationId.name === 'เจ้าของกิจการ / ธุรกิจส่วนตัว' || this.occupationId.name === 'กิจการครอบครัว') {
              this.isOtherOccupation = true;
              this.isOtherBusiness = true;
              this.isWorkAddress = true;
              this.isTypeBusiness = false;
            } else if (this.occupationId.name === 'อื่นๆ') {
              this.isOtherOccupation = false;
              this.isTypeBusiness = false;
              this.isOtherBusiness = true;
              this.isWorkAddress = true;
            } else {
              this.isOtherOccupation = true;
              this.isOtherBusiness = true;
              this.isTypeBusiness = true;
              this.isWorkAddress = false;
            }
          }
        });

        // check ที่อยู่ที่ทำงาน
        if (this.data.workAddressFlag) {
          if (this.data.workAddress && this.data.workAddressFlag === 'IdDocument') {
            this.isWorkAddressIdCard = true;

          } else if (this.data.workAddress && this.data.workAddressFlag === 'Current') {
            this.isWorkCurrentAddress = true;
          } else if (this.data.workAddress && this.data.workAddressFlag === null) {
            this.isWorkAddressOther = true;
          }
        } else if (this.data.workAddress && !this.data.workAddressFlag) {
          this.isWorkAddressOther = true;
        } else if (!this.data.workAddress && !this.data.workAddressFlag) {
          this.isWorkAddress = false;
          this.isWorkAddressOther = false;
        }

        // else if (!this.data.workAddressFlag) {
        //   if (this.occupationId.name !== 'เกษตรกร' || this.occupationId.name !== 'พระภิกษุ /นักบวช' || this.occupationId.name !== 'แม่บ้าน/พ่อบ้าน' ||
        //     this.occupationId.name === 'เกษียณอายุ' || this.occupationId.name === 'นักเรียน/นักศึกษา') {
        //     this.isWorkAddressOther = true;
        //   } else {
        //     this.isWorkAddressOther = false;
        //   }
        // }

      }

      // เช็คประเภทธุรกิจ

      if (this.data.businessTypeId) {
        console.log('this.data.businessTypeId', this.data.businessTypeId);
        let businessTypeId;
        this.dropdownService.dropdownBusinessGet$().subscribe(data => {
          businessTypeId = data;
          const businessOption = businessTypeId.find(c => c.value === this.data.businessTypeId);
          console.log('businessOption', businessOption);
          this.businessTypeId = businessOption;
          this.data.businessTypeId = businessOption.value;
          if (this.data.businessTypeId === '180') {
            this.isOtherBusiness = true;
          }
        });
      }


      // เช็คที่อยู่ในการจัดส่ง
      if (this.data.mailAddressFlag) {
        if (this.data.mailAddressFlag === 'IdDocument') {
          this.isDocumentDeliveryAddressIdCard = true;

        } else if (this.data.mailAddressFlag === 'Current') {
          this.isDocumentDeliveryCurrentAddress = true;
        } else if (this.data.mailAddressFlag === 'Work') {
          this.isDocumentDeliveryWorkAddress = true;
        } else {
          this.isDocumentDeliveryAddressOther = true;
        }
      }

      // วิธีการรับเอกสาร
      console.log('this.data.mailMethod', this.data.mailMethod);
      if (this.data.mailMethod) {
        this.isEmail = true;
      } else {
        this.isEmail = false;
      }
    }
  }

  ngOnInit(): void {
  }

  onChangCheckBoxAddressIdCard(event) {
    this.isValidWorkAddress = false;
    if (event && event === true) {
      this.isWorkAddressOther = false;
      this.isWorkCurrentAddress = false;
      this.isWorkAddressIdCard = event;
      this.data.workAddressFlag = 'IdDocument';
    } else if (event && event === false) {
      this.isWorkAddressOther = false;
      this.isWorkCurrentAddress = false;
      this.isWorkAddressIdCard = event;
      this.data.workAddressFlag = null;
    } else {
      this.data.workAddressFlag = null;
    }
    console.log('currentaddress By id', this.data.workAddressFlag);
  }

  onChangCheckBoxCurrentAddress(event) {
    this.isValidWorkAddress = false;
    if (event && event === true) {
      this.isWorkAddressOther = false;
      this.isWorkAddressIdCard = false;
      this.isWorkCurrentAddress = event;
      this.data.workAddressFlag = 'Current';
    } else if (event && event === false) {
      this.isWorkAddressOther = false;
      this.isWorkAddressIdCard = false;
      this.isWorkCurrentAddress = event;
      this.data.workAddressFlag = null;
    } else {
      this.data.workAddressFlag = null;
    }
    console.log('currentaddress', this.data.workAddressFlag);
  }

  onChangCheckBoxAddressOther(event) {
    this.isValidWorkAddress = false;
    if (event) {
      this.isWorkCurrentAddress = false;
      this.isWorkAddressIdCard = false;
      this.isWorkAddressOther = event;
      this.data.workAddressFlag = null;
      console.log('currentaddress other', this.data.workAddressFlag);
    }

  }

  onChangCheckBoxDeliveryAddressIdCard(event) {
    this.isValidMailAddress = false;
    if (event && event === true) {
      this.isDocumentDeliveryCurrentAddress = false;
      this.isDocumentDeliveryWorkAddress = false;
      this.isDocumentDeliveryAddressOther = false;
      this.isDocumentDeliveryAddressIdCard = event;
      this.data.mailAddressFlag = 'IdDocument';
    } else if (event && event === false) {
      this.isDocumentDeliveryCurrentAddress = false;
      this.isDocumentDeliveryWorkAddress = false;
      this.isDocumentDeliveryAddressOther = false;
      this.isDocumentDeliveryAddressIdCard = event;
      this.data.mailAddressFlag = null;
    } else {
      this.data.mailAddressFlag = null;
    }

  }


  onChangCheckBoxDeliveryCurrentAddress(event) {
    this.isValidMailAddress = false;
    if (event && event === true) {
      this.isDocumentDeliveryAddressIdCard = false;
      this.isDocumentDeliveryWorkAddress = false;
      this.isDocumentDeliveryAddressOther = false;
      this.isDocumentDeliveryCurrentAddress = event;
      this.data.mailAddressFlag = 'Current';
    } else if (event && event === false) {
      this.isDocumentDeliveryAddressIdCard = false;
      this.isDocumentDeliveryWorkAddress = false;
      this.isDocumentDeliveryAddressOther = false;
      this.isDocumentDeliveryCurrentAddress = event;
      this.data.mailAddressFlag = null;
    } else {
      this.data.mailAddressFlag = null;
    }

  }

  onChangCheckBoxDeliveryWorkAddress(event) {
    this.isValidMailAddress = false;
    if (event && event === true) {
      this.isDocumentDeliveryAddressIdCard = false;
      this.isDocumentDeliveryCurrentAddress = false;
      this.isDocumentDeliveryAddressOther = false;
      this.isDocumentDeliveryWorkAddress = event;
      this.data.mailAddressFlag = 'Work';
    } else if (event && event === false) {
      this.isDocumentDeliveryAddressIdCard = false;
      this.isDocumentDeliveryCurrentAddress = false;
      this.isDocumentDeliveryAddressOther = false;
      this.isDocumentDeliveryWorkAddress = event;
      this.data.mailAddressFlag = null;
    } else {
      this.data.mailAddressFlag = null;
    }

  }

  onChangCheckBoxDeliveryAddressOther(event) {
    this.isValidMailAddress = false;
    if (event) {
      this.isDocumentDeliveryAddressIdCard = false;
      this.isDocumentDeliveryCurrentAddress = false;
      this.isDocumentDeliveryWorkAddress = false;
      this.isDocumentDeliveryAddressOther = event;
      this.data.mailAddressFlag = null;
    }

  }

  onChangReceiptDocumentsEmail(event) {
    if (event && event === true) {
      this.isPostcode = false;
      this.isEmail = event;
      this.data.mailMethod = 'Email';
      this.isValidMailMethod = false;
    } else {
      this.data.mailMethod = null;
    }
  }

  onChangReceiptDocumentPostCode(event) {
    if (event) {
      this.isEmail = false;
      this.isPostcode = event;
      this.data.mailMethod = 'Post';
    }
  }

  onOccupationChange(event) {
    console.log('event', event);

    if (event) {
      if (event.name === 'เกษตรกร' || event.name === 'พระภิกษุ /นักบวช' ||
        event.name === 'แม่บ้าน/พ่อบ้าน' || event.name === 'เกษียณอายุ' ||
        event.name === 'นักลงทุน' || event.name === 'นักเรียน/นักศึกษา') {
        console.log('เกษตรกร');
        this.isOtherOccupation = true;
        this.isOtherBusiness = true;
        this.isTypeBusiness = true;
        this.isWorkAddress = false;
        this.data.occupationId = event.value;
        this.data.companyName = null;
        this.data.workPosition = null;
        this.data.workAddress = null;
        this.data.workAddressFlag = null;
      } else if (event.name === 'พนักงานบริษัท' || event.name === 'แพทย์/พยาบาล' ||
        event.name === 'ข้าราชการ' || event.name === 'พนักงานรัฐวิสาหกิจ' ||
        event.name === 'ครู/อาจารย์' || event.name === 'นักการเมือง') {
        this.isOtherOccupation = true;
        this.isOtherBusiness = true;
        this.isTypeBusiness = true;
        this.isWorkAddress = true;
        this.data.occupationId = event.value;
      } else if (event.name === 'เจ้าของกิจการ / ธุรกิจส่วนตัว' ||
        event.name === 'อาชีพอิสระ' || event.name === 'กิจการครอบครัว') {
        this.isOtherOccupation = true;
        this.isOtherBusiness = true;
        this.isWorkAddress = true;
        this.isTypeBusiness = false;
        this.data.occupationId = event.value;
      } else if (event.name === 'อื่นๆ') {
        this.isOtherOccupation = false;
        this.isTypeBusiness = false;
        this.isOtherBusiness = true;
        this.isWorkAddress = true;
        this.data.occupationId = event.value;
      } else {
        console.log('ในนอก loop');
        this.isOtherOccupation = true;
        this.isOtherBusiness = true;
        this.isTypeBusiness = true;
        this.isWorkAddress = false;
        this.data.occupationId = event.value;
      }
    } else {
      console.log('นอก loop');
      this.isOtherOccupation = true;
      this.isOtherBusiness = true;
      this.isTypeBusiness = true;
      this.isWorkAddress = false;
      this.isWorkAddressOther = false;
    }
    console.log('data', this.data.occupationId);

  }

  onBusinessChange(event) {
    console.log('ev', event);
    if (event && event.name === 'อื่นๆ') {
      this.isOtherBusiness = false;
      this.data.businessTypeId = event.value;
    } else {
      this.isOtherBusiness = true;
      this.data.businessTypeId = event.value;
      this.data.businessTypeOther = null;
    }
  }
}
