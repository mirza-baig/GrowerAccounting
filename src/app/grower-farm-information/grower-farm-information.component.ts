import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-grower-farm-information',
  templateUrl: './grower-farm-information.component.html',
  styleUrls: ['./grower-farm-information.component.css']
})
export class GrowerFarmInformationComponent implements OnInit {

  public loadingAccount = false;
  public innerWidth: number;
  public innerHeight: number;
  public growerId: number;
  pageTitle = 'Farm Information';

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this._route.queryParams.subscribe(params => {
      this.growerId = params['Id'] as number;
    });
  }

  /***************************************************
   * Misc utils
   **************************************************/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

}
