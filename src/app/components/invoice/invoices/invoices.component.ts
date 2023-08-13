import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {State} from "../../../interface/state";
import {CustomHttpResponse, Page} from "../../../interface/appstates";
import {User} from "../../../interface/user";
import {UserService} from "../../../service/user.service";
import {CustomerService} from "../../../service/customer.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {DataState} from "../../../enum/datastate.enum";
import {Invoice} from "../../../interface/invoice";

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent implements OnInit {

  invoicesState$: Observable<State<CustomHttpResponse<Page<Invoice> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Invoice> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(true);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;

  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();


  constructor(private userService: UserService,
              private customerService: CustomerService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.invoicesState$ = this.customerService.invoices$()
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          return {dataState: DataState.LOADED, appData: response};
        }),
        startWith({dataState: DataState.LOADING}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR, error})
        })
      )
  }


  goToPage(pageNumber?: number): void {
    this.invoicesState$ = this.customerService.invoices$(pageNumber)
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          this.currentPageSubject.next(pageNumber);
          return {dataState: DataState.LOADED, appData: response};
        }),
        startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR, error, appData: this.dataSubject.value})
        })
      )
  }

  goToNextOrPreviousPage(direction?: string): void {

    this.goToPage(
      direction === 'forward' ?
        this.currentPageSubject.value + 1 :
        this.currentPageSubject.value - 1);

  }


}
