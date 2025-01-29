import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ClientService } from 'src/app/services/api/client.service';
import { ClientNationalType, ClientState, ClientType } from 'src/app/services/enums/client';
import { NationalType } from 'src/app/services/enums/lawsuit';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewClientComponent implements OnInit {
  clientDetails: any = {};
  clientState = ClientState;
  clientType = ClientType
  clientId: any
  lang: string | null = localStorage.getItem('language');
  nationalType: any;
  nationalTypeName: string;
  startAuthorizationDate: any;
  isIdNoVisible: boolean = true;
  isOtherType: boolean = true;

  constructor(
    public clientService: ClientService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private dateFormatter: DateFormatterService,
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    const id = this.route.snapshot.paramMap.get('id');
    this.clientId = id
    if (id) {
      this.getIssueById(id);
    }
  }
  getIssueById(id: any) {
    this.clientService.getClientDetails(id).subscribe({
      next: (next) => {
        this.clientDetails = next.data;
        console.log(this.clientDetails)
        if (next.data.type != ClientType.Individual) {
          this.isIdNoVisible = false
        }
        else this.isIdNoVisible = true
        if (next.data.nationalType == ClientNationalType['addClient.Other']) {
          this.isOtherType = true
        } else this.isOtherType = false
        //startDate
        if (next.data.birthDate) {
          let currentDate = next.data.birthDate.substring(0, 10);
          if (currentDate) {
            if (next.data.birthDateType) {
              if (next.data.birthDateType == DateType.Gregorian) {
                this.startAuthorizationDate =
                  this.dateFormatter.ToGregorianDateStruct(
                    currentDate,
                    'YYYY-MM-DD'
                  );
              } else {
                this.startAuthorizationDate =
                  this.dateFormatter.ToHijriDateStruct(
                    currentDate,
                    'YYYY-MM-DD'
                  );
              }
            }
          } else {
            this.startAuthorizationDate = null;
          }
        }
        this.nationalTypeName = this.getNationalTypeNameFromNumber(next.data.nationalType);
        this.cdr.detectChanges();

      },
    });
  }

  getNationalTypeNameFromNumber(id: number): any {
    // Find the corresponding key from the enum
    const nationalTypeKey = ClientNationalType[id];
    return nationalTypeKey;
  }

  format(date: NgbDateStruct): string {
    if (!date) {
      return '';
    }

    const day = this.isNumber(date.day) ? this.padNumber(date.day) : '';
    const month = this.isNumber(date.month) ? this.padNumber(date.month) : '';
    const year = date.year;

    return `${day}-${month}-${year}`;
  }

  isNumber(value: any): value is number {
    return !isNaN(value as number);
  }

  padNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }
  Back() {
    this.router.navigate(['/agent/departments/clients'])
  }
  submit() {
    this.router.navigate(['/agent/departments/clients/add-edit-client', this.clientId])
  }
}
