// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { UploadModule } from '@progress/kendo-angular-upload';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material.module';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome/';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { PrimeModule } from '../prime.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {
  MatInputModule,
  MatFormFieldModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpModule } from '@angular/http';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxCurrencyModule } from 'ngx-currency';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { MatPaginatorModule } from '@angular/material';
import { MatBadgeModule } from '@angular/material/badge';
import { AgGridModule } from '@ag-grid-community/angular';
import {MatDialogModule} from '@angular/material/dialog';
import {FileUploadModule} from 'primeng/fileupload';


// components

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  RouterTab,
  RouterTabComponent,
  RouterTabItem
} from './shared/router-tab/router-tab.component';
import { HeaderComponent } from './shared/header.template';
import { ErrorComponent } from './error/error.component';
import { SuccessComponent } from './success/success.component';
import { AccountMaintenanceComponent } from './account-maintenance/account-maintenance.component';
import { EditAccountButtonComponent } from './account-maintenance/edit-account-button/edit-account-button.component';
import { EditAccountComponent } from './account-maintenance/edit-account/edit-account.component';
import { GrowerAccountHeaderComponent } from './grower-account-header/grower-account-header.component';
import { GrowerTransactionsComponent } from './grower-transactions/grower-transactions.component';
import { GrowerTransactionsEditButtonComponent } from './grower-transactions/grower-transactions-edit-button/grower-transactions-edit-button.component';
import { ViewBatchComponent } from './grower-transactions/view-batch/view-batch.component';
import { TransactionsActionButtonsComponent } from './grower-transactions/view-batch/transactions-action-buttons/transactions-action-buttons.component';
import { AddGrowerTransactionComponent } from './grower-transactions/add-grower-transaction/add-grower-transaction.component';
import { ImportTransactionsComponent } from './grower-transactions/import-transactions/import-transactions.component';
import { AddBankNoteComponent } from './bank-note/add-bank-note/add-bank-note.component';
import { ImportSettlementsComponent } from './settlement/import-settlements/import-settlements.component';
import { SettlementListComponent } from './settlement/settlement-list/settlement-list.component';
import { AccountInquiryComponent } from './account-inquiry/account-inquiry.component';
import { EditGrowerMasterComponent } from './account-maintenance/edit-grower-master/edit-grower-master.component';
import { SettlementListTransferButtonComponent } from './settlement/settlement-list/settlement-list-transfer-button/settlement-list-transfer-button.component';
import { SettlementListEditButtonComponent } from './settlement/settlement-list/settlement-list-edit-button/settlement-list-edit-button.component';
import { SettlementInfoDetailPanelComponent } from './settlement/settlement-list/settlement-info-detail-panel/settlement-info-detail-panel.component';
import { ViewGrowerMasterComponent } from './account-maintenance/view-grower-master/view-grower-master.component';
import { GrowerMasterListComponent } from './account-maintenance/grower-master-list/grower-master-list.component';
import { GrowerMasterEditButtonComponent } from './account-maintenance/grower-master-list/grower-master-edit-button/grower-master-edit-button.component';
import { GrowerAccountTransferComponent } from './grower-account-transfer/grower-account-transfer.component';
import { EditSettlementComponent } from './settlement/settlement-list/edit-settlement/edit-settlement.component';
import { CurrencyCellEditorComponent } from './utilities/currency-cell-editor/currency-cell-editor.component';
import { AddGrowerInvoiceComponent } from './grower-invoice/add-grower-invoice/add-grower-invoice.component';


// services/providers
import { RouteGuardService } from './route-guard/route-guard.service';


import { AuthorizationUtilities } from './shared/auth-utilities';
import { GaugesModule } from '@progress/kendo-angular-gauges';
import { MessageService } from 'primeng/api';
import { ColorGenerator } from './shared/color-generator';
import { DashboardService } from './dashboard/dashboard.service';
import { AppInitService } from './app-init.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SafePipe } from './shared/safe.pipe';

import { ConfirmationService } from 'primeng/api';

