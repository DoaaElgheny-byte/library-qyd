import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.scss']
})
export class RegisterationComponent {
  constructor(private router: Router) { }

}
