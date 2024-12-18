import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { AnnualBreederResetService } from './annual-breeder-reset.service';

@Component({
  selector: 'app-annual-breeder-reset',
  templateUrl: './annual-breeder-reset.component.html',
  styleUrls: ['./annual-breeder-reset.component.css']
})
export class AnnualBreederResetComponent implements OnInit {
  pageTitle = 'Annual Breeder Reset';
  moduleTitle = 'Settlements';
  innerWidth: any;
  innerHeight: any;
  lock: boolean = false;

  constructor(
    private messageService: ToastService,
    private _settlementService: AnnualBreederResetService,
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  public resetBreeders() {
    this.lock = true;
    this._settlementService.annualSettlementReset().subscribe(
      result => {
        this.messageService.successToast('You have successfully reset the breeder settlement counts and balances');
        this._router.navigateByUrl(
          'DashboardComponent'
        );
        return;
      }, error => {
        this.messageService.errorToast(error);
        console.error(error);
      }
    );
  }
}
