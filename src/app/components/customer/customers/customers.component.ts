import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {State} from "../../../interface/state";
import {CustomHttpResponse, Page} from "../../../interface/appstates";
import {User} from "../../../interface/user";
import {DataState} from "../../../enum/datastate.enum";
import {UserService} from "../../../service/user.service";
import {CustomerService} from "../../../service/customer.service";
import {Customer} from "../../../interface/customer";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent implements OnInit {

  customersState$: Observable<State<CustomHttpResponse<Page<Customer> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User>>(null);
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

    this.customersState$ = this.customerService.searchCustomers$()
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

  searchCustomers(searchForm: NgForm) : void {
    this.currentPageSubject.next(0);
    this.customersState$ = this.customerService.searchCustomers$(searchForm.value.name)
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          return {dataState: DataState.LOADED, appData: response};
        }),
        startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR, error})
        })
      )

  }

  goToPage(pageNumber?: number, name?: string): void {
    this.customersState$ = this.customerService.searchCustomers$(name, pageNumber)
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

  goToNextOrPreviousPage(direction?: string, name?: string): void {

    this.goToPage(
      direction === 'forward' ?
        this.currentPageSubject.value + 1 :
        this.currentPageSubject.value - 1, name);

  }

  // selectCustomer(id: string): void{
  //   this.router.navigate([`customers/${id}`])
  // }
}
