import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { IssuesService } from 'src/app/services/api/issues.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { EntityType, LawsuitType, LawsuitTypeEnum } from 'src/app/services/enums/lawsuit';
import { SittingStatus, SittingState } from 'src/app/services/enums/sitting';
import { WorkDutyStatus, WorkDutyState } from 'src/app/services/enums/work-duty.enum';

@Component({
  selector: 'app-issue-workduty',
  templateUrl: './issue-workduty.component.html',
  styleUrls: ['./issue-workduty.component.scss']
})
export class IssueWorkdutyComponent implements OnInit {
  @Input() issueId:any
  @Input() isAuth:boolean
  issueDetails:any
  issueTypes=LawsuitTypeEnum
  page: number = 1;
  pageSize: number = 10;
  allUsers: any[] = [];
  filterObj = this.initFilterObj();
  totalCount: number;
  workDutyStatus=WorkDutyStatus
  workDutyState=WorkDutyState
  currentUser:any
isEmployee:boolean
  initFilterObj() {
    return {
      LawsuitId:this.issueId,
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
    };
  }
  constructor(
    private issueService:IssuesService,private cdr:ChangeDetectorRef,
    private router:Router,     private  workDutyservice:WorkDutyService,
    private spinner: NgxSpinnerService,private authService: AuthService
    ) { }

  ngOnInit(): void {
     this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.getEntityList()
    this.getIssueById()
    this.getAllUsersData();

  }
  entityList:any
  entityType = EntityType;
  getEntityList() {
    this.entityList = Object.keys(this.entityType)
      .filter(
        (key) =>
          !isNaN(Number(this.entityType[key as keyof typeof this.entityType]))
      )
      .map((key) => ({
        id: Number(this.entityType[key as keyof typeof this.entityType]),
        name: key,
      }));
  }
  EntityChoosen:any

  getIssueById(){
    this.issueService.getLawsuitDetails(this.issueId).subscribe({
      next:next=>{
        this.issueDetails =next.data
        this.EntityChoosen = this.entityList.filter((x: any) => x.id == this.issueDetails.courtType)[0].name;

        this.cdr.detectChanges();

      }
    })
  }
  add(){
    this.router.navigate(['/agent/departments/work-duty/add-edit-workduty',true,this.issueDetails.id])
  }
  view(id:any){
    this.router.navigate(['/agent/departments/work-duty/view-workDuty',id,'view'])
  }
  getAllUsersData(){
    
      this.spinner.show();
    
    
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.LawsuitId = this.issueId;
    this.filterObj.MaxResultCount = this.pageSize;
    this.workDutyservice.getAllDutyList(this.filterObj).subscribe({
      next:next=>{
        this.allUsers = next.data.items;
        this.totalCount = next.data.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      }
    })
  }
}
