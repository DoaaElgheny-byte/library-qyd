import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './steps-progress.component.html',
  styleUrls: ['./steps-progress.component.scss']
})
export class StepsProgressComponent implements OnInit {
  projectId: any;
  isAdd: boolean = false;
  step: number = 1; // Current active step
  direction: string = 'ar'; // Default direction for RTL/LTR

  constructor(private translateService: TranslateService
    ,
    private breadcrumbService: BreadcrumbService

  ) { }

  ngOnInit(): void {
    this.initializeDirection();
    this.loadCurrentStep();
    this.breadcrumbService.restoreBreadcrumbsFromStorage();

  }


  private initializeDirection(): void {
    this.direction = this.translateService.currentLang || 'ar';
  }


  nextStep(id: any): void {
    // alert(id)
    this.projectId = id
    this.step ? this.step : this.step = 1
    if (this.step < 4) {
      this.step++;
      this.saveCurrentStep();
    }
  }


  prevStep(): void {
    if (this.step > 1) {
      this.step--;
      this.saveCurrentStep();
    }
  }


  isStepDisabled(stepIndex: number): boolean {
    return stepIndex > this.step;
  }


  goToStep(stepIndex: number): void {
    if (!this.isStepDisabled(stepIndex)) {
      this.step = stepIndex;
      this.saveCurrentStep();
    }
  }


  private saveCurrentStep(): void {
    localStorage.setItem('currentStep', this.step.toString());
  }

  private loadCurrentStep(): void {
    const savedStep = localStorage.getItem('currentStep');
    this.step = savedStep ? Number(savedStep) : 1;
  }


  getStepPosition(stepIndex: number): string {
    const percentage = (stepIndex - 1) * 33.33;
    return this.direction === 'ar' ? `${percentage}%` : `${100 - percentage}%`;
  }


  getActiveLineWidth(): string {
    const percentage = (this.step - 1) * 33.33;
    return `${percentage}%`;
  }
}
