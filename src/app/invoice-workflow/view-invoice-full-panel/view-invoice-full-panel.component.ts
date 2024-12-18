import { IApInvoiceWithRequestFullVM } from './../../models/ap-invoice-with-request-full-vm.interface';
import { Component, Input, OnInit } from '@angular/core';
import { IGLDistributionItem } from 'src/app/grower-invoice/add-grower-invoice/gl-distribution-item.interface';
import { IAccountType } from 'src/app/models/account-type.interface';
import { IApinvoicePaymentFarmDistribution } from 'src/app/models/ap-invoice-payment-farm-distribution.interface';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IApInvoice } from 'src/app/models/ap-invoice.interface';
import { IApgldistributionAccounts } from 'src/app/models/apgldistribution-accounts.interface';
import { IGLAccountMaster } from 'src/app/models/gl-account-master.interface';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { ViewInvoiceFullPanelService } from './view-invoice-full-panel.service';
import { IDropdownListItem } from 'src/app/models/dropdown-list-item.interface';

@Component({
  selector: 'app-view-invoice-full-panel',
  templateUrl: './view-invoice-full-panel.component.html',
  styleUrls: ['./view-invoice-full-panel.component.css']
})
export class ViewInvoiceFullPanelComponent implements OnInit {
  @Input() id: number;
  innerWidth: number;
  innerHeight: number;
  // some dropdowns
  growerList: IGrowerMaster[] = [];
  accountList: IGrowerAccount[] = [];
  accountTypes: IAccountType[] = [];
  glAccountList: IGLAccountMaster[] = [];
  vendorList: IVwApvendorMaster[] = [];
  companyList: IDropdownListItem[] = [];

  // models
  glDistributions: IApgldistributionAccounts[] = [];
  paymentRequestModel: IApinvoicePaymentRequest;
  growerDistributions: IApinvoicePaymentFarmDistribution[] = [];
  invoiceModel: IApInvoice;
  distributions: IGLDistributionItem[] = [];
  fullModel: IApInvoiceWithRequestFullVM;
  isLoaded: boolean = false;
  companyName: string;
  private blob: Blob;

  constructor(
    private _dropdownService: DropdownService,
    private _fullService: ViewInvoiceFullPanelService,
  ) { }

  ngOnInit() {
    // set dimensions
    this.innerWidth = window.innerWidth * 0.65;
    this.innerHeight = window.innerHeight;
    this.loadDropdowns();
  }






  public getGrowerName(id: number) {
    const match = this.growerList.find(g => g.id.toString() === id.toString());
    return !!!match ? '' : match.id.toString() + ' - ' + match.farmName;
  }

  public getVendorName(id: number) {
    const match = this.vendorList.find(g => g.vnumb.toString() === id.toString());
    return !!!match ? '' : match.vnumb.toString() + ' - ' + match.vname;
  }


  public getFullInvoice(id: number) {
    this._fullService.getFullInvoice(id).subscribe(result => {
      this.fullModel = result;
      this.companyName = this.companyList.find(c => c.Value.toString() === result.invoice.company.toString()).Text;

      if (!!result.request) {
        this.generateFileForView();
      }
      this.isLoaded = true;
    }, error => {
      console.error(error);
    });
  }







  private loadDropdowns() {
    this.loadAccountTypeList().then(() => {
      this.loadCompanyList();


    });
  }

  private loadCompanyList() {
    this._dropdownService
    .getCompanies()
    .subscribe(
      data => {
        try {
          this.companyList = data;
          this.loadGLAccountList();
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  private loadAccountTypeList(): Promise<any> {
    return new Promise((res) => {
      this._dropdownService
      .getAccountTypes()
      .subscribe(
        data => {
          try {
            this.accountTypes = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {

          console.error(error);
        }
      );

      res();
    });

  }



  /** Load the vendor dropdown list */
  private loadVendorList() {
    // since the call takes 10 seconds, we just cached it on app init and retrieve it from there
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
    this.getFullInvoice(this.id);
  }

  /** load the GL account list from the AS400 */
  private loadGLAccountList() {
    this._dropdownService
      .getGLAccounts()
      .subscribe(
        data => {
          try {
            this.glAccountList = data;

            this.loadVendorList();

          } catch (e) {
            console.error(e);
          }
        },
        error => {

          console.error(error);
        }
      );
  }

  /** helper to get a matching account to show the name */
  public getGLAccount(id: number) {
    return this.glAccountList.find(a => a.id.toString() === id.toString());
  }


  /** make the conversions to the file data to generate a blob (and update the parent grid) */
  public generateFileForView() {
    if (!!!this.fullModel.request.fileName) {
      this.blob = null;
    } else {
       const byteCharacters = atob(this.fullModel.request.fileData);
       const byteNumbers = new Array(byteCharacters.length);
       for (let i = 0; i < byteCharacters.length; i++) {
           byteNumbers[i] = byteCharacters.charCodeAt(i);
       }
       const byteArray = new Uint8Array(byteNumbers);
       this.blob = new Blob([byteArray], {type: this.fullModel.request.mimeType});
    }



   // this.displayFile();
 }

 /** create a url from the blob and render it */
 public displayFile() {
   const url = window.URL.createObjectURL(this.blob);
     const anchor = document.createElement('a');
     anchor.download = this.fullModel.request.fileName;
     anchor.href = url;
     anchor.click();
}

}
