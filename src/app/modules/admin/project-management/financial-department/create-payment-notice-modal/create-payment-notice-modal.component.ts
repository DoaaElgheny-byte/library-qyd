import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { IssuesService } from 'src/app/services/api/issues.service';
import { PaymentNoticePdfComponent } from '../../pdfs/payment-notice-pdf/payment-notice-pdf.component';

@Component({
  selector: 'app-create-payment-notice-modal',
  templateUrl: './create-payment-notice-modal.component.html',
  styleUrls: ['./create-payment-notice-modal.component.scss']
})
export class CreatePaymentNoticeModalComponent implements OnInit {
  @Input() projectId: any;
  @Input() id: any;

  infoForm: FormGroup;
  isEditMode: boolean = false;
  selectedOption: string;

  private modalService = inject(NgbModal);
  private service = inject(IssuesService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private toastr = inject(ToastrService);

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initForm();
    if (this.projectId != null)
      this.getPreDataOfPaymentNotice();
    if (this.id != null)
      this.getDataInEditMode(this.id);
  }

  initForm(): void {
    this.infoForm = this.fb.group({
      projectId: [],
      id: [],
      clientName: [null,],
      projectName: [null,],
      taxNumberForAgent: [null,],
      serialNumber: [null,],
      price: [null, [Validators.required, Validators.pattern(ValidationPattern.Mobile)]],
      description: [null, [Validators.required,]],
      bankName: [null, Validators.required],
      iban: [null, [
        Validators.required,
        Validators.pattern('^[ A-Za-z_0-9 @./#%$!:/"&*+-]+$'),
      ]],
      accountName: [null, Validators.required],
      isHasPayment: [false, Validators.required],
    });
  }

  getPreDataOfPaymentNotice() {
    this.spinner.show();
    this.service.GetPrefPaymentNoticeData(this.projectId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      console.log({ res })

      let projectname = this.translate.instant(`projectManagement.${res.data.projectName}`)
      if (res.data.otherName != "")
        this.infoForm.get('projectName')?.setValue(res.data.otherName);
      else
        this.infoForm.get('projectName')?.setValue(projectname);

      this.infoForm.get('clientName')?.setValue(res.data.clientName);
      this.infoForm.get('taxNumberForAgent')?.setValue(res.data.taxNumberForAgent);
      this.infoForm.get('serialNumber')?.setValue(res.data.serialNumber);
    })
  }

  getDataInEditMode(id: any) {
    this.spinner.show();
    this.service.GetPaymentNoticeById(id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.projectId = res.data.projectId;
      this.isEditMode = true;
      this.infoForm.patchValue(res.data)
    })
  }

  onSelectionChange() {

    console.log(this.selectedOption)
    if (this.selectedOption == 'true') {
      this.infoForm.get('isHasPayment')?.setValue(true);
    } else this.infoForm.get('isHasPayment')?.setValue(false);

  }

  submit() {

    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        const control = this.infoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.toastr.error(this.translate.instant('attorny.CheckInsertData'));
      return;
    }
    const formValue = { ...this.infoForm.value };
    formValue.projectId = +this.projectId;
    formValue.id = +this.id;
    this.spinner.show();
    if (!this.isEditMode) {
      this.service.AddPaymentNotice(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.activeModal.close();

            this.service.GetPaymentNoticeById(res.data).subscribe(res => {
              setTimeout(() => {
                this.viewPaymentNoticePdf(res.data)
              }, 1000)
            })

          } else {
            this.toastr.info(res.message);
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error?.message);
        },
      });
    } else {
      this.service.EditPaymentNotice(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.activeModal.close();

          } else {
            this.toastr.info(res.message);
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error?.message);
        },
      });
    }
  }

  close() {
    this.activeModal.close();
  }

  viewPaymentNoticePdf(data: any) {
    const modalRef = this.modalService.open(PaymentNoticePdfComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.details = data
  }
}
