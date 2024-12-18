import { Component, OnInit } from '@angular/core';
import { IAccountVM } from '../models/account-vm.interface';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { GrowerAccountTransferService } from './grower-account-transfer.service';
import { MessageService } from 'primeng/api';
import { DropdownService } from '../shared/dropdown.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGrowerVM } from '../models/grower-vm.interface';

@Component({
  selector: 'app-grower-account-transfer',
  templateUrl: './grower-account-transfer.component.html',
  styleUrls: ['./grower-account-transfer.component.css']
})
export class GrowerAccountTransferComponent implements OnInit {
  pageTitle = 'Add Transaction';
  moduleTitle = 'Transactions';
  innerWidth: any;

  // url params
  fromId: number;
  toId: number;

  // more grower info
  fromGrower: IGrowerVM;
  toGrower: IGrowerVM;
  fromAccountBalance: number;

  // Dropdowns
  dropdownsLoaded: boolean = false;
  fromAccountList: IAccountVM[] = [];
  toAccountList: IAccountVM[] = [];

  transferForm: FormGroup;
  formLoaded: boolean = false;

  constructor(
    private messageService: MessageService,
    private _transferService: GrowerAccountTransferService,
    private _dropdownService: DropdownService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;

    // parse the URL?
    this._route.queryParams.subscribe(params => {
      this.fromId = params['fromId'];
      this.toId = params['toId'];
    });

    this.buildTransferForm();
  }

  private buildTransferForm() {
    this.transferForm = this._formBuilder.group({
      FromAccount: new FormControl({
        value: ''
      }),
      ToAccount: new FormControl({
        value: ''
      }),
      Date: new FormControl({
        value: ''
      }),
      Description: new FormControl({
        value: ''
      }),
      Amount: new FormControl({
        value: ''
      }),
    });
    this.formLoaded = true;
    this.dropdownsLoaded = true;
  }

  public onDateChange(event: any) {

  }
}
