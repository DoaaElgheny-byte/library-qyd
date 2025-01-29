import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkDutyInfoComponent } from '../work-duty-info/work-duty-info.component';
import { WorkDutyAttachmentComponent } from '../work-duty-attachment/work-duty-attachment.component';
import { WorkDutyAssignedComponent } from '../work-duty-assigned/work-duty-assigned.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { ToastrService } from 'ngx-toastr';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/services/api/issues.service';

@Component({
  selector: 'app-add-all-workduty',
  templateUrl: './add-all-workduty.component.html',
  styleUrls: ['./add-all-workduty.component.scss'],
})
export class AddAllWorkdutyComponent implements OnInit {
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(WorkDutyInfoComponent) workdutyInfo: WorkDutyInfoComponent;
  @ViewChild(WorkDutyAttachmentComponent)
  workdutyAttachment: WorkDutyAttachmentComponent;
  @ViewChild(WorkDutyAssignedComponent)
  workdutyAssigned: WorkDutyAssignedComponent;
  lang: string | null = localStorage.getItem('language');
  workDutyId: any;
  isAddNewTaskFromProject: any
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _IssueService: IssuesService,
    private _workdutyService: WorkDutyService,
    private toastr: ToastrService,

    private appconfirmservice: AppConfirmService
  ) {
    this.isAddNewTaskFromProject = localStorage.getItem('addNewTaskFromProject')
  }
  issueId: any;
  ngOnInit(): void {
    localStorage.setItem('stepWorkDuty', '1');
    this.route.params.subscribe({
      next: (next) => {
        this.workDutyId = next['id'];
        if (next['fromIssue']) {
          this.issueId = next['issueNo'];

          this.getIssueById();
        }
      },
    });
  }
  branchOfIssue: any;
  getIssueById() {
    this._IssueService.getLawsuitDetails(this.issueId).subscribe({
      next: (next) => {
        this.branchOfIssue = next.data?.branchId;
        this.branchId = this.branchOfIssue;
      },
    });
  }
  branchId: any;
  getBranchId(e: any) {
    this.branchId = e;
  }
  Back() {
    this.router.navigate(['/agent/departments/work-duty']);
  }
  attachmentFileInfoArray: any;
  submitAttachment() {
    this.attachmentFileInfoArray =
      this.workdutyAttachment.attachmentFileInfoArray;
    if (this.workDutyId) {
      let filesArray: {
        id: any;
        classificationName: string;
        imageName: string;
        imageStorageFileName: string;
        filesType: any;
        name: string;
        imageStorageFileURL: string;
        date: string;
      }[] = [];
      this.attachmentFileInfoArray.forEach((element: any) => {
        filesArray.push(element);
      });
      this._workdutyService
        .addAttachment({ id: this.workDutyId, files: filesArray })
        .subscribe({
          next: (next) => {

            if (next.success) {
              // if(this.workdutyAssigned.newAssigned.length> 0){
              this.submitAssigned();
              // }
              // else{
              //   this.spinner.hide();
              //                 this.router.navigate([
              //                   '/agent/departments/work-duty/add-edit-workduty',
              //                   this.workDutyId,
              //                 ]);
              //                 this.bindValue.emit({
              //                   id: this.workDutyId,
              //                   isSuccess: next.success,
              //                   isAdd: true,
              //                 });


              //   this.toastr.info(next.message);
              // }

            } else {
              this.spinner.hide();

              this.toastr.info(next.message);
            }
          },
          error: (error) => {
            this.spinner.hide();
            this.toastr.error(error.error.error.message);
          },
        });
    }
  }
  newAssigned: any;
  newTeam: any;

  submitAssigned() {
    this.newAssigned = this.workdutyAssigned.newAssigned;
    this.newTeam = this.workdutyAssigned.newTeam;
    this.newAssigned.teamId = this.workdutyAssigned.infoForm.get('teamId')?.value;
    let val = this.workdutyAssigned.assignTypeValue;
    // if (this.newAssigned.length > 0) {

    if (this.workDutyId) {
      this._workdutyService
        .editAssigned({
          id: +this.workDutyId,
          employees: this.newAssigned,
          teamEmployees: this.newTeam,
          assignType: val,
          teamId: this.newAssigned.teamId,
          noOfDays: +this.workdutyAssigned.infoFormNotify.value.number,
        })
        .subscribe({
          next: (next) => {

            if (next.success) {
              this.spinner.hide();
              this.router.navigate([
                '/agent/departments/work-duty/add-edit-workduty',
                this.workDutyId,
              ]);
              this.bindValue.emit({
                id: this.workDutyId,
                isSuccess: next.success,
                isAdd: true,
              });
            } else {
              this.spinner.hide();
              this.bindValue.emit({
                isSuccess: next.success,
                isBack: false,
              });
              this.toastr.info(next.message);
            }
          },
          error: (error) => {
            this.spinner.hide();

            this.toastr.error(error.error.error.message);
          },
        });
    }
    // }
  }
  submitInfo() {

    if (
      this.workdutyInfo.infoForm.invalid
      // this.workdutyAssigned.newAssigned.length === 0
    ) {
      Object.keys(this.workdutyInfo.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.workdutyInfo.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      this.workdutyAssigned.updateError();
      return;
    }
    if (
      this.workdutyInfo.infoForm.valid
      // this.workdutyAssigned.newAssigned.length > 0
    ) {
      this.spinner.show();

      if (this.workDutyId) {
        let data = {
          ...this.workdutyInfo.infoForm.value,
          lawsuitId: +this.workdutyInfo.workDutyDetails.lawsuitId,
        };

        this._workdutyService.editDutyInfo(data).subscribe({
          next: (next) => {

            if (next.success) {
              this.submitAttachment();

            } else {
              this.spinner.hide();
              this.bindValue.emit({
                id: this.workDutyId,
                isSuccess: next.success,
              });
              this.toastr.info(next.message);
            }
          },
          error: (error) => {
            this.spinner.hide();

            this.toastr.error(error.error.error.message);
          },
        });
      } else {
        if (this.workdutyInfo.infoForm.value.lawsuitNumber == "") {
          this.workdutyInfo.infoForm.value.lawsuitNumber = 0;
        }
        let data = {
          ...this.workdutyInfo.infoForm.value,
          lawsuitId: +this.workdutyInfo.issueId,
          branchId: +this.workdutyInfo.branchOfIssue
            ? this.workdutyInfo.branchOfIssue
            : this.workdutyInfo.infoForm.value.branchId,
        };
        this._workdutyService.addWorkDutyInfo(data).subscribe({
          next: (next) => {

            if (next.success) {
              this.workDutyId = next.data;
              this.submitAttachment();


            } else {
              this.spinner.hide();
              this.bindValue.emit({
                id: next.data,
                isSuccess: next.success,
              });
              this.toastr.info(next.message);
            }
          },
          error: (error) => {
            this.spinner.hide();

            this.toastr.error(error.error.error.message);
          },
        });
      }
    }
  }
  submit() {
    this.submitInfo();
  }
  private unsubscribe: Subscription[] = [];

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }

}
