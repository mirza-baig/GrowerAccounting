import { Component, OnInit, HostListener, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EditGrowerMasterService } from './edit-grower-master.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IGrowerMasterVM } from 'src/app/models/grower-master.vm.interface';
import { IRelatedGrowerDetail } from 'src/app/models/related-grower-detail.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { RelatedGrowerActionsComponent } from './related-grower-actions/related-grower-actions.component';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, Observable, observable } from 'rxjs';
import { GrowerMasterListService } from '../grower-master-list/grower-master-list.service';
import { IRelatedGrower } from 'src/app/models/related-grower.interface';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';

@Component({
  selector: 'app-edit-grower-master',
  templateUrl: './edit-grower-master.component.html',
  styleUrls: ['./edit-grower-master.component.css']
})
export class EditGrowerMasterComponent implements OnInit, OnDestroy {
  pageTitle = 'Edit Grower Master';
  moduleTitle = 'Account Maintenance';
  innerWidth: any;
  farmId: number;

  dropdownsLoaded: boolean = false;
  formLoaded: boolean = false;
  postSubmitted: boolean = false;

  archiveGrowerModal: boolean = false;

  growerModel: IGrowerMaster;
  relatedGrowers: IGrowerMaster[] = [];
  relatedGrowersObservable: Observable<IGrowerMaster[]>;
  relatedVendorGrowers: IGrowerMaster[] = [];
  relatedLoaded: boolean = false;
  relatedVendorLoaded: boolean = false;
  vendorList: IVwApvendorMaster[] = [];
  vendorName: string;
  growerRelationId = 0;

  relatedGrowerColumnDefs = [
    {headerName: 'Vendor #', field: 'vendorId', width: 100,  sortable: true, filter: true },
    {headerName: 'Grower #', width: 100, field: 'id',  sortable: true, filter: true },
    {headerName: 'Name', width: 200, field: 'farmName',  sortable: true, filter: true },
    {headerName: 'Actions', width: 120, cellRenderer: 'actionsTransactionRenderer', field: 'id',  sortable: false, filter: false }
  ];
  relatedVendorGrowerColumnDefs = [
    {headerName: 'Vendor #', field: 'vendorId', width: 100,  sortable: true, filter: true },
    {headerName: 'Grower #', width: 100, field: 'id',  sortable: true, filter: true },
    {headerName: 'Name', width: 100, field: 'farmName',  sortable: true, filter: true },
  ];
  private relatedGrowerGridApi;
  private relatedGrowerGridColumnApi;

  private relatedVendorGrowerGridApi;
  private relatedVendorGrowerGridColumnApi;

  modules = AllModules;

  public frameworkComponents = {
    actionsTransactionRenderer: RelatedGrowerActionsComponent
  };

  public destroyed = new Subject<any>();

  // form controls
  growerForm: FormGroup;


