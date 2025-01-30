import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Modal } from 'bootstrap';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Validators } from 'ngx-editor';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../component/custom-button/custom-button.component';
import { CustomTableComponent } from '../component/custom-table/custom-table.component';
import { CustomFormComponent } from '../component/custom-form/custom-form.component';
import { LibraryService } from '../services/library-service';
import {
  CreateFileRequest,
  CreateFolderRequest,
  DownloadDeleteFileOrFolderRequest,
} from '../models/create-folder.model';
import {
  AppEntityState,
  CreateFolderFileResponse,
  ListRequest,
  ShareWithUserId,
} from '../models/list-content.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UploadFileComponentAlone } from '../component/upload-file/upload-file.component';
import { UserManagementService } from 'src/app/services/api/user-management.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../component/confirmation-modal/confirmation-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToasterService } from '../component/custom-toaster/toaster.service';
import { CustomToasterComponent } from '../component/custom-toaster/custom-toaster.component';
import { CustomStorageComponent } from '../component/custom-storage/custom-storage.component';

@Component({
  selector: 'app-library-layout',
  templateUrl: './library-layout.component.html',
  styleUrls: ['./library-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CustomButtonComponent,
    CustomTableComponent,
    CustomFormComponent,
    FormsModule,
    ReactiveFormsModule,
    UploadFileComponentAlone,
    NgbPaginationModule,
    ConfirmationModalComponent,
    NgSelectModule,
    CustomToasterComponent,
    CustomStorageComponent
  ],
})
export class LibraryLayoutComponent implements OnInit {
  emptyForm: FormGroup;
  form2: FormGroup;
  form: FormGroup;

  tableData: CreateFolderFileResponse[] = [];
  tableHeaders = [
    { text: 'الاسم', columnKey: 'name', width: '60%' },
    { text: '', columnKey: 'action', width: '5%' },
    { text: 'تاريخ الرفع', columnKey: 'creationDate', width: '20%' },
    { text: 'رفع بواسطة', columnKey: 'userName', width: '15%' },
  ];
  tableAction = [
    { name: 'عرض الملف', icon: 'eye', color: '#18181B', function: 'view' },
    {
      name: 'تنزيل الملف',
      icon: 'download',
      color: '#18181B',
      function: 'download',
    },
    {
      name: 'نقل الى مجلد اخر',
      icon: 'move',
      color: '#18181B',
      function: 'move',
    },
    { name: 'حذف الملف', icon: 'delete', color: '#EF4444', function: 'delete' },
  ];
  currentPath = '';
  createFolderModalId = 'modal2';
  uploadModalId = 'uploadModal';

  showTable: boolean = true;
  searchData: any;
  currentAgentUsers:any;
  totalCount: number;

  page: number = 1;