// Directives
import { InCellTabDirective } from './shared/directives/incell-tab.directive';
import { VersionCheckService } from './shared/version-check.service';
import { CanDeactivateGuard } from './route-guard/can-deactivate-guard.service';
import { BadgeService } from './shared/badge.service';
import { UserManagementService } from './user-management/user-management.service';
import { AccountMaintenanceService } from './account-maintenance/account-maintenance.service';
import { EditAccountService } from './account-maintenance/edit-account/edit-account.service';
import { GrowerAccountHeaderService } from './grower-account-header/grower-account-header.service';
import { GrowerTransactionsService } from './grower-transactions/grower-transactions.service';
import { ViewBatchService } from './grower-transactions/view-batch/view-batch.service';
import { AddGrowerTransactionService } from './grower-transactions/add-grower-transaction/add-grower-transaction.service';
import { ImportTransactionsService } from './grower-transactions/import-transactions/import-transactions.service';
import { AddBankNoteService } from './bank-note/add-bank-note/add-bank-note.service';
import { ImportSettlementsService } from './settlement/import-settlements/import-settlements.service';
import { SettlementListService } from './settlement/settlement-list/settlement-list.service';
import { AccountInquiryService } from './account-inquiry/account-inquiry.service';
import { EditGrowerMasterService } from './account-maintenance/edit-grower-master/edit-grower-master.service';
import { ViewGrowerMasterService } from './account-maintenance/view-grower-master/view-grower-master.service';
import { GrowerMasterListService } from './account-maintenance/grower-master-list/grower-master-list.service';
import { DropdownService } from './shared/dropdown.service';
import { GrowerAccountTransferService } from './grower-account-transfer/grower-account-transfer.service';
import { AddGrowerInvoiceService } from './grower-invoice/add-grower-invoice/add-grower-invoice.service';
import { RelatedGrowerActionsComponent, ConfirmDeleteRelationModal } from './account-maintenance/edit-grower-master/related-grower-actions/related-grower-actions.component';
import { RelatedGrowerActionsService } from './account-maintenance/edit-grower-master/related-grower-actions/related-grower-actions.service';
import { BankNoteListComponent } from './bank-note-list/bank-note-list.component';
import { BankNoteListService } from './bank-note-list/bank-note-list.service';
import { BankNoteActionButtonsComponent } from './bank-note-list/bank-note-action-buttons/bank-note-action-buttons.component';
import { GrowerSelectionPanelComponent } from './grower-selection-panel/grower-selection-panel.component';
import { GrowerSelectionPanelService } from './grower-selection-panel/grower-selection-panel.service';
import { SettlementInfoDetailPanelService } from './settlement/settlement-list/settlement-info-detail-panel/settlement-info-detail-panel.service';
import { AccountTransferComponent } from './account-maintenance/account-transfer/account-transfer.component';
import { AccountTransferService } from './account-maintenance/account-transfer/account-transfer.service';
import { WeekEndingDatePickerComponent } from './week-ending-date-picker/week-ending-date-picker.component';
import { GrowerInvoiceListComponent } from './grower-invoice-list/grower-invoice-list.component';
import { GLDistributionActionsComponent } from './grower-invoice/gldistribution-actions/gldistribution-actions.component';
import { SettlementBatchListComponent } from './settlement/settlement-batch-list/settlement-batch-list.component';
import { SettlementBatchListService } from './settlement/settlement-batch-list/settlement-batch-list.service';
import { SettlementBatchActionsComponent } from './settlement/settlement-batch-list/settlement-batch-actions/settlement-batch-actions.component';
import { SettlementBatchActionsService } from './settlement/settlement-batch-list/settlement-batch-actions/settlement-batch-actions.service';
import { FixSettlementsComponent } from './settlement/fix-settlements/fix-settlements.component';
import { ViewSettlementBatchComponent } from './settlement/view-settlement-batch/view-settlement-batch.component';
import { FixSettlementsService } from './settlement/fix-settlements/fix-settlements.service';
import { NumericEditorComponent } from './numeric-editor/numeric-editor.component';
import { GrowerInvoiceListService } from './grower-invoice-list/grower-invoice-list.service';
import { GrowerInvoiceListActionsComponent } from './grower-invoice-list/grower-invoice-list-actions/grower-invoice-list-actions.component';
import { UtilityService } from './shared/utility.service';
import { WeekEndingDatePickerService } from './week-ending-date-picker/week-ending-date-picker.service';
import { DatabaseReseederComponent } from './database-reseeder/database-reseeder.component';
import { DatabaseReseederService } from './database-reseeder/database-reseeder.service';
import { AccountNameCellRendererComponent } from './shared/account-name-cell-renderer/account-name-cell-renderer.component';
import { GrowerSelectActionComponent } from './grower-selection-panel/grower-select-action/grower-select-action.component';
import { ReportingComponent } from './reporting/reporting.component';
import { CreditInquiryComponent } from './inquiry/credit-inquiry/credit-inquiry.component';
import { MonthEndCorporateReportComponent } from './inquiry/month-end-corporate-report/month-end-corporate-report.component';
import { MonthEndPcsReportComponent } from './inquiry/month-end-pcs-report/month-end-pcs-report.component';
import { MonthEndFlockJournalReportComponent } from './inquiry/month-end-flock-journal-report/month-end-flock-journal-report.component';
import { CreditInquiryService } from './inquiry/credit-inquiry/credit-inquiry.service';
import { InvoiceBatchListComponent } from './invoice-workflow/invoice-batch-list/invoice-batch-list.component';
import { ViewInvoiceBatchComponent } from './invoice-workflow/view-invoice-batch/view-invoice-batch.component';
import { AddInvoicePaymentRequestComponent } from './invoice-workflow/add-invoice-payment-request/add-invoice-payment-request.component';
import { InvoiceBatchApprovalComponent } from './invoice-workflow/invoice-batch-approval/invoice-batch-approval.component';
import { InvoiceItemApprovalComponent } from './invoice-workflow/invoice-item-approval/invoice-item-approval.component';
import { ProcessInvoiceRequestsComponent } from './invoice-workflow/process-invoice-requests/process-invoice-requests.component';
import { ProcessInvoiceRequestItemComponent } from './invoice-workflow/process-invoice-request-item/process-invoice-request-item.component';
import { ToastService } from './shared/toast.service';
import { InvoiceBatchListService } from './invoice-workflow/invoice-batch-list/invoice-batch-list.service';
import { InvoiceBatchListActionsComponent } from './invoice-workflow/invoice-batch-list/invoice-batch-list-actions/invoice-batch-list-actions.component';
import { ViewInvoiceBatchService } from './invoice-workflow/view-invoice-batch/view-invoice-batch.service';
import { PaymentRequestBatchItemActionsComponent } from './invoice-workflow/view-invoice-batch/payment-request-batch-item-actions/payment-request-batch-item-actions.component';
import { AddInvoicePaymentRequestService } from './invoice-workflow/add-invoice-payment-request/add-invoice-payment-request.service';
import { WorkflowContactManagementComponent } from './invoice-workflow/workflow-contact-management/workflow-contact-management.component';
import { WorkflowContactManagementService } from './invoice-workflow/workflow-contact-management/workflow-contact-management.service';
import { WorkflowContactActionsComponent } from './invoice-workflow/workflow-contact-management/workflow-contact-actions/workflow-contact-actions.component';
import { FarmDistributionActionsComponent } from './invoice-workflow/add-invoice-payment-request/farm-distribution-actions/farm-distribution-actions.component';
import { InvoiceBatchApprovalService } from './invoice-workflow/invoice-batch-approval/invoice-batch-approval.service';
import { InvoiceFileRendererComponent } from './invoice-workflow/invoice-file-renderer/invoice-file-renderer.component';
import { InvoiceRequestApprovalActionsComponent } from './invoice-workflow/invoice-batch-approval/invoice-request-approval-actions/invoice-request-approval-actions.component';
import { InvoicePaymentRequestViewPanelComponent } from './invoice-workflow/invoice-payment-request-view-panel/invoice-payment-request-view-panel.component';
import { ProcessInvoiceRequestsService } from './invoice-workflow/process-invoice-requests/process-invoice-requests.service';
import { ProcessInvoiceRequestActionsComponent } from './invoice-workflow/process-invoice-requests/process-invoice-request-actions/process-invoice-request-actions.component';
import { ProcessInvoiceRequestItemService } from './invoice-workflow/process-invoice-request-item/process-invoice-request-item.service';
import { InvoiceItemCancelledComponent } from './invoice-workflow/invoice-item-cancelled/invoice-item-cancelled.component';
import { InvoiceItemCancelledService } from './invoice-workflow/invoice-item-cancelled/invoice-item-cancelled.service';
import { InvoiceRequestItemApprovalComponent } from './invoice-workflow/invoice-request-item-approval/invoice-request-item-approval.component';
import { ProcessInvoiceBatchListComponent } from './invoice-workflow/process-invoice-batch-list/process-invoice-batch-list.component';
// tslint:disable-next-line:max-line-length
import { ProcessInvoiceBatchListActionsComponent } from './invoice-workflow/process-invoice-batch-list/process-invoice-batch-list-actions/process-invoice-batch-list-actions.component';
import { ViewInvoicePaymentRequestComponent } from './invoice-workflow/view-invoice-payment-request/view-invoice-payment-request.component';
import { StatusRendererComponent } from './invoice-workflow/status-renderer/status-renderer.component';
import { SelectSettlementPanelComponent } from './settlement/select-settlement-panel/select-settlement-panel.component';
import { SettlementSelectionActionComponent } from './settlement/select-settlement-panel/settlement-selection-action/settlement-selection-action.component';
import { AccountDropdownComponent } from './invoice-workflow/add-invoice-payment-request/account-dropdown/account-dropdown.component';
import { QuickAccountTextComponent } from './shared/quick-account-text/quick-account-text.component';
import { AnnualBreederResetComponent } from './settlement/annual-breeder-reset/annual-breeder-reset.component';
import { AnnualBreederResetService } from './settlement/annual-breeder-reset/annual-breeder-reset.service';
import { TaxExemptListComponent } from './grower-transactions/tax-exempt-list/tax-exempt-list.component';
import { TaxExemptListService } from './grower-transactions/tax-exempt-list/tax-exempt-list.service';
import { GrowerBonusUploadComponent } from './grower-bonus-upload/grower-bonus-upload.component';
import { GrowerBonusUploadService } from './grower-bonus-upload/grower-bonus-upload.service';
import { Grower1099ManagementComponent } from './grower1099-management/grower1099-management.component';
import { Grower1099ManagementService } from './grower1099-management/grower1099-management.service';
import { InvoiceRequestHistoryListComponent } from './invoice-workflow/invoice-request-history-list/invoice-request-history-list.component';
import { ShowInvoiceTotalComponentComponent } from './invoice-workflow/process-invoice-requests/show-invoice-total-component/show-invoice-total-component.component';
import { FileModalComponent } from './shared/file-modal/file-modal.component';
import { FarmDistributionRendererComponent, ShowGrowerModal } from './invoice-workflow/invoice-batch-approval/farm-distribution-renderer/farm-distribution-renderer.component';
import { InvoiceSearchComponent } from './invoice-workflow/invoice-search/invoice-search.component';
import { InvoiceSearchService } from './invoice-workflow/invoice-search/invoice-search.service';
import { AlternatePayeeListComponent } from './invoice-workflow/alternate-payee-list/alternate-payee-list.component';
import { AlternatePayeeItemActionsComponent } from './invoice-workflow/alternate-payee-list/alternate-payee-item-actions/alternate-payee-item-actions.component';
import { AlternatePayeeListService } from './invoice-workflow/alternate-payee-list/alternate-payee-list.service';
import { ViewInvoiceFullPanelComponent } from './invoice-workflow/view-invoice-full-panel/view-invoice-full-panel.component';
import { ViewInvoiceFullPanelService } from './invoice-workflow/view-invoice-full-panel/view-invoice-full-panel.service';
import { InvoiceSearchActionsComponent } from './invoice-workflow/invoice-search/invoice-search-actions/invoice-search-actions.component';
import { InvoiceDetailsModalComponent } from './invoice-workflow/invoice-details-modal/invoice-details-modal.component';
import { AccountSearchComponent } from './shared/account-search/account-search.component';
import { AccountSelectActionComponent } from './shared/account-search/account-select-action/account-select-action.component';
import { AccountInquiry2Component } from './inquiry/account-inquiry/account-inquiry.component';
import { APBalanceCompareComponent } from './invoice-workflow/apbalance-compare/apbalance-compare.component';
import { APBalanceCompareService } from './invoice-workflow/apbalance-compare/apbalance-compare.service';
import { GrowerFarmInformationComponent } from './grower-farm-information/grower-farm-information.component';
import { DisabledForRoleDirective } from './ui-directive/disabled-for-role.directive';
import { GrowerAccountDetailComponent } from './grower-account-detail/grower-account-detail.component';



