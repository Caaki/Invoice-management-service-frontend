import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {State} from "../../../interface/state";
import {CustomerState, CustomHttpResponse} from "../../../interface/appstates";
import {UserService} from "../../../service/user.service";
import {CustomerService} from "../../../service/customer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataState} from "../../../enum/datastate.enum";
import { ParamMap } from '@angular/router';
import {NgForm} from "@angular/forms";
import {NotificationService} from "../../../service/notification.service";

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailComponent implements OnInit {

  customerState$: Observable<State<CustomHttpResponse<CustomerState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<CustomerState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;



  constructor(private notificationService: NotificationService
              ,private userService: UserService,
              private customerService: CustomerService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.customerState$= this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) =>{
        return this.customerService.customer$(+params.get("id"))
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
    })
    );
  }

  updateCustomer(customerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.customerState$ = this.customerService.update$(customerForm.value)
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          //console.log(response);
          this.dataSubject.next({ ...response,
            data: { ...response.data,
              customer: { ...response.data.customer,
                invoices: this.dataSubject.value.data.customer.invoices }}});

          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notificationService.onError(error);
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

}
