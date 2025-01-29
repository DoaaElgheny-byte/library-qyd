import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { IssuesService } from 'src/app/services/api/issues.service';
import { LawsuitState, LawsuitStatus, LawsuitTypeEnum } from 'src/app/services/enums/lawsuit';

@Component({
  selector: 'app-case-management-modal',
  templateUrl: './case-management-modal.component.html',
  styleUrls: ['./case-management-modal.component.scss']
})
export class CaseManagementModalComponent implements OnInit {

  @Input() lawsuitId: any;
  lawsuit: any;

  selectedDutyDataList: any[] = [];

  private service = inject(IssuesService);
  private spinner = inject(NgxSpinnerService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  constructor(public activeModal: NgbActiveModal) { }


  ngOnInit(): void {

    if (this.lawsuitId) {
      this.getIssueById();
    }
  }
  cases = [
    {
      caseNumber: '040',
      caseNumberInCourt: '066964111',
      caseType: 'تجارية',
      status: 'ongoing',
      court: 'محكمة الاستئناف الادارية',
      projectAssociated: 'Proj-00001 (مشروع خالد)',
      assignedMembers: 'خالد',
      activationStatus: true,
    },
    {
      caseNumber: '250',
      caseNumberInCourt: '066964111',
      caseType: 'تجارية',
      status: 'completed',
      court: 'محكمة الاستئناف الادارية',
      projectAssociated: '',
      assignedMembers: 'يدي',
      activationStatus: false,
    },
  ];

  viewCase() {
    //console.log('Viewing case:', caseItem);
    this.activeModal.close();

    // lawsuitId
    // /agent/departments/cases/view-issue/382/1
    this.router.navigate([`/agent/departments/cases/view-issue/${this.lawsuitId}/1`])
  }

  editCaseData() {
    // agent/departments/cases/add-issue/382
    this.activeModal.close();
    this.router.navigate([`/agent/departments/cases/add-issue/${this.lawsuitId}`])
  }

  close() {
    this.activeModal.close();
  }
  issueStatusEnum = LawsuitStatus;
  issueTypes = LawsuitTypeEnum;
  issueState = LawsuitState;

  getIssueById() {

    this.spinner.show();
    this.service.getLawsuitDetails(this.lawsuitId).subscribe({
      next: (next) => {
        if (next.success === true) {
          console.log(next.data)
          this.lawsuit = next.data;
          this.spinner.hide();
          this.cdr.detectChanges()
        } else {
          this.spinner.hide();
          this.cdr.detectChanges()
        }
      }
    })
  }

}
