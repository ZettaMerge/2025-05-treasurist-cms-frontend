import {Component, OnInit} from '@angular/core';
import {NewsDTO} from '@model';
import {ActivatedRoute, Router} from '@angular/router';
import {AgentService, CheckPermissionService, NewsService, UploadService} from '@api';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {PnStorageService, PopupService} from '@postnerd-core';
import * as moment from 'moment';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {PermissionEnum} from "@app/core/variables/permission.enum";

export interface ImageCoverPreview {
  name: string;
  type: string;
  src: any;
  id?: number;
  url?: string;
  sequence?: number;
  file?: any;
}

@Component({
  selector: 'news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss']
})
export class NewsFormComponent implements OnInit {

  newsData: NewsDTO = {} as NewsDTO;
  status: boolean;
  feature: boolean;
  pinned: boolean;
  newsId: number;

  imageCoverPreview;
  imageCover;
  imageCoverFile;
  validateImage: string;
  isChangeImageFailed: boolean;


  imageCoverPreviews: ImageCoverPreview[] = [];
  imageCovers = [];
  imageCoverFiles = [];
  numOfImage = 3;

  saveSub: Subscription;

  canCreate: boolean;
  canView: boolean;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    protected newsService: NewsService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private popupService: PopupService,
    private uploadService: UploadService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
  }

  ngOnInit(): void {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);
    // console.log('json', jsonRole);
    this.checkPermissionService.checkIsAllow(jsonRole, PermissionEnum.News).then(result => {
      if (result) {
        this.canCreate = result.canCreate;
        this.canView = result.canView;
      }

      console.log('result ann list', this.canView);
    });

    this.newsId = _.toNumber(this.route.snapshot.paramMap.get('id'));
    if (!this.newsId) {
      this.status = false;
      this.feature = false;
      this.pinned = false;
      this.newsData.status = 'Close';
      this.newsData.isPinned = false;
      this.newsData.isFeature = false;
    } else {
      this.getNewsById();
    }
  }

  getNewsById() {
    this.spinner.show('global');

    this.newsService.newsIdGet$(this.newsId).subscribe(data => {
      console.log('newsDataa', data);
      this.newsData = data;


      // SET DATA
      this.imageCoverPreview = this.newsData.coverImage;
      this.pinned = this.newsData.isPinned;
      console.log('imageCoverFile', this.imageCoverFile);
      this.initImages();
      if (this.newsData.status === 'Publish') {
        this.status = true;
      } else {
        this.status = false;
      }

      this.spinner.hide('global');
    });
  }

  initImages() {
    console.log('initPricePlanImages', this.newsData.images);
    if (!_.isEmpty(this.newsData.images)) {
      this.imageCoverPreviews = this.newsData.images.map(m => ({
        name: m.url,
        src: m.url,
        type: '',
        id: m.id,
        url: m.url,
      }));
    }
  }


  async onSave(form) {

    this.spinner.show('global');

    if (form.invalid) {
      this.spinner.hide('global');
      return;
    } else {

      let req;

      if (this.newsId) {
        if (this.imageCoverFile) {
          const coverImageData = await this.uploadService.uploadImagePost$(this.imageCoverFile, 'news').toPromise();
          console.log('coverImageData', coverImageData);
          if (coverImageData) {
            this.newsData.coverImage = coverImageData;
          }
        }

        console.log('before put');
        await this.onSetImage();
        req = this.newsService.newsPut$(this.newsId, this.newsData);
      } else {
        if (this.imageCoverFile) {
          const coverImageData = await this.uploadService.uploadImagePost$(this.imageCoverFile, 'news').toPromise();
          // console.log('coverImageData', coverImageData);
          if (coverImageData) {
            this.newsData.coverImage = coverImageData;
          }
        }
        await this.onSetImage();
        req = this.newsService.newsPost$(this.newsData);
      }

      console.log('after put');
      this.saveSub = req.subscribe(data => {
        console.log('newsData request save:', this.newsData);
        this.spinner.hide('global');
        this.router.navigate([`./news`]);
      });
    }

    // console.log('this.newsData', this.newsData);

  }

  async onSetImage() {
    console.log('imageCoverFile', this.imageCoverFile);
    console.log('imageCoverPreviews', this.imageCoverPreviews);
    const dataImages = [];

    if (this.imageCoverPreviews.length) {
      let i = 1;
      for (const image of this.imageCoverPreviews) {
        if (image.id) {
          dataImages.push({id: image.id, url: image.url});
        } else {
          let data;
          if (image.file) {
            data = await this.uploadService.uploadImagePost$(image.file, 'news').toPromise();
          }
          dataImages.push({url: data});
        }
        i++;
      }
      console.log('dataImages :', dataImages);
      this.newsData.images = dataImages;
    }
  }

  goBack() {
    this.router.navigate([`./news`]);
  }

  onChangeStatus(event, type) {
    // console.log('event', event);

    if (type === 'status') {
      if (event === true) {
        this.newsData.status = 'Publish';
      } else {
        this.newsData.status = 'Close';
      }
    } else if (type === 'pinned') {
      this.newsData.isPinned = event;
    }
  }

  onSelectImageCover(event) {
    if (event) {
      console.log('event', event);
      if (event.size > 2000000) {
        this.toastrService.error('ขนาดรูปภาพเกิน 2 MB');
      } else {
        if (event.type === 'image/jpeg' ||
          event.type === 'image/png') {
          this.imageCoverFile = event;
          const reader = new FileReader();
          reader.onload = e => {
            this.imageCoverPreview = e.target.result;
          };
          reader.readAsDataURL(this.imageCoverFile);
        } else {
          this.toastrService.error('รูปภาพจะต้องต้องเป็น .JPG หรือ .PNG เท่านั้น');
        }
      }
    }
  }

  removeImageCover() {
    this.imageCoverFile = null;
    this.imageCoverPreview = null;
    this.imageCover = null;
    this.newsData.coverImage = null;
  }

  onImageSelect(event) {
    if (event) {
      console.log('event', event);
      if (event.size > 2000000) {
        this.toastrService.error('ขนาดรูปภาพเกิน 2 MB');
      } else {
        if (event.type === 'image/jpeg' ||
          event.type === 'image/png') {
          this.imageCoverFile = event;
          const reader = new FileReader();
          reader.onload = e => {
            this.imageCoverPreview = e.target.result;
          };
          reader.readAsDataURL(this.imageCoverFile);
        } else {
          this.toastrService.error('รูปภาพจะต้องต้องเป็น .JPG หรือ .PNG เท่านั้น');
        }
      }
    }
  }

  calculateHeight(width) {
    return (width / 1.86) + 'px';
  }

  onImageSelects(event) {
    const fileType = event.name.split('.').pop();
    if (event?.size > 2000000) {
      this.toastrService.error('ขนาดรูปภาพเกิน 2 MB');
    } else {
      if (event) {
        if (fileType.toLowerCase() !== 'jpg' && fileType.toLowerCase() !== 'png' && fileType.toLowerCase() !== 'jpeg') {
          this.toastrService.error('รูปภาพจะต้องต้องเป็น .JPG หรือ .PNG เท่านั้น');
        } else {
          const reader = new FileReader();
          reader.onload = e => {
            this.imageCoverFiles.push(event);
            this.imageCoverPreviews.push({
              name: event.name,
              src: e.target.result,
              type: fileType,
              id: null,
              url: null,
              sequence: null,
              file: event
            });
            // if (this.imageCoverPreviews.length > this.numOfImage) {
            //   this.imageCoverFiles.pop();
            //   this.imageCoverPreviews.pop();
            //   this.toastrService.error(`อัพโหลดรูปภาพได้ไม่เกิน ${this.numOfImage} รูปเท่านั้น`);
            // }
          };
          reader.readAsDataURL(event);
        }
      }
    }
  }

  removeImageCovers(index) {
    this.imageCovers = null;
    this.imageCoverPreviews.splice(index, 1);
    this.imageCoverFiles.splice(index, 1);
    this.newsData.images.splice(index, 1);
  }

}
