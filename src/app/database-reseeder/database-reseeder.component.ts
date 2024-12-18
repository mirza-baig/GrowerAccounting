import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatabaseReseederService } from './database-reseeder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-database-reseeder',
  templateUrl: './database-reseeder.component.html',
  styleUrls: ['./database-reseeder.component.css']
})
export class DatabaseReseederComponent implements OnInit {
  pageTitle = 'Grower AR Database Reset';
  unlock: boolean = false;
  submitted: boolean = false;
  success: boolean = false;

  constructor(
    private messageService: MessageService,
    private resetService: DatabaseReseederService,
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  submit() {
    this.submitted = true;
    this.resetService.resetDataTables().subscribe(result => {
      // as is tradition we're going to to nested calls yet again
      if (result.statusCode === 200) {
        this.resetService.resetGrowerData().subscribe(result2 => {
          if (result2.statusCode === 200) {
            // result.data
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'You have successfully reset the Grower AR database tables. You will now be redirected to the main dashboard page',
          });

          setTimeout(() => {
            this._router.navigateByUrl('DashboardComponent');
          }, 5000);
          } else {
            this.resetError();
          }

        }, error => {
          console.error(error);
        });
      } else {
        this.resetError();
      }
    }, error => {
      console.error(error);
    });

  }

  private resetError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occured while tryign to reset the database tables. Please try again',
    });
    this.submitted = false;
  }

}