  pageSize: number = 10;
  filterObj = this.initFilterObj();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private libraryService: LibraryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private userManagementService:UserManagementService,
    private toastService: ToasterService
  ) {
    this.emptyForm = this.fb.group({});

    this.form2 = this.fb.group({
      name: ['', Validators.required],
      userId: [''],
      permission: ['public'],
    });
    this.form = this.fb.group({
      file: [null, Validators.required],
    });
  }
  initFilterObj() {
    return {
      currentPath:this.currentPath,
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
    };
  }
  ngOnInit(): void {
    this.getListOfCurrentFolder();
    this.userManagementService.getAllUsers({limitToCurrentUser:true})
          .subscribe((res) => {
            this.currentAgentUsers = res.data?.items;
            console.log(this.currentAgentUsers);
            this.cdr.detectChanges();
          });
  }
  search(event: any) {
    console.log(event);
  }
   getListOfCurrentFolder() {
    this.currentSelectedRow = null;
    this.rowClicked = false;
    this.spinner.show();
    this.showTable = false;
    let showTableGetValue = false;
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.MaxResultCount = this.pageSize;

    this.libraryService
      .listContent(new ListRequest(this.currentPath))
      .subscribe(
        (data) => {
          this.spinner.hide();
          this.tableData = data.data.contents;
          showTableGetValue = true;
          // this.totalCount = data.data?.totalCount ?? 0;
          this.cdr.detectChanges();
        },
        (err) => {
          this.spinner.hide();
          showTableGetValue = true;
          this.toastr.error(err.error.error.message);
        }
      );

    let interval = setInterval(() => {
      if (showTableGetValue || this.showTable) {
        this.showTable = true;
        clearInterval(interval);
        this.cdr.detectChanges();
      }
    }, 100);
  }

  uploadFile(file: any) {
    let fileRequest = new CreateFileRequest();
    fileRequest.file = file;
    fileRequest.name = file.fileName;
    fileRequest.path = this.currentPath;
    fileRequest.replaceWithSamePermissions = true;

    this.spinner.show();
    this.libraryService.uploadFile(fileRequest).subscribe(
      (data) => {
        this.spinner.hide();
        this.closeModal(true);
        this.toastr.success(this.translate.instant('تم رفع الملف بنجاح'));
      },
      (err) => {
        this.spinner.hide();
        this.closeModal();
        this.toastr.error(err.error.error.message);
      }
    );
  }

  onItemChange(value: any) {
    if (value != 'shared') {
      this.form2.get('userId')?.setValue(null);
    }
  }

  currentModal: Modal;
  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      this.currentModal = new Modal(modalElement as HTMLElement);
      this.currentModal.show();
    } else {
      console.error('Modal not found:', modalId);
    }
  }

  closeModal(libraryContentChange = false) {
    this.currentModal?.hide();
    if (libraryContentChange) {
      this.getListOfCurrentFolder();
    }
  }

  handleFormSubmit(data: any): void {
    if (!this.form2.valid) {
      return;
    }

    let model = this.form2.value as CreateFolderRequest;
    model.path = this.currentPath;
    model.isPrivate = this.form2.get('permission')?.value != 'public';

    if (this.form2.get('permission')?.value == 'shared') {
      model.shareWithUserIds = [
        new ShareWithUserId(
          this.form2.get('userId')?.value,
          AppEntityState.Added
        ),
      ];
    }
    this.spinner.show();
    this.libraryService.createFolder(model).subscribe(
      (data) => {
        this.form2.reset();
        this.spinner.hide();
        this.toastr.success(this.translate.instant('تم رفع المجلد بنجاح'));
        this.closeModal(true);
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      }
    );
  }

  functionAction(functionName: string) {
    debugger;
    if (functionName === 'download' || functionName === 'view') {
      if (this.currentSelectedRow && !this.currentSelectedRow.isFolder) {
        this.libraryService
          .downloadFile(
            new DownloadDeleteFileOrFolderRequest(
              this.currentPath + '/' + this.currentSelectedRow!.name
            )
          )
          .then((url) => {
            if (functionName === 'view') {
              window.open(url, '_blank');
            } else {
              const a = document.createElement('a');
              const objectUrl = url;
              a.href = objectUrl;
              a.download = this.currentSelectedRow!.name;
              a.click();
              URL.revokeObjectURL(objectUrl);
            }
          });
      }
    } else if (functionName === 'move') {
      this.openModal('moveFile')
    } else if (functionName === 'delete') {
      this.openModal('deleteModal')

    }
  }
  deleteFile(isConfirm:boolean){
    if(isConfirm){
      if (this.currentSelectedRow) {
        if (this.currentSelectedRow.isFolder) {
          this.spinner.show();
          this.libraryService
            .deleteFolder(
              new DownloadDeleteFileOrFolderRequest(
                this.currentPath + '/' + this.currentSelectedRow!.name
              )
            )
            .subscribe(
              (success) => {
                this.spinner.hide();
                this.closeModal(true);
              },
              (err) => {}
            );
        } else {
          this.spinner.show();
          this.libraryService
            .deleteFile(
              new DownloadDeleteFileOrFolderRequest(
                this.currentPath + '/' + this.currentSelectedRow!.name
              )
            )
            .subscribe(
              (success) => {
                this.spinner.hide();
                this.closeModal(true);
              },
              (err) => {}
            );
        }
      }
    }
  }
  actionButton(event: boolean) {
    if (true) {
      alert('button clicked !');
    }
  }

  goToRoot() {
    this.currentPath = '';
    this.getListOfCurrentFolder();
  }
  goUp() {
    debugger;
    let paths = this.currentPath.split('/');
    if (paths.length == 1) {
      this.goToRoot();
    } else {
      paths.pop();
      this.currentPath = paths.join('/');
      this.getListOfCurrentFolder();
    }
  }

  currentSelectedRow: CreateFolderFileResponse | null = null;
  rowClicked: boolean = false;
  onRowClick(row: any) {
    this.rowClicked = true;
    this.currentSelectedRow = row;
  }

  onRowDoubleClick(row: CreateFolderFileResponse) {
    this.rowClicked = true;
    this.currentSelectedRow = row;
    debugger;
    if (row.isFolder) {
      this.currentPath = row.path + '/' + row.name;
      this.getListOfCurrentFolder();
    }
  }
  moveFile(){
    console.log('22')
    this.toastService.showSuccess(
      'تم رفع [اسم الملف] 1.6 م.ب الى مكتبة الملفات','تم رفع الملف بنجاح',
      'assets/imgs/library/toaste.svg','#e9eff9','#3B82F6','#2F3032'
    );

  }
  copyFile(){}
}
