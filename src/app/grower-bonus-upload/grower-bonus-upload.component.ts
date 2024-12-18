import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { IGrowerBonusPayment } from '../models/grower-bonus-payment.interface';
import { ToastService } from '../shared/toast.service';
import { ICurrentUser } from '../user-management/current-user.interface';
import { IGrowerBonusEntry } from './grower-bonus-entry.interface';
import { GrowerBonusUploadService } from './grower-bonus-upload.service';

@Component({
  selector: 'app-grower-bonus-upload',
  templateUrl: './grower-bonus-upload.component.html',
  styleUrls: ['./grower-bonus-upload.component.css']
})
export class GrowerBonusUploadComponent implements OnInit {

  pageTitle = 'Grower Bonuses';
  moduleTitle = 'Account Maintenance';
  innerWidth: number;
  innerHeight: number;

  fileProcessing: boolean = false;

  constructor(
    private toastService: ToastService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _paymentService: GrowerBonusUploadService,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  onFileChange(event: any) {
    this.fileProcessing = true;
    this.toastService.infoToast('Please wait while we process your file');
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });


      // the second sheet has what we want
      const wsname: string = wb.SheetNames[1];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      // to get 2d array pass 2nd parameter as object {header: 1}. Data will be logged in array format containing objects
      const data = XLSX.utils.sheet_to_json(ws) as any[];
      const jsonData = JSON.stringify(data).split('Farm No').join('FarmNo').split('Farm Name').join('FarmName').split('Grower Bonus').join('GrowerBonus');
      const entries = JSON.parse(jsonData) as IGrowerBonusEntry[];

      // get the user
      const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;

      // map the entries to our models
      // tslint:disable-next-line:no-shadowed-variable
      const payments = entries.map(e => {
        const payment = {
          id: 0,
          growerId: parseInt(e.FarmNo, 10),
          bonusPaymentDate: new Date(),
          paymentAmount: e.GrowerBonus,
          uploadUser: user.username,
        } as IGrowerBonusPayment;
        return payment;
      }).slice(0, entries.length - 1); // the last line is a total so we skip it

      this._paymentService.postGrowerBonuses(payments).subscribe(
        result => {
          this.fileProcessing = false;
          if (result.statusCode === 200) {
            this.toastService.successToast('You have successfully uploaded ' + payments.length + ' grower bonus payments');
            setTimeout(() => {
              this._router.navigateByUrl(
                'DashboardComponent'
              );
            }, 2000);
          } else {
            this.toastService.errorToast('An error occurred during processing the file: ' + result.data);
          }
        }, error => {
          console.error(error);
          this.toastService.errorToast(error);
          this.fileProcessing = false;
        }
      );
    };
 }


}
