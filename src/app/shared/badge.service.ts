import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class BadgeService {

  private dataSource = new BehaviorSubject<number>(0);
  data = this.dataSource.asObservable();

  constructor() { }

  updatedData(data: number) {
    this.dataSource.next(data);
  }
}
