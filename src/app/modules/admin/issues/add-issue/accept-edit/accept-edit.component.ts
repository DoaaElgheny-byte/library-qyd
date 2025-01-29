import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accept-edit',
  templateUrl: './accept-edit.component.html',
  styleUrls: ['./accept-edit.component.scss'],
})
export class AcceptEditComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  disableButton: boolean = false;

  public lang: string = String(localStorage.getItem('language'));
  successLoad = false;
  reportTest: any;
  isRequired = false;
  infoForm: FormGroup;
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.infoForm = this.fb.group({
      report: [null, Validators.compose([Validators.required])],
    });
  }
  public submit() {
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    if (this.infoForm.valid) {
      this.reportTest = this.infoForm.get('report')?.value;
      this.activeModal.close('Close click');
    }
  }

  private unsubscribe: Subscription[] = [];

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
