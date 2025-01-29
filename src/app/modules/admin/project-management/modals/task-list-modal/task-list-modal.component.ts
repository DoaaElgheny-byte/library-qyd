import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { IssuesService } from 'src/app/services/api/issues.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { WorkDutyStatus } from 'src/app/services/enums/work-duty.enum';

@Component({
  selector: 'app-task-list-modal',
  templateUrl: './task-list-modal.component.html',
  styleUrls: ['./task-list-modal.component.scss']
})
export class TaskListModalComponent implements OnInit {
  @Input() projectId: any;
  selectedDutyDataList: any[] = [];
  workDutyStatus = WorkDutyStatus

  private service = inject(IssuesService);
  private workDutyService = inject(WorkDutyService);
  private spinner = inject(NgxSpinnerService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  constructor(public activeModal: NgbActiveModal) { }
  close() {
    this.activeModal.close();
  }

  editTask(taskId: any) {

    // agent/departments/work-duty/add-edit-workduty/369
    this.activeModal.close();
    this.router.navigate([`/agent/departments/work-duty/add-edit-workduty/${taskId}`])
  }

  viewTaskDetails(taskId: any) {

    this.activeModal.close();
    this.router.navigate([`/agent/departments/work-duty/view-workDuty/${taskId}/view`])
  }

  ngOnInit(): void {
    this.getChangeProjectToChanceData();
  }

  getChangeProjectToChanceData() {
    this.service.getChangeProjectToChanceById(this.projectId).subscribe(res => {
      if (res.data != null) {
        let duties = res.data.dutiesId;
        duties.forEach((id: any) => {
          this.getdutyDetails(id);
        });
      }
    })
  }

  getdutyDetails(id: any) {
    this.workDutyService.getDutyDetails(id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.selectedDutyDataList.push(res.data);
      this.cdr.detectChanges();
    })
  }
}
