import { Component, OnInit, Input } from '@angular/core';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IApinvoicePaymentFarmDistribution } from 'src/app/models/ap-invoice-payment-farm-distribution.interface';
import { IInvoicePaymentRequestVM } from '../view-invoice-batch/invoice-payment-request-vm.interface';
import { IFarmDistributionVM } from '../add-invoice-payment-request/farm-distribution-actions/farm-distribution-vm.interface';
import { AddInvoicePaymentRequestService } from '../add-invoice-payment-request/add-invoice-payment-request.service';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { IDropdownListItem } from 'src/app/models/dropdown-list-item.interface';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerAccountType } from 'src/app/models/grower-account-type.interface';
import { AddGrowerInvoiceService } from 'src/app/grower-invoice/add-grower-invoice/add-grower-invoice.service';
import { IApinvoice } from 'src/app/models/apinvoice.interface';
import { FileModalComponent } from 'src/app/shared/file-modal/file-modal.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-invoice-payment-request-view-panel',
  templateUrl: './invoice-payment-request-view-panel.component.html',
  styleUrls: ['./invoice-payment-request-view-panel.component.css']
})
export class InvoicePaymentRequestViewPanelComponent implements OnInit {
  @Input() id: number;
  innerWidth: number;
  innerHeight: number;

  private paymentRequest: IInvoicePaymentRequestVM;
  private apInvoice: IApinvoice;
  private distributions: IFarmDistributionVM[] = [];
  public loaded: boolean = false;
  private companyName: string;
  private blob: Blob;

  // dropdowns
  growerList: IGrowerMaster[] = [];
  vendorList: IVwApvendorMaster[] = [];
  companyList: IDropdownListItem[] = [];
  account: IGrowerAccount;
  accountTypeList: IGrowerAccountType[] = [];
  private allowedMimeTypes: string[] = [
    'application/pdf',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'text/plain',
  ];

  constructor(
    private _invoiceService: AddInvoicePaymentRequestService,
    private _apService: AddGrowerInvoiceService,
    private _growerService: GrowerMasterListService,
    private _accountService: AccountMaintenanceService,
    private _dropdownService: DropdownService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    // set dimensions
    this.innerWidth = window.innerWidth * 0.65;
    this.innerHeight = window.innerHeight;



    // load dropdowns
    this.loadAccountTypes();
  }

  private loadInvoice(id: number) {
    this._invoiceService.getAPInvoicePaymentRequestById(id).subscribe(
      result => {
        this.paymentRequest = {
          invoice: result,
        } as IInvoicePaymentRequestVM;
        if (this.paymentRequest.invoice.vendorId > 9999) {
          this.paymentRequest.invoice.vendorId = parseInt(this.paymentRequest.invoice.vendorId.toString().substring(0, 4), 10);
        }

        const grower = this.growerList.find(g => g.id.toString() === result.growerId.toString());
        const vendor = this.vendorList.find(v => v.vnumb.toString() === result.vendorId.toString());
        this.paymentRequest.farmName = grower.id + ' - ' + grower.farmName;
        this.paymentRequest.vendorName = vendor.vnumb + ' - ' + vendor.vname;
        this.companyName = this.companyList.find(c => c.Value.toString() === result.company.toString()).Text;

        // if there's an AP Invoice, load it too
        if (!!result.apinvoiceId && parseInt(result.apinvoiceId, 10) > 0) {
          this._apService.getInvoice(parseInt(result.apinvoiceId, 10)).subscribe(
            apInvoice => {
              this.apInvoice = apInvoice;
            }, error => {
              console.error(error);
            }
          );
        }

        this.loadAccount(result.growerId);



        this.generateFileForView();


      }, error => {
        console.error(error);
      }
    );
  }

  private loadDistributions(id: number) {
    this._invoiceService.getInvoicePaymentFarmDistributions(id).subscribe(
      result => {
        this.distributions = result.map(d => {
          const grower = this.growerList.find(g => g.id.toString() === d.growerId.toString());
          return {
            amount: d.amount,
            name: grower.id + ' - ' + grower.farmName,
            growerAccountId: d.growerAccountId,
          } as IFarmDistributionVM;
        });

        this.loaded = true;
      }, error => {
        console.error(error);
      }
    );
  }

   /** make the conversions to the file data to generate a blob (and update the parent grid) */
  public generateFileForView() {
    const byteCharacters = atob(this.paymentRequest.invoice.fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    this.blob = new Blob([byteArray], {type: this.paymentRequest.invoice.mimeType});


    // this.displayFile();
  }

  /** create a url from the blob and render it */
  public displayFile() {
    const url = window.URL.createObjectURL(this.blob);
    if (this.allowedMimeTypes.includes(this.paymentRequest.invoice.mimeType)) {
      this.dialog.open(FileModalComponent, {
        data: {
          url: url,
          width: (this.innerWidth * 0.75),
          height: (this.innerHeight * 0.90),
          fileName: this.paymentRequest.invoice.fileName,
          mimeType: this.paymentRequest.invoice.mimeType,
        },
        width: (this.innerWidth * 0.8).toString() + 'px',
        height: (this.innerHeight * 0.95).toString() + 'px',
      });
    } else {
      const anchor = document.createElement('a');
      anchor.download = this.paymentRequest.invoice.fileName;
      anchor.href = url;
      anchor.click();
    }


    // console.log(url);
    // const anchor = document.createElement('a');
    // anchor.download = this.paymentRequestModel.fileName;
    // anchor.href = url;
    // anchor.click();
  }

  /***************************************************
   * Dropdowns
   **************************************************/

  private loadAccountTypes() {
    this._dropdownService.getAccountTypes().subscribe(
      result => {
        this.accountTypeList = result;
        this.loadVendorList();
      }, error => {
        console.error(error);
      }
    );
  }

  /** load the vendor list from storage */
  private loadVendorList() {
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
    this.loadCompanyList();
  }

  /** load the company dropdown list */
  private loadCompanyList() {
    this._dropdownService
    .getCompanies()
    .subscribe(
      data => {
        try {
          this.companyList = data;
          this.loadGrowerList();

        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  private loadGrowerList() {
    this._growerService
    .getGrowers(false)
    .subscribe(
      data => {
        try {
          this.growerList = data.map(g => {
            g.farmName = g.farmName.trim();
            return g;
          });
          this.loadInvoice(this.id);

        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }


  /** load the main account for the view panel */
  private loadAccount(id: number) {
    this._accountService.getGrowerAccounts(id).subscribe(
      result => {
        const accountList = result.map(a => {
          const match = this.accountTypeList.find(at => at.id.toString() === a.accountType);
          a.accountType = match.accountType + ' - ' + a.accountSuffix;
          return a;
        });
        this.account = accountList.find(a => a.id.toString() === this.paymentRequest.invoice.account.toString());
        this.loadDistributions(this.id);
      }, error => {
        console.error(error);
      }
    );
  }
}
