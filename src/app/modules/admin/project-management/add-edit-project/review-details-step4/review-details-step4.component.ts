import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { ClientService } from 'src/app/services/api/client.service';
import { IssuesService } from 'src/app/services/api/issues.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { ClientType, LegalAdvice, LegalAdviceType, ProjectName, ProjectNameType, ProjectType, ProjectTypeName } from 'src/app/services/enums/client';
import { WorkDutyStatus } from 'src/app/services/enums/work-duty.enum';
import { PriceQuotePdfComponent } from '../../pdfs/price-quote-pdf/price-quote-pdf.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review-details-step4',
  templateUrl: './review-details-step4.component.html',
  styleUrls: ['./review-details-step4.component.scss']
})
export class ReviewDetailsStep4Component implements OnInit {
  @Output() callPrevStep = new EventEmitter<void>(); // EventEmitter to notify the parent
  projectId: any;
  projectDetails: any;
  selectedClientData = null;
  selectedDutyDataList: any[] = [];
  selectedDutiesId: any[] = [];
  clientTypeEnum = ClientType;
  workDutyStatus = WorkDutyStatus;
  logoStamp: any;
  logo: any;
  ProjectType = ProjectType;
  isService: boolean = true;
  isHaveContract: boolean = true;
  isHaveLawsuit: boolean = true;
  projectName: any;
  legalAdvice: any;
  projectType: ProjectTypeName
  isHaveOtherProjectName: boolean = false;
  isOtherLegalAdviceName: boolean = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(IssuesService);
  private spinner = inject(NgxSpinnerService);
  private clientservice = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);
  private workDutyService = inject(WorkDutyService);
  private translate = inject(TranslateService);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.getRequestId();
  }

  getdutyDetails(id: any) {
    this.workDutyService.getDutyDetails(id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      if (res.data != null) {
        this.selectedDutyDataList.push(res.data);
        this.selectedDutiesId.push(res.data?.id)
        this.cdr.detectChanges();
      }
    })
  }

  getClientDetails(id: any) {
    this.clientservice.getClientDetails(id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      if (res.data != null) {
        this.selectedClientData = res.data;
        this.cdr.detectChanges();
      }
    })
  }

  getProjectDetails() {
    this.spinner.show();
    this.service.GetProjectDetails(this.projectId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      console.log(res?.data);
      if (res.data?.clientId != null) {
        this.getClientDetails(res.data?.clientId)
      }
      if (res.data?.dutiesId != null) {
        res.data?.dutiesId.
          forEach((id: any) => {
            this.getdutyDetails(id);
          });
      }

      if (res.data?.projectType == ProjectType.Service)
        this.isService = true;
      else this.isService = false;
      if (res.data?.projectName) {
        if (res.data?.projectName == ProjectName.ExecutionRequests) this.projectName = this.translate.instant('projectManagement.ExecutionRequests');
        if (res.data?.projectName == ProjectName.PerformanceOrders) this.projectName = this.translate.instant('projectManagement.PerformanceOrders');
        if (res.data?.projectName == ProjectName.AmicableSettlement) this.projectName = this.translate.instant('projectManagement.AmicableSettlement');
        if (res.data?.projectName == ProjectName.Reports) this.projectName = this.translate.instant('projectManagement.Reports');
        if (res.data?.projectName == ProjectName.Arbitration) this.projectName = this.translate.instant('projectManagement.Arbitration');
        if (res.data?.projectName == ProjectName.Collection) this.projectName = this.translate.instant('projectManagement.Collection');
        if (res.data?.projectName == ProjectName.CreateContract) this.projectName = this.translate.instant('projectManagement.CreateContract');
        if (res.data?.projectName == ProjectName.DraftingContract) this.projectName = this.translate.instant('projectManagement.DraftingContract');
        if (res.data?.projectName == ProjectName.Other) this.projectName = this.translate.instant('projectManagement.Other');
      }
      if (res.data?.legalAdvice) {
        if (res.data?.legalAdvice == LegalAdvice.LaborConsultation) this.legalAdvice = this.translate.instant('projectManagement.LaborConsultation');
        if (res.data?.legalAdvice == LegalAdvice.PersonalStatusConsultation) this.legalAdvice = this.translate.instant('projectManagement.PersonalStatusConsultation');
        if (res.data?.legalAdvice == LegalAdvice.RealEstateConsultation) this.legalAdvice = this.translate.instant('projectManagement.RealEstateConsultation');
        if (res.data?.legalAdvice == LegalAdvice.BusinessConsulting) this.legalAdvice = this.translate.instant('projectManagement.BusinessConsulting');
        if (res.data?.legalAdvice == LegalAdvice.GeneralConsultation) this.legalAdvice = this.translate.instant('projectManagement.GeneralConsultation');
        if (res.data?.legalAdvice == LegalAdvice.Other) this.legalAdvice = this.translate.instant('projectManagement.Other');

      }

      if (res.data.otherLegalAdviceName != "" && res.data?.otherLegalAdviceName != null) {
        this.isOtherLegalAdviceName = true;
      }
      else if (res.data.otherProjectName != "" && res.data?.otherProjectName != null) {
        this.isHaveOtherProjectName = true
      }
      else {
        this.isOtherLegalAdviceName = false;
        this.isHaveOtherProjectName = false;
      }

      this.isHaveContract = res.data?.isProjectHaveContract;
      this.isHaveLawsuit = res.data?.isProjectHaveCase;

      if (res.data?.projectType == ProjectType.Service)
        this.isService = true
      else this.isService = false;

      this.projectDetails = res.data;
      this.logo = this.projectDetails?.logoImageStorageFileURL;
      this.logoStamp = this.projectDetails?.logoStampImageStorageFileURL;
    })
  }

  getRequestId() {
    this.route.params.subscribe({
      next: (params) => {
        this.projectId = params['id'];
        if (this.projectId)
          this.getProjectDetails();
      },
    });
  }

  triggerPrevStep(): void {
    this.callPrevStep.emit();
    window.scrollTo(0, 0)
    // this.router.navigate(['../add-edit-project', this.projectId], { relativeTo: this.route });
  }
  launchConfetti(): void {
    // confetti({
    //   particleCount: 1050, // Number of confetti particles
    //   spread: 460,         // Spread of the confetti
    //   origin: { y: 0 }, // Start slightly below the top of the screen
    //   zIndex: 999999,
    //   colors: ['#ff0000', '#00ff00', '#0000ff', '#ffbb00'], // Custom colors
    // });
  }
  nextToPdf() {
    // this.launchConfetti();
    const modalRef = this.modalService.open(PriceQuotePdfComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.projectDetails = this.projectDetails;
  }


}