  // to add a new related grower
  newRelatedGrowerListLoaded: boolean = false;
  newRelatedGrowers: IGrowerMaster[] = [];
  newRelatedGrowerModal: boolean = false;
  addNewRelatedGrowerColumns = [
    {
      headerName: 'Vendor #',
      field: 'vendorId',
      width: 120,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['startsWith', 'contains'],

        debounceMs: 0,
        caseSensitive: false,

      }
    },
    {
      headerName: 'Grower #',
      width: 120,
      field: 'id',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['startsWith', 'contains'],

        debounceMs: 0,
        caseSensitive: false,

      }
    },
    {
      headerName: 'Name',
      width: 180,
      field: 'farmName',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,

      }
    },
    {
      headerName: 'Address',
      width: 180,
      field: 'farmAddress1',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {

        debounceMs: 0,
        caseSensitive: false,

      }
    },
  ];
  private addNewRelatedVendorGrowerGridApi;
  private addNewRelatedVendorGrowerGridColumnApi;
  selectedAddRelatedGrower: IGrowerMaster;

  constructor(
    private messageService: MessageService,
    private _growerService: EditGrowerMasterService,
    private _growerListService: GrowerMasterListService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
     private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.sharedInit();

    this._router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.sharedInit();
    });


  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public sharedInit() {
    // this.cdr.detectChanges();
    // re-init some vars
    this.dropdownsLoaded = false;
    this.postSubmitted = false;
    this.loadVendorList();
    this.formLoaded = false;
    this.growerModel = null;
    this.relatedGrowers = [];
    this.relatedVendorGrowers = [];
    this.relatedLoaded = false;
    // set width
    this.innerWidth = window.innerWidth;

    // parse the url
    this._route.queryParams.subscribe(params => {
      this.farmId = params['Id'] as number;
    });
    this.farmId = parseInt(this.farmId.toString(), 10);

    // check if adding a misc grower or not
    if (this.farmId.toString() === '0') {
      this.pageTitle = 'Add Miscellaneous Grower';
      this.buildGrowerForm(null);
    } else {

      // this.buildGrowerForm(null);

      this.loadGrowerMaster(this.farmId);


    }


  }

  // tslint:disable-next-line:use-life-cycle-interface


  private loadGrowerMaster(id: number) {
    this._growerService
    .getGrowerMaster(id)
    .subscribe(
      data => {
        try {
          this.growerModel = data;

          // if group code is null, update it to vendor?
          if (!!!this.growerModel.groupCode) {
            this.growerModel.groupCode = this.growerModel.vendorId.toString();
          }

          // fetch the related growers (non vendor)
          this.getNewRelatedGrowers(this.growerModel.groupCode);

          // mark the vendor
          this.vendorName = this.vendorList.find(v => v.vnumb.toString() === data.vendorId.toString()).vname.trim();

          // build the form
          this.buildGrowerForm(data);
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this.errorToast(error);
      }
    );
  }

  private loadVendorList() {
    // since the call takes 10 seconds, we just cached it on app init and retrieve it from there
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];

    this.dropdownsLoaded = true;

  }

  /** Get the related growers by the group code */
  private getNewRelatedGrowers(id: string) {
    this._growerService
    .getGrowerRelationsByGroupCode(id)
    .subscribe(
      related => {
        // get the vendor growers first
        this.relatedVendorGrowers = related.filter(r => r.groupCode.toString().trim() === r.vendorId.toString() && r.id.toString() !== this.farmId.toString());
        this.relatedVendorLoaded = true;

        // then get the non vendor related growers
        this.relatedGrowers = related.filter(r => r.groupCode.toString().trim() !== r.vendorId.toString() && r.id.toString() !== this.farmId.toString());
        this.relatedLoaded = true;

        this.loadGrowersForRelation();
      }, error => {
        console.error(error);
        this.errorToast(error);
      });
  }

  /** load a list of unrelated growers */
  private loadGrowersForRelation() {
    // newRelatedGrowers
    this._growerListService
    .getGrowers(false)
    .subscribe(
      growers => {

        // filter out already used growers

        this.newRelatedGrowers = growers.filter(g =>
            this.farmId.toString() !== g.id.toString() // remove self
            && this.relatedVendorGrowers.findIndex(rg => rg.id === g.id) === -1 // filter vendor growers
            && this.relatedGrowers.findIndex(rg => rg.id === g.id) === -1 // filter non vendor growers
          );

        this.newRelatedGrowerListLoaded = true;
      }, error => {
        console.error(error);
        this.errorToast(error);
      });
  }

  /** save the selected grower to add a relationship for */
  onSelectionChanged() {
    const selectedRows = this.addNewRelatedVendorGrowerGridApi.getSelectedRows();
    this.selectedAddRelatedGrower = selectedRows[0];

  }

  onVendorChange(event: any) {
    const val = this.growerForm.value.VendorId;
    const match = this.vendorList.find(v => v.vnumb.toString() === val.toString());
    this.vendorName = !!match ? match.vname.trim() : 'INVALID';
  }

  /** add a new related grower */
  submitAddRelatedGrower() {
    this._growerService.postGrowerRelation(this.farmId, this.selectedAddRelatedGrower.id).subscribe(
      result => {
        // now we update our list of related growers
        const templist = [];
        templist.push(this.selectedAddRelatedGrower);
        this.relatedGrowerGridApi.updateRowData({ add: templist});
        this.relatedGrowers.push(this.selectedAddRelatedGrower);

        // remove from the pool
        this.newRelatedGrowers.splice(this.newRelatedGrowers.indexOf(this.selectedAddRelatedGrower), 1);
        this.addNewRelatedVendorGrowerGridApi.updateRowData({ remove: templist});
        this.successToast('You have successfully added the new related grower');
        this.newRelatedGrowerModal = false;

        // reset the selected grower
        this.selectedAddRelatedGrower = null;
      }, error => {
        console.error(error);
        this.errorToast(error);
      });

  }

  /** fill the grower form with the grower master data */
  private buildGrowerForm(grower: IGrowerMaster) {
    const isAdd = !!!grower;
    const isDisabled = !!grower && grower.farmType !== 3;
    this.growerForm = this._formBuilder.group({
      Owner: new FormControl({
        value: isAdd ? '' : grower.farmName,
        disabled: isDisabled,
      }, [ Validators.required]),
      Address1: new FormControl({
        value: isAdd ? '' : grower.farmAddress1,
        disabled: isDisabled,
      }, [ Validators.required]),
      Address2: new FormControl({
        value: isAdd ? '' :  grower.farmAddress2,
        disabled: isDisabled,
      }),
      City: new FormControl({
        value: isAdd ? '' : '', // ! missing
        disabled: isDisabled,
      }),
      Zip: new FormControl({
        value: isAdd ? '' : '', // ! missing
        disabled: isDisabled,
      }),
      Phone: new FormControl({
        value: isAdd ? '' : grower.phone,
        disabled: isDisabled,
      }),
      CellPhone: new FormControl({
        value: isAdd ? '' : grower.cellPhone,
        disabled: isDisabled,
      }),
      Email: new FormControl({
        value: isAdd ? '' : grower.email,
        disabled: isDisabled,
      }),
      VendorId: new FormControl({
        value: isAdd ? '' :  grower.vendorId, // ! should we have a vendor list
        disabled: isDisabled,
      }, [ Validators.required]),
      Comments: new FormControl({
        value: isAdd ? '' :  grower.growerComment,
      })

    });

    // todo - figure out why setting value above doesn't work, but patch value does
    this.growerForm.patchValue({ Owner: isAdd ? '' : grower.farmName });
    this.growerForm.patchValue({ Address1: isAdd ? '' : grower.farmAddress1 });
    this.growerForm.patchValue({ Address2: isAdd ? '' : grower.farmAddress2 });
    this.growerForm.patchValue({ City: '' });
    this.growerForm.patchValue({ Zip: ''});
    this.growerForm.patchValue({ Phone: isAdd ? '' : grower.phone });
    this.growerForm.patchValue({ CellPhone: isAdd ? '' : grower.cellPhone });
    this.growerForm.patchValue({ Email: isAdd ? '' : grower.email });
    this.growerForm.patchValue({ VendorId: isAdd ? '' : grower.vendorId });
    this.growerForm.patchValue({ Comments: isAdd ? '' : grower.growerComment });

    // toggle require validation
    this.growerForm.get('Owner').markAsTouched();
    this.growerForm.get('Address1').markAsTouched();
    this.growerForm.get('VendorId').markAsTouched();

    this.formLoaded = true;
  }

  public backToHome() {
    this._router.navigateByUrl(
      'GrowerMasterListComponent'
    );
    return;
  }

  public archiveGrower() {
    this.growerModel.status = 'Inactive';
    this.growerModel.groupCode = null;
    this.archiveGrowerModal = false;
    this._growerService
    .postGrowerMaster(this.growerModel)
    .subscribe(
      data => {
        try {
          console.error(data);
          if (data.statusCode === 200) {
            this.successToast('You have successfully archived grower ' + this.growerModel.id);

              setTimeout( () => {

                this.backToHome();
              }, 1500 );

          }
          // this.growerModel = data;
          // this.buildGrowerForm(data);
        } catch (e) {
          console.error(e);
          this.postSubmitted = false;
        }
      },
      error => {
        this.postSubmitted = false;
        console.error(error);
        this.errorToast(error);
      }
    );

  }

  public reactivateGrower() {
    this.growerModel.status = 'Active';
    this._growerService
    .postGrowerMaster(this.growerModel)
    .subscribe(
      data => {
        try {
          if (data.statusCode === 200) {
            this.successToast('You have successfully reactivated grower ' + this.growerModel.id);

              setTimeout( () => {

                this.backToHome();
              }, 1500 );

          }
          // this.growerModel = data;
          // this.buildGrowerForm(data);
        } catch (e) {
          console.error(e);
          this.postSubmitted = false;
        }
      },
      error => {
        this.postSubmitted = false;
        console.error(error);
        this.errorToast(error);
      }
    );

  }

  /** submit handler for the grower form */
  public submitGrower() {
    this.postSubmitted = true;
    const val = this.growerForm.value;
    // if an add have to do a few init things
    if (this.farmId === 0) {
      this.growerModel = {} as IGrowerMaster;
      this.growerModel.id = this.farmId;
      this.growerModel.farmType = 3;
      this.growerModel.groupCode = val.VendorId.toString();
      this.growerModel.status = 'Active';
    }

    if (this.growerModel.farmType !== 3) {
      this.growerModel.growerComment = val.Comments;
    } else {
      this.growerModel.farmName = val.Owner;
      this.growerModel.farmAddress1 = val.Address1;
      this.growerModel.farmAddress2 = val.Address2;
      // this.growerModel.City = val.City;
      // this.growerModel.Zip = val.Zip;
      this.growerModel.phone = val.Phone;
      this.growerModel.cellPhone = val.CellPhone;
      this.growerModel.email = val.Email;
      this.growerModel.vendorId = parseInt(val.VendorId.toString(), 10);
      this.growerModel.growerComment = val.Comments;
    }

    // submit to the server
    this._growerService
    .postGrowerMaster(this.growerModel)
    .subscribe(
      data => {
        try {
          if (data.statusCode === 200) {
            this.successToast('Grower has successfully been updated');
            if (this.farmId.toString() === '0') {

              // parse the id out-  data.data
              // New grower id: 100005 New grower account id: 25
              const result = data.data;

              setTimeout( () => {
                this.postSubmitted = false;
                this._router.navigateByUrl(
                  'EditGrowerMasterComponent?Id=' + (parseInt(result.split(' ')[3], 10))
                );
              }, 1500 );
            }
          }
          // this.growerModel = data;
          // this.buildGrowerForm(data);
        } catch (e) {
          console.error(e);
          this.postSubmitted = false;
        }
      },
      error => {
        this.postSubmitted = false;
        console.error(error);
        this.errorToast(error);
      }
    );
  }

  /***************************************************
   * Modals/Dialogs
   **************************************************/

  /** Show a toast popup for an error message */
  private errorToast(error: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error
    });
  }

  /** Show a toast popup for a success message */
  private successToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: msg
    });
  }
  /** Show a toast popup for an info message */
  private infoToast(msg: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: msg
    });
  }


  /***************************************************
   * Misc utils
   **************************************************/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  /** null safe toLower */
  private toLowerNullable(value: string) {
    return value != null ? value.toLowerCase() : '';
  }

  onRelatedGrowerGridReady(params) {
    this.relatedGrowerGridApi = params.api;
    this.relatedGrowerGridColumnApi = params.columnApi;
    // resize the cols
    this.relatedGrowerGridApi.sizeColumnsToFit();
    // this.relatedGrowerGridApi.setRowData([]);
  }

  onRelatedVendorGrowerGridReady(params) {
    this.relatedVendorGrowerGridApi = params.api;
    this.relatedVendorGrowerGridColumnApi = params.columnApi;
    // resize the cols
    this.relatedVendorGrowerGridApi.sizeColumnsToFit();
    // this.relatedGrowerGridApi.setRowData([]);
  }

  onAddNewRelatedGrowerColumns(params) {
    this.addNewRelatedVendorGrowerGridApi = params.api;
    this.addNewRelatedVendorGrowerGridColumnApi = params.columnApi;
    // resize the cols
    this.addNewRelatedVendorGrowerGridApi.sizeColumnsToFit();
    // this.relatedGrowerGridApi.setRowData([]);
  }

}
