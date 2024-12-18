import { Component, OnInit, HostListener } from '@angular/core';
import { IWorkflowContact } from 'src/app/models/workflow-contact.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { WorkflowContactActionsComponent } from './workflow-contact-actions/workflow-contact-actions.component';
import { WorkflowContactManagementService } from './workflow-contact-management.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Router } from '@angular/router';
import { UserManagementService } from 'src/app/user-management/user-management.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ICurrentUser } from 'src/app/user-management/current-user.interface';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-workflow-contact-management',
  templateUrl: './workflow-contact-management.component.html',
  styleUrls: ['./workflow-contact-management.component.css']
})
export class WorkflowContactManagementComponent implements OnInit {
  pageTitle = 'Invoice Workflow Approvers';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;

  // contact list
  contacts: IWorkflowContact[] = [];
  contactsLoaded: boolean = false;
  columnDefs = [
    {
      headerName: 'Name',
      field: 'firstName',
      width: 350,
      sortable: true,
      valueFormatter: function (params) {
        return params.data.firstName + ' ' + params.data.lastName;
      },
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Approval Step',
      field: 'stage',
      width: 250,
      sortable: true,
      filter: true,
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 450,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Status',
      field: 'isActive',
      width: 300,
      sortable: true,
      filter: true,
      valueFormatter: function (params) {
        const val = params.value as boolean;
        return val ? 'Default Approver' : 'Backup Approver';
      },
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: 'actionsRenderer',
      field: 'id',
      width: 300,
      sortable: false,
      filter: false
    }
  ];
  modules = AllModules;
  public frameworkComponents = {
    actionsRenderer: WorkflowContactActionsComponent,
  };
  public gridApi;
  public gridColumnApi;

  // new approvers
  public newApproverModal;
  public newApproverForm: FormGroup;
  public selectedApprover: ICurrentUser;
  public userList: ICurrentUser[] = [];
  public filteredUserList: Observable<ICurrentUser[]>;

  constructor(
    private messageService: ToastService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _contactService: WorkflowContactManagementService,
    private _userService: UserManagementService,
  ) { }

  ngOnInit() {
    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // build the approver form
    this.newApproverForm = this._formBuilder.group({
      Name: new FormControl({
        value: '',
      }, [ Validators.required]),
      Stage: new FormControl({
        value: '',
      }, [ Validators.required]),
      IsDefault: new FormControl({
        value: '',
      }),
    });

    this.filteredUserList = this.newApproverForm.valueChanges.pipe(
      startWith(''),
      map(() =>
        this.filterUsers(this.newApproverForm.controls['Name'].value)
      )
    );

    this.newApproverForm.patchValue({ Name : '', Stage: '', IsDefault: '' });

    this.loadADUsers();
  }

   /** filter the user list for the autocomplete */
   private filterUsers(value: Object): ICurrentUser[] {
    if (value != null) {
      const list = this.userList.filter(user =>
        this.toLowerNullable(user.firstName + ' ' + user.lastName).includes(
          this.toLowerNullable(value.toString())
        )
      );
      if (list.length === 1) {
        this.selectedApprover = list[0];
      }
      return list;
    }
  }

  /** event for autocomplete open for the user */
  public userAutocompleteOpen() {
    this.selectedApprover = null;
  }

  /** reset for selecting a user */
  public selectAnotherUser() {
    this.selectedApprover = null;
  }

  /** Confirming the selected vendor */
  public confirmUserSelection() {
    // if (!!this.selectedApprover) {
    //   this._messageService.infoToast('You have selected vendor #' + this.selectedApprover.firstName + ' - ' + this.selectedVendor.vname);
    //   this.isVendorSelected = true;
    // } else {
    //   this._messageService.errorToast('You must select a valid vendor!');
    // }
  }

  public userAutocompleteSelected(event: any) {
    const val = this.newApproverForm.value.Name;
    const match = this.userList.find(u => (u.firstName + ' ' + u.lastName) === val.toString());
    this.selectedApprover = match;
  }

  /** pull in the users */
  private loadADUsers() {
    // first load AD (not in user management)
    this._userService.getActiveDirectoryUsers().subscribe(
      adResult => {
        this.userList = adResult;

        // then load from user management
        this._userService.getUserManagementUsers().subscribe(
          umResult => {
            this.userList = this.userList.concat(umResult);
            // load the contacts
            this.loadContacts();
          }, error => {
            console.error(error);
            this.messageService.errorToast(error);
          }
        );

      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }

  public submitApprover() {
    const vals = this.newApproverForm.value;
    const newApprover = {
      email: this.selectedApprover.email,
      firstName: this.selectedApprover.firstName,
      lastName: this.selectedApprover.lastName,
      id: 0,
      isActive: false,
      stage: vals.Stage
    } as IWorkflowContact;

    if (this.contacts.findIndex(c => c.email === newApprover.email && c.stage === newApprover.stage) !== -1) {
      this.messageService.errorToast('The specified approver already exists for that stage!');
    } else {
      this._contactService.postWorkflowContact(newApprover).subscribe(
        result => {
          this.messageService.successToast('You have successfully added ' + newApprover.firstName + ' ' + newApprover.lastName + ' to the list of approvers');
          this.newApproverForm.patchValue({ Name: '', Stage: ''});
          this.loadContacts();
        }, error => {
          console.error(error);
          this.messageService.errorToast(error);
        }
      );
    }


  }

  private loadContacts() {
    this._contactService.getWorkflowContacts().subscribe(
      result => {
        this.contacts = result.map(c => {
          // c.firstName = c.firstName + ' ' + c.lastName;
          return c;
        });
        this.contactsLoaded = true;
      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }


  /***************************************************
   * Misc utils
   **************************************************/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();

    const sort = [
      {
        colId: 'stage',
        sort: 'desc'
      }
    ];

    // todo - should we pre filter status?
    this.gridApi.setSortModel(sort);
  }

  public onCellValueChange(event: any) {
    this.loadContacts();
  }

  /** null safe toLower */
  private toLowerNullable(value: string) {
    return value != null ? value.toLowerCase() : '';
  }

}
