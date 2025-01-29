import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { IssuesService } from 'src/app/services/api/issues.service';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { EntityType, LawsuitType, LawsuitTypeEnum } from 'src/app/services/enums/lawsuit';
import { SittingStatus, SittingState } from 'src/app/services/enums/sitting';
import { TeamViewComponent } from '../../../issue-management/team-view/team-view.component';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';

@Component({
  selector: 'app-issue-session',
  templateUrl: './issue-session.component.html',
  styleUrls: ['./issue-session.component.scss']
})
export class IssueSessionComponent implements OnInit {
  @Input() issueId:any
  @Input() isAuth:boolean
  issueDetails:any
  issueTypes=LawsuitTypeEnum
  page: number = 1;
  pageSize: number = 10;
  allUsers: any[] = [];
  filterObj = this.initFilterObj();
  totalCount: number;
  sittingStatusEnum = SittingStatus;
  sittingState = SittingState;
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
    private router:Router, private sittingservice: SittingManagementService,
    private spinner: NgxSpinnerService,private authService: AuthService
    ) { }
    currentUser:any;isEmployee:boolean
  ngOnInit(): void {
     this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.getIssueById()
    this.getAllUsersData();
    this.getEntityList()

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
        this.cdr.detectChanges();
        this.EntityChoosen = this.entityList.filter((x: any) => x.id == this.issueDetails.courtType)[0].name;

      }
    })
  }
  add(){
    this.router.navigate(['/agent/departments/court-sessions/add-edit-court-sessions',this.issueId])
  }
  view(id: any, tab: any) {
    this.router.navigate(['/agent/departments/court-sessions/view-court-sessions', id, tab]);
  }
  getAllUsersData() {
      this.spinner.show();
    
    
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
      (this.filterObj.MaxResultCount = this.pageSize);
      this.filterObj.LawsuitId = this.issueId;
      this.sittingservice.searchSitting(this.filterObj).subscribe({
        next: (next) => {
          this.allUsers = next.data.items;
          this.totalCount = next.data.totalCount;
       
          this.spinner.hide();
          this.cdr.detectChanges();
        },
      });
  }
  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
  private modalService = inject(NgbModal);

  viewTeam(employees: any) {
    if (employees) {
      const modalRef = this.modalService.open(TeamViewComponent);
      modalRef.componentInstance.employees = employees;
      modalRef.result.then(
        () => {},
        () => {
        }
      );
    }
  }
}
