import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouteGuardService } from '../route-guard/route-guard.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ErrorComponent } from '../error/error.component';
import { SuccessComponent } from '../success/success.component';
import { AccountMaintenanceComponent } from '../account-maintenance/account-maintenance.component';
import { EditAccountComponent } from '../account-maintenance/edit-account/edit-account.component';
import { GrowerTransactionsComponent } from '../grower-transactions/grower-transactions.component';
import { ViewBatchComponent } from '../grower-transactions/view-batch/view-batch.component';
import { AddGrowerTransactionComponent } from '../grower-transactions/add-grower-transaction/add-grower-transaction.component';
import { ImportTransactionsComponent } from '../grower-transactions/import-transactions/import-transactions.component';
import { AddBankNoteComponent } from '../bank-note/add-bank-note/add-bank-note.component';
import { ImportSettlementsComponent } from '../settlement/import-settlements/import-settlements.component';
import { SettlementListComponent } from '../settlement/settlement-list/settlement-list.component';
import { AccountInquiryComponent } from '../account-inquiry/account-inquiry.component';
import { EditGrowerMasterComponent } from '../account-maintenance/edit-grower-master/edit-grower-master.component';
import { GrowerMasterListComponent } from '../account-maintenance/grower-master-list/grower-master-list.component';
import { GrowerAccountTransferComponent } from '../grower-account-transfer/grower-account-transfer.component';
import { AddGrowerInvoiceComponent } from '../grower-invoice/add-grower-invoice/add-grower-invoice.component';
import { BankNoteListComponent } from '../bank-note-list/bank-note-list.component';
import { AccountTransferComponent } from '../account-maintenance/account-transfer/account-transfer.component';
import { SettlementBatchListComponent } from '../settlement/settlement-batch-list/settlement-batch-list.component';
import { FixSettlementsComponent } from '../settlement/fix-settlements/fix-settlements.component';
import { GrowerInvoiceListComponent } from '../grower-invoice-list/grower-invoice-list.component';
import { DatabaseReseederComponent } from '../database-reseeder/database-reseeder.component';
import { ReportingComponent } from '../reporting/reporting.component';
import { CreditInquiryComponent } from '../inquiry/credit-inquiry/credit-inquiry.component';
import { InvoiceBatchListComponent } from '../invoice-workflow/invoice-batch-list/invoice-batch-list.component';
import { ViewInvoiceBatchComponent } from '../invoice-workflow/view-invoice-batch/view-invoice-batch.component';
import { AddInvoicePaymentRequestComponent } from '../invoice-workflow/add-invoice-payment-request/add-invoice-payment-request.component';
import { WorkflowContactManagementComponent } from '../invoice-workflow/workflow-contact-management/workflow-contact-management.component';
import { InvoiceBatchApprovalComponent } from '../invoice-workflow/invoice-batch-approval/invoice-batch-approval.component';
import { ProcessInvoiceRequestsComponent } from '../invoice-workflow/process-invoice-requests/process-invoice-requests.component';
import { ProcessInvoiceRequestItemComponent } from '../invoice-workflow/process-invoice-request-item/process-invoice-request-item.component';
import { InvoiceItemCancelledComponent } from '../invoice-workflow/invoice-item-cancelled/invoice-item-cancelled.component';
import { InvoiceRequestItemApprovalComponent } from '../invoice-workflow/invoice-request-item-approval/invoice-request-item-approval.component';
import { ProcessInvoiceBatchListComponent } from '../invoice-workflow/process-invoice-batch-list/process-invoice-batch-list.component';
import { ViewInvoicePaymentRequestComponent } from '../invoice-workflow/view-invoice-payment-request/view-invoice-payment-request.component';
import { AnnualBreederResetComponent } from '../settlement/annual-breeder-reset/annual-breeder-reset.component';
import { TaxExemptListComponent } from '../grower-transactions/tax-exempt-list/tax-exempt-list.component';
import { GrowerBonusUploadComponent } from '../grower-bonus-upload/grower-bonus-upload.component';
import { Grower1099ManagementComponent } from '../grower1099-management/grower1099-management.component';
import { InvoiceSearchComponent } from '../invoice-workflow/invoice-search/invoice-search.component';
import { AlternatePayeeListComponent } from '../invoice-workflow/alternate-payee-list/alternate-payee-list.component';
import { AccountInquiry2Component } from '../inquiry/account-inquiry/account-inquiry.component';
import { APBalanceCompareComponent } from '../invoice-workflow/apbalance-compare/apbalance-compare.component';
import {GrowerFarmInformationComponent} from '../grower-farm-information/grower-farm-information.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      [
        {
          canActivate: [RouteGuardService],
          path: 'DashboardComponent',
          component: DashboardComponent,
          data: { state: 'DashboardComponent', role: 'Grower Accounting Admin,Accounting,LPO Entry,LPO Approver,Grower Accounting Approver,Invoice Processor' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ErrorComponent',
          component: ErrorComponent,
          data: { state: 'ErrorComponent', role: '' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AccountMaintenanceComponent',
          component: AccountMaintenanceComponent,
          data: { state: 'AccountMaintenanceComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'EditAccountComponent',
          component: EditAccountComponent,
          data: { state: 'EditAccountComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'GrowerTransactionsComponent',
          component: GrowerTransactionsComponent,
          data: { state: 'GrowerTransactionsComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AddGrowerTransactionComponent',
          component: AddGrowerTransactionComponent,
          data: { state: 'AddGrowerTransactionComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ImportTransactionsComponent',
          component: ImportTransactionsComponent,
          data: { state: 'ImportTransactionsComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ViewBatchComponent',
          component: ViewBatchComponent,
          data: { state: 'ViewBatchComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AddBankNoteComponent',
          component: AddBankNoteComponent,
          data: { state: 'AddBankNoteComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ImportSettlementsComponent',
          component: ImportSettlementsComponent,
          data: { state: 'ImportSettlementsComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'SettlementListComponent',
          component: SettlementListComponent,
          data: { state: 'SettlementListComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AccountInquiryComponent',
          component: AccountInquiryComponent,
          data: { state: 'AccountInquiryComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AccountTransactionInquiryComponent',
          component: AccountInquiry2Component,
          data: { state: 'AccountTransactionInquiryComponent', role: 'Grower Accounting Admin,Accounting' }
        },

        {
          canActivate: [RouteGuardService],
          path: 'EditGrowerMasterComponent',
          component: EditGrowerMasterComponent,
          data: { state: 'EditGrowerMasterComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'GrowerMasterListComponent',
          component: GrowerMasterListComponent,
          data: { state: 'GrowerMasterListComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'GrowerAccountTransferComponent',
          component: GrowerAccountTransferComponent,
          data: { state: 'GrowerAccountTransferComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AddGrowerInvoiceComponent',
          component: AddGrowerInvoiceComponent,
          data: { state: 'AddGrowerInvoiceComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'BankNoteListComponent',
          component: BankNoteListComponent,
          data: { state: 'BankNoteListComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AccountTransferComponent',
          component: AccountTransferComponent,
          data: { state: 'AccountTransferComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'SettlementBatchListComponent',
          component: SettlementBatchListComponent,
          data: { state: 'SettlementBatchListComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'FixSettlementsComponent',
          component: FixSettlementsComponent,
          data: { state: 'FixSettlementsComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'GrowerInvoiceListComponent',
          component: GrowerInvoiceListComponent,
          data: { state: 'GrowerInvoiceListComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'DatabaseReseederComponent',
          component: DatabaseReseederComponent,
          data: { state: 'DatabaseReseederComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'APBalanceCompareComponent',
          component: APBalanceCompareComponent,
          data: { state: 'APBalanceCompareComponent', role: 'Grower Accounting Admin,Accounting' }
        },

        {
          canActivate: [RouteGuardService],
          path: 'SuccessComponent',
          component: SuccessComponent,
          data: { state: 'SuccessComponent', role: '' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ReportingComponent',
          component: ReportingComponent,
          data: { state: 'ReportingComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'CreditInquiryComponent',
          component: CreditInquiryComponent,
          data: { state: 'CreditInquiryComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'InvoiceBatchListComponent',
          component: InvoiceBatchListComponent,
          data: { state: 'InvoiceBatchListComponent', role: 'Grower Accounting Admin,LPO Entry' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ViewInvoiceBatchComponent',
          component: ViewInvoiceBatchComponent,
          data: { state: 'ViewInvoiceBatchComponent', role: 'Grower Accounting Admin,LPO Entry' }
        },

        {
          canActivate: [RouteGuardService],
          path: 'AddInvoicePaymentRequestComponent',
          component: AddInvoicePaymentRequestComponent,
          data: { state: 'AddInvoicePaymentRequestComponent', role: 'Grower Accounting Admin,LPO Entry' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'WorkflowContactManagementComponent',
          component: WorkflowContactManagementComponent,
          data: { state: 'WorkflowContactManagementComponent', role: 'Grower Accounting Admin' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'InvoiceBatchApprovalComponent',
          component: InvoiceBatchApprovalComponent,
          data: { state: 'InvoiceBatchApprovalComponent', role: 'Grower Accounting Admin,LPO Approver,Grower Account Approver,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ProcessInvoiceRequestsComponent',
          component: ProcessInvoiceRequestsComponent,
          data: { state: 'ProcessInvoiceRequestsComponent', role: 'Grower Accounting Admin,Invoice Processor' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ProcessInvoiceRequestItemComponent',
          component: ProcessInvoiceRequestItemComponent,
          data: { state: 'ProcessInvoiceRequestItemComponent', role: 'Grower Accounting Admin,Invoice Processor' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'InvoiceItemCancelledComponent',
          component: InvoiceItemCancelledComponent,
          data: { state: 'InvoiceItemCancelledComponent', role: '' } // should we have one?
        },
        {
          canActivate: [RouteGuardService],
          path: 'InvoiceRequestItemApprovalComponent',
          component: InvoiceRequestItemApprovalComponent,
          data: { state: 'InvoiceRequestItemApprovalComponent', role: 'Grower Accounting Admin,LPO Approver,Grower Account Approver,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ProcessInvoiceBatchListComponent',
          component: ProcessInvoiceBatchListComponent,
          data: { state: 'ProcessInvoiceBatchListComponent', role: 'Grower Accounting Admin,Invoice Processor' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'ViewInvoicePaymentRequestComponent',
          component: ViewInvoicePaymentRequestComponent,
          data: { state: 'ViewInvoicePaymentRequestComponent', role: 'Grower Accounting Admin,Invoice Processor,LPO Approver,Accounting,Grower Account Approver,LPO Entry' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AnnualBreederResetComponent',
          component: AnnualBreederResetComponent,
          data: { state: 'AnnualBreederResetComponent', role: 'Grower Accounting Admin,Accounting' }
        },

        {
          canActivate: [RouteGuardService],
          path: 'TaxExemptListComponent',
          component: TaxExemptListComponent,
          data: { state: 'TaxExemptListComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'GrowerBonusUploadComponent',
          component: GrowerBonusUploadComponent,
          data: { state: 'GrowerBonusUploadComponent', role: 'Grower Accounting Admin,Accounting' }
        },

        {
          canActivate: [RouteGuardService],
          path: 'Grower1099ManagementComponent',
          component: Grower1099ManagementComponent,
          data: { state: 'Grower1099ManagementComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'InvoiceSearchComponent',
          component: InvoiceSearchComponent,
          data: { state: 'InvoiceSearchComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'AlternatePayeeListComponent',
          component: AlternatePayeeListComponent,
          data: { state: 'AlternatePayeeListComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        {
          canActivate: [RouteGuardService],
          path: 'GrowerFarmInformationComponent',
          component: GrowerFarmInformationComponent,
          data: { state: 'GrowerFarmInformationComponent', role: 'Grower Accounting Admin,Accounting' }
        },
        { path: '', redirectTo: 'DashboardComponent', pathMatch: 'full' },
        { path: '**', redirectTo: 'DashboardComponent', pathMatch: 'full' }
      ],
      {
        useHash: true,
        onSameUrlNavigation: 'reload'
      }
    )
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
