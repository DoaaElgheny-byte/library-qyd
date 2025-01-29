import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { IssuesService } from 'src/app/services/api/issues.service';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { UploadFileService } from 'src/app/services/api/upload-file';
//@ts-ignore
import * as html2pdf from 'html2pdf.js';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  infoForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  agentLogo: string = '';
  subjectValue =
    'السلام عليكم ورحمة الله وبركاته.\n \n إلى السيد الفاضل رئيس محكمة….\n\n إنه في يوم….تم رفع دعوى مطالبة مالية من مكتب……للمحاماة، بموجب عقد وكالة من السيد…..المقيم في…. رقم الهوية الوطنية…. رقم التوكيل…. ضد السيد….المقيم في….. الوقائع: المتطلبات: لذلك نتطلب من فضيلتكم بالنيابة عن موكلي التالي:';
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() issueDetails: any;
  @Input() id: any;
  issueId: any;
  dateText: any;
  reportSubject: any;
  @Input() newStep3: any;
  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private _sittingManagementService: SittingManagementService,
    public datepipe: DatePipe,
    public route: ActivatedRoute,
    private router: Router,
    private uploadFileService: UploadFileService,
    private breadcrumbService: BreadcrumbService,
    private appconfirmservice: AppConfirmService,
  ) { }
  ngAfterViewChecked() {
    this.lang = localStorage.getItem('language');
    this.cdr.detectChanges();
  }
  ngOnInit(): void {

    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
      },
    });

    this.initForm();
    this.getAgentLogo();
    this.getSubjectValue();
    if (this.issueId) {
      this.getIssueById();
    }
    this.getAgentLogo();
  }
  getAgentLogo() {
    this._sittingManagementService.getAgentLogo().subscribe({
      next: (next) => {
        this.agentLogo = next.data.logoImageStorageFileURL;
        this.cdr.detectChanges();

      },
    });
  }
  //add date
  setValueOfDate() {
    this.infoForm.get('reportDate')?.setValue(this.dateText);
  }
  //get case details
  getIssueById() {
    this.spinner.show();
    this._sittingManagementService.getSittingDetails(this.issueId).subscribe({
      next: (next) => {
        this.issueDetails = next.data;
        this.reportSubject = next.data.reportSubject;
        this.infoForm.patchValue(this.issueDetails);
        let exdate = new Date(next.data.reportDate);
        var ngbDateStruct = {
          day: exdate.getDate(),
          month: exdate.getMonth() + 1,
          year: exdate.getFullYear(),
        };
        this.dateText = ngbDateStruct;
        this.infoForm.get('reportDate')?.setValue(ngbDateStruct);
        if (!this.issueDetails.isDraft) {
          if (this.newStep3) {
            this.infoForm.patchValue(this.newStep3);
          }
        }
        this.cdr.detectChanges();
        this.spinner.hide();

      },
    });
  }
  //init form
  initForm() {
    this.infoForm = this.fb.group({
      id: [this.issueId],
      reportSubject: [this.reportSubject],
      reportDate: [null],
      reportDetails: [null, Validators.compose([Validators.required])],
      reportName: [],
      reportStorageFileName: [null],
      reportStorageFileUrl: [null],
    });
  }
  //return template of subject
  getSubjectValue() {
    this.infoForm.get('reportDetails')?.setValue(this.subjectValue);
  }

  async imageUrlToBase64(url: any) {
    const corsProxy = "https://cors-anywhere.herokuapp.com/"; // Public CORS proxy
    const data = await fetch(corsProxy + url);
    const blob = await data.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  }
  async convetToPDF() {
    this.spinner.show();

    const options = {
      filename: this.infoForm.get('reportSubject')?.value ? this.infoForm.get('reportSubject')?.value + '.pdf' : 'Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      pagebreak: { mode: 'avoid-all', before: '#page2el', after: '#page2el' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    const content = this.infoForm.value.reportDetails;
    await this.imageUrlToBase64(this.agentLogo).then((res) => {


      const htmlContent = `
      <img src="${res}" style="margin:15px" width="100px"/>
      <div style="margin:15px">${content}</div>
    `;

      html2pdf()
        .from(htmlContent)
        .set(options)
        .outputPdf('blob') // Generate Blob object
        .then((blob: any) => {
          // Send the Blob to the API
          this.convertBlobToBase64(blob);
        });
    });
  }

  convertBlobToBase64(blob: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1];
      // Send the Base64 string to the API
      this.sendPdfToApi(base64data);
    };
  }
  sendPdfToApi(file: any) {
    this.uploadFileService
      .UploadMyFile(file, this.infoForm.get('reportSubject')?.value ? this.infoForm.get('reportSubject')?.value + '.pdf' : 'Report.pdf')
      .subscribe(
        (res) => {

          this.infoForm
            .get('reportStorageFileName')
            ?.setValue(res.storageFileName);
          if (this.infoForm.invalid) {
            Object.keys(this.infoForm.controls).forEach((field) => {
              // {1}
              const control = this.infoForm.get(field); // {2}
              control?.markAsTouched({ onlySelf: true }); // {3}
            });
            return;
          }
          if (this.infoForm.valid) {
            const date1: NgbDate = new NgbDate(
              this.dateText.year,
              this.dateText.month,
              this.dateText.day
            );
            const jsDate1 = new Date(date1.year, date1.month - 1, date1.day);
            let lawistDate = this.datepipe.transform(jsDate1, 'yyyy-MM-dd');
            this.infoForm.get('reportDate')?.setValue(lawistDate);



            this._sittingManagementService
              .addReportOfSitting(this.infoForm.value)
              .subscribe({
                next: (next) => {
                  this.spinner.hide();
                  if (next.success) {
                    this.appconfirmservice.confirm(
                      this.translate.instant("sitting.addReport"), '',
                      '/assets/imgs/confirm/add.svg')
                  } else {
                    this.spinner.hide();
                    this.appconfirmservice.confirm(
                      this.translate.instant(next.message), '',
                      '/assets/imgs/confirm/warning.svg')
                  }
                },
                error: (error) => {
                  this.spinner.hide();

                  this.toastr.error(error.error.error.message);
                },
              });

          }
        },
        (err) => { }
      );
  }
  submit() {
    // convert to pdf
    this.convetToPDF();
  }
  //back to first step
  Back() {
    this.router.navigate(['/agent/departments/court-sessions'])
  }
  async downloadPDF() {
    this.spinner.show()
    const options = {
      filename: this.infoForm.get('reportSubject')?.value ? this.infoForm.get('reportSubject')?.value + '.pdf' : 'Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      pagebreak: { mode: 'avoid-all', before: '#page2el', after: '#page2el' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    const content = this.infoForm.value.reportDetails;
    try {
      const res = await this.imageUrlToBase64(this.agentLogo);


      const htmlContent = `
          <img src="${res}" style="margin:15px" width="100px"/>
          <div style="margin:15px">${content}</div>
      `;

      await html2pdf().from(htmlContent).set(options).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Handle error here if needed
    } finally {
      this.spinner.hide();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