// import {
//   CurrencyMaskConfig,
//   CURRENCY_MASK_CONFIG
// } from 'ng2-currency-mask/src/currency-mask.config';

export function initializeApp1(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}

// tslint:disable-next-line:naming-convention
export const CustomCurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '$ ',
  suffix: '',
  thousands: ',',
  nullable: true
};




// ? why is this here?
// export const customCurrencyMaskConfig = {
//   align: 'right',
//   allowNegative: true,
//   allowZero: true,
//   decimal: '.',
//   precision: 0,
//   prefix: '$ ',
//   suffix: '',
//   thousands: ',',
//   nullable: true
// };

// tslint:disable-next-line:naming-convention
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 0.5
};

@NgModule({
  declarations: [
    AppComponent,

    DashboardComponent,
    HeaderComponent,
    InCellTabDirective,
    ErrorComponent,
    RouterTab,
    RouterTabComponent,
    RouterTabItem,
    SuccessComponent,
    SafePipe,
    AccountMaintenanceComponent,
    EditAccountButtonComponent,
    EditAccountComponent,
    GrowerAccountHeaderComponent,
    GrowerTransactionsComponent,
    GrowerTransactionsEditButtonComponent,
    ViewBatchComponent,
    TransactionsActionButtonsComponent,
    AddGrowerTransactionComponent,
    ImportTransactionsComponent,
    AddBankNoteComponent,
    ImportSettlementsComponent,
    SettlementListComponent,
    AccountInquiryComponent,
    EditGrowerMasterComponent,
    SettlementListTransferButtonComponent,
    SettlementListEditButtonComponent,
    SettlementInfoDetailPanelComponent,
    ViewGrowerMasterComponent,
    GrowerMasterListComponent,
    GrowerMasterEditButtonComponent,
    GrowerAccountTransferComponent,
    EditSettlementComponent,
    CurrencyCellEditorComponent,
    AddGrowerInvoiceComponent,
    RelatedGrowerActionsComponent,
    ConfirmDeleteRelationModal,
    BankNoteListComponent,
    BankNoteActionButtonsComponent,
    GrowerSelectionPanelComponent,
    AccountTransferComponent,
    WeekEndingDatePickerComponent,
    GrowerInvoiceListComponent,
    GLDistributionActionsComponent,
    SettlementBatchListComponent,
    SettlementBatchActionsComponent,
    FixSettlementsComponent,
    ViewSettlementBatchComponent,
    NumericEditorComponent,
    GrowerInvoiceListActionsComponent,
    DatabaseReseederComponent,
    AccountNameCellRendererComponent,
    GrowerSelectActionComponent,
    ReportingComponent,
    CreditInquiryComponent,
    MonthEndCorporateReportComponent,
    MonthEndPcsReportComponent,
    MonthEndFlockJournalReportComponent,
    InvoiceBatchListComponent,
    ViewInvoiceBatchComponent,
    AddInvoicePaymentRequestComponent,
    InvoiceBatchApprovalComponent,
    InvoiceItemApprovalComponent,
    ProcessInvoiceRequestsComponent,
    ProcessInvoiceRequestItemComponent,
    InvoiceBatchListActionsComponent,
    PaymentRequestBatchItemActionsComponent,
    WorkflowContactManagementComponent,
    WorkflowContactActionsComponent,
    FarmDistributionActionsComponent,
    InvoiceFileRendererComponent,
    InvoiceRequestApprovalActionsComponent,
    InvoicePaymentRequestViewPanelComponent,
    ProcessInvoiceRequestActionsComponent,
    InvoiceItemCancelledComponent,
    InvoiceRequestItemApprovalComponent,
    ProcessInvoiceBatchListComponent,
    ProcessInvoiceBatchListActionsComponent,
    ViewInvoicePaymentRequestComponent,
    StatusRendererComponent,
    SelectSettlementPanelComponent,
    SettlementSelectionActionComponent,
    AccountDropdownComponent,
    QuickAccountTextComponent,
    AnnualBreederResetComponent,
    TaxExemptListComponent,
    GrowerBonusUploadComponent,
    Grower1099ManagementComponent,
    InvoiceRequestHistoryListComponent,
    ShowInvoiceTotalComponentComponent,
    FileModalComponent,
    FarmDistributionRendererComponent,
    ShowGrowerModal,
    InvoiceSearchComponent,
    AlternatePayeeListComponent,
    AlternatePayeeItemActionsComponent,
    ViewInvoiceFullPanelComponent,
    InvoiceSearchActionsComponent,
    InvoiceDetailsModalComponent,
    AccountSearchComponent,
    AccountSelectActionComponent,
    AccountInquiry2Component,
    APBalanceCompareComponent,
    GrowerFarmInformationComponent,
    DisabledForRoleDirective,
    GrowerAccountDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GridModule,
    ChartsModule,
    DialogsModule,
    UploadModule,
    HttpClientModule,
    HttpModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    ButtonsModule,
    MatInputModule,
    MatFormFieldModule,
    ButtonsModule,
    PrimeModule,
    MatAutocompleteModule,
    GaugesModule,
    ToastModule,
    ChartModule,
    OverlayPanelModule,
    DialogModule,
    AccordionModule,
    MatButtonToggleModule,
    TableModule,
    ConfirmDialogModule,
    MatSlideToggleModule,
    DropDownsModule,
    MatDatepickerModule,
    DateInputsModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    MatExpansionModule,
    MatSidenavModule,
    // CurrencyMaskModule
    NgxCurrencyModule.forRoot(CustomCurrencyMaskConfig),
    MatTooltipModule,
    MatCheckboxModule,
    PerfectScrollbarModule,
    DeviceDetectorModule.forRoot(),
    MatTabsModule,
    MatPaginatorModule,
    FileUploadModule,
    MatDialogModule,
    AgGridModule.withComponents(
      [
        EditAccountButtonComponent,
        GrowerTransactionsEditButtonComponent,
        TransactionsActionButtonsComponent,
        SettlementListEditButtonComponent,
        SettlementListTransferButtonComponent,
        SettlementInfoDetailPanelComponent,
        GrowerMasterEditButtonComponent,
        CurrencyCellEditorComponent,
        RelatedGrowerActionsComponent,
        BankNoteActionButtonsComponent,
        GLDistributionActionsComponent,
        SettlementBatchActionsComponent,
        NumericEditorComponent,
        GrowerInvoiceListActionsComponent,
        AccountNameCellRendererComponent,
        GrowerSelectActionComponent,
        InvoiceBatchListActionsComponent,
        PaymentRequestBatchItemActionsComponent,
        WorkflowContactActionsComponent,
        FarmDistributionActionsComponent,
        InvoiceFileRendererComponent,
        InvoiceRequestApprovalActionsComponent,
        ProcessInvoiceRequestActionsComponent,
        ProcessInvoiceBatchListActionsComponent,
        StatusRendererComponent,
        SettlementSelectionActionComponent,
        AccountDropdownComponent,
        ShowInvoiceTotalComponentComponent,
        FarmDistributionRendererComponent,
        AlternatePayeeItemActionsComponent,
        InvoiceSearchActionsComponent,
        AccountSelectActionComponent,
      ]
    ),
    MatBadgeModule,
    MatDialogModule
  ],
  providers: [
    RouteGuardService,
    AuthorizationUtilities,
    DashboardService,
    MessageService,
    ColorGenerator,
    ConfirmationService,
    VersionCheckService,
    // { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    CanDeactivateGuard,
    CurrencyPipe,
    DatePipe,
    SafePipe,
    BadgeService,
    AppInitService,
    AccountMaintenanceService,
    UserManagementService,
    EditAccountService,
    ViewBatchService,
    GrowerTransactionsService,
    GrowerAccountHeaderService,
    AddGrowerTransactionService,
    ImportTransactionsService,
    AddBankNoteService,
    ImportSettlementsService,
    SettlementListService,
    AccountInquiryService,
    EditGrowerMasterService,
    ViewGrowerMasterService,
    GrowerMasterListService,
    DropdownService,
    GrowerAccountTransferService,
    AddGrowerInvoiceService,
    RelatedGrowerActionsService,
    BankNoteListService,
    GrowerSelectionPanelService,
    SettlementInfoDetailPanelService,
    AccountTransferService,
    SettlementBatchListService,
    SettlementBatchActionsService,
    FixSettlementsService,
    GrowerInvoiceListService,
    UtilityService,
    WeekEndingDatePickerService,
    DatabaseReseederService,
    CreditInquiryService,
    ToastService,
    InvoiceBatchListService,
    ViewInvoiceBatchService,
    AddInvoicePaymentRequestService,
    WorkflowContactManagementService,
    InvoiceBatchApprovalService,
    ProcessInvoiceRequestsService,
    ProcessInvoiceRequestItemService,
    InvoiceItemCancelledService,
    AnnualBreederResetService,
    TaxExemptListService,
    GrowerBonusUploadService,
    Grower1099ManagementService,
    InvoiceSearchService,
    AlternatePayeeListService,
    ViewInvoiceFullPanelService,
    APBalanceCompareService,
    // DomSanitizer,
    { provide: APP_INITIALIZER, useFactory: initializeApp1, deps: [AppInitService], multi: true},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmDeleteRelationModal,
    FileModalComponent,
    ShowGrowerModal,
    InvoiceDetailsModalComponent,
  ],
})
export class AppModule {}
