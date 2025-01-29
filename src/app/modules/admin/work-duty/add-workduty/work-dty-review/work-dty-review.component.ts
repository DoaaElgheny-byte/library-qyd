import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { ContractService } from 'src/app/services/api/contract.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';

@Component({
  selector: 'app-work-dty-review',
  templateUrl: './work-dty-review.component.html',
  styleUrls: ['./work-dty-review.component.scss'],
})
export class WorkDtyReviewComponent implements OnInit {
  id: any;

  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  lang: string | null = localStorage.getItem('language');
  contractDetails: any = {};
  constructor(
    public dutyService: WorkDutyService,
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private appconfirmservice: AppConfirmService

  ) { }

  ngOnInit(): void {
    localStorage.setItem('stepWorkDuty', '2');
    this.bindValue.emit({
      isAdd: false,
    });
    this.route.params.subscribe({
      next: (next) => {
        this.id = next['id'];
      },
    });
    this.getIssueById();
  }
  getIssueById() {

    this.dutyService.getDutyDetails(this.id).subscribe({
      next: (next) => {
        this.contractDetails = next.data;
        this.cdr.detectChanges();

      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.error.message);
      },
    });
  }
  submit() {
    this.spinner.show();

    if (this.contractDetails.isDraft) {
      this.dutyService.changeToPublic(this.id).subscribe({
        next: (next) => {
          this.spinner.hide();

          localStorage.setItem('stepWorkDuty', '');
          this.cdr.detectChanges();
          this.bindValue.emit({
            isAdd: false,
          });
          if (localStorage.getItem('addNewTaskFromProject') == 'true') {
            this.route.queryParams.subscribe(params => {
              this.router.navigate(['../../../project-management/add-edit-project/' + params['step2Id']], { relativeTo: this.route });
              localStorage.removeItem('addNewTaskFromProject')
            });
          } else {
            this.router.navigate(['/agent/departments/work-duty'])
          }
        },
        error: (error) => {
          this.spinner.hide();
        },
      });
    } else {
      this.dutyService.updateWorkDuty(this.id).subscribe({
        next: (next) => {
          this.spinner.hide();
          localStorage.setItem('stepWorkDuty', '');
          this.cdr.detectChanges();
          this.bindValue.emit({
            isAdd: false,
          });
          if (localStorage.getItem('addNewTaskFromProject') == 'true') {
            this.route.queryParams.subscribe(params => {
              this.router.navigate(['../../../project-management/add-edit-project/' + params['step2Id']], { relativeTo: this.route });
              localStorage.removeItem('addNewTaskFromProject')
            });
          } else {
            this.router.navigate(['/agent/departments/work-duty'])
          }
          // this.router.navigate(['/agent/departments/work-duty']) //////

          // this.router.navigate(['/agent/departments/work-duty'])

          // this.appconfirmservice.confirm(
          //   this.translate.instant("workDuty.caseEditSuccess"),'',
          //   '/assets/imgs/confirm/add.svg',true,'/agent/departments/work-duty')

        },
        error: (error) => {
          this.spinner.hide();
          // this.appconfirmservice.confirm(
          //   this.translate.instant(error.error.error.message),'',
          //   '/assets/imgs/confirm/warning.svg',false)
        },
      });
    }
  }
  Back() {
    this.bindValue.emit({
      isBack: true,
    });
  }
  ngOnDestroy() {
    localStorage.setItem('stepWorkDuty', '1');
  }
}
