import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CheckPermissionService} from "@api";
import {PnStorageService} from "@postnerd-core";
import {PermissionEnum} from "@app/core/variables/permission.enum";

@Component({
  selector: 'fe-faqs',
  templateUrl: './fe-faqs.component.html',
  styleUrls: ['./fe-faqs.component.scss']
})
export class FeInformationComponent implements OnInit {

  canCreate: boolean;
  canView: boolean;
  isShowNoDetail = true;

  informationDatas = [
    {
      id: 1,
      title: 'work so hard',
      qaArray: [
        {
          question: '1. กลุ่มบริษัทหลักทรัพย์เทรเซอริสต์ (Treasurist) ให้บริการอะไรบ้าง',
          answer: 'ให้บริการซื้อขายสับเปลี่ยนหน่วยลงทุนกองทุนรวมของบริษัทหลักทรัพย์จัดการกองทุน (บลจ.) ชั้นนำต่าง ๆ ผ่านบริษัทหลักทรัพย์นายหน้าซื้อขายหน่วยลงทุน \n' +
            'เทรเชอริสต์ จำกัด (บลน. เทรเชอริสต์) โดยได้รับคำแนะนำการลงทุน เช่น แผนการลงทุนที่เหมาะสมและกองทุนที่โดดเด่น จากบริษัททรัพย์ที่ปรึกษาการลงทุน \n' +
            'เทรเชอริสต์ จำกัด (บลป. เทรเชอริสต์) ซึ่งเป็นบริษัทในเครือ'
        },
        {
          question: '2. กลุ่มบริษัทหลักทรัพย์เทรเซอริสต์ (Treasurist) อยู่ภายใต้การกำกับดูแลของหน่วยงานใด ?',
          answer: 'อยู่ภายใต้การกำกับดูแลของสำนักงานคณะกรรมการหลักทรัพย์และตลาดหลักทรัพย์ (สำนักงาน ก.ล.ต.)'
        }
      ]
    },
    {
      id: 2,
      title: 'Why So Mad Man',
      qaArray: [
        {
          question: '3. กลุ่มบริษัทหลักทรัพย์เทรเซอริสต์ (Treasurist) ให้บริการอะไรบ้าง',
          answer: 'ให้บริการซื้อขายสับเปลี่ยนหน่วยลงทุนกองทุนรวมของบริษัทหลักทรัพย์จัดการกองทุน (บลจ.) ชั้นนำต่าง ๆ ผ่านบริษัทหลักทรัพย์นายหน้าซื้อขายหน่วยลงทุน \n' +
            'เทรเชอริสต์ จำกัด (บลน. เทรเชอริสต์) โดยได้รับคำแนะนำการลงทุน เช่น แผนการลงทุนที่เหมาะสมและกองทุนที่โดดเด่น จากบริษัททรัพย์ที่ปรึกษาการลงทุน \n' +
            'เทรเชอริสต์ จำกัด (บลป. เทรเชอริสต์) ซึ่งเป็นบริษัทในเครือ'
        },
        {
          question: '4. กลุ่มบริษัทหลักทรัพย์เทรเซอริสต์ (Treasurist) อยู่ภายใต้การกำกับดูแลของหน่วยงานใด ?',
          answer: 'อยู่ภายใต้การกำกับดูแลของสำนักงานคณะกรรมการหลักทรัพย์และตลาดหลักทรัพย์ (สำนักงาน ก.ล.ต.)'
        }
      ]
    }
  ];

  constructor(
    private router: Router,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnInit(): void {
    // CHECK PERMISSION
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.Content).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.canView = result.canView;
      }

      console.log('result', result);
    });
  }

  goBack() {
    this.router.navigate([`./content-management`]);
  }

  add() {
    this.router.navigate([`./content-management/faqs/new`]);
  }

  edit() {
    this.router.navigate([`./content-management/information/${1}`]);
  }
}
