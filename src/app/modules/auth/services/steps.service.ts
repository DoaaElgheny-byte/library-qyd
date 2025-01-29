import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepsService {

  private completedSteps: Set<number> = new Set();
  private stepData: { [key: string]: any } = {};

  markStepAsComplete(step: number): void {
    this.completedSteps.add(step);
  }

  isStepCompleted(step: number): boolean {
    return this.completedSteps.has(step);
  }

  setStepData(step: string, data: any): void {
    this.stepData[step] = data;
  }

  getStepData(step: string): any {
    return this.stepData[step] || {};
  }
}
