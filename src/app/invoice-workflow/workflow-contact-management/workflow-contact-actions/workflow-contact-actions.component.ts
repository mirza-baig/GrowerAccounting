import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { WorkflowContactManagementService } from '../workflow-contact-management.service';
import { IWorkflowContact } from 'src/app/models/workflow-contact.interface';

@Component({
  selector: 'app-workflow-contact-actions',
  templateUrl: './workflow-contact-actions.component.html',
  styleUrls: ['./workflow-contact-actions.component.css']
})
export class WorkflowContactActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public contact: IWorkflowContact;
  public lockSettlements: boolean = true;

  constructor(
    private _router: Router,
    private messageService: ToastService,
    private _contactService: WorkflowContactManagementService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model
    this.contact = params.data;
  }

  public markAsActive() {
    // promote the current contact to active
    // find the currently active one and demote
    // update the grid
    this.contact.isActive = true;
    this.params.data.isActive = true;

    this._contactService.activateApproverForStage(this.contact.id).subscribe(
      () => {
        const updateList = [];
        updateList.push(this.params.data);
        this.params.api.updateRowData({ update: updateList });
        // tslint:disable-next-line:max-line-length
        this.messageService.successToast('You have successfully marked ' + this.contact.firstName + ' ' + this.contact.lastName + ' as the default contact for ' + this.contact.stage);
      }, error => {
        console.error(error);
      }
    );
  }


  refresh(): boolean {
      return false;
  }


}
