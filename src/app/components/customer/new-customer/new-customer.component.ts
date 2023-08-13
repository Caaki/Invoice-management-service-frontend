import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {State} from "../../../interface/state";
import {CustomHttpResponse, Page, Profile} from "../../../interface/appstates";
import {User} from "../../../interface/user";
import {CustomerService} from "../../../service/customer.service";
import {DataState} from "../../../enum/datastate.enum";
import {UserService} from "../../../service/user.service";
import {NgForm} from "@angular/forms";
import {NotificationService} from "../../../service/notification.service";


@Component({
  selector: 'app-new-customer-detail',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCustomerComponent implements OnInit {

  newCustomerState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;




  constructor(private notificationService:NotificationService,private customerService: CustomerService, private userService:UserService) {
  }

  ngOnInit(): void {

    this.newCustomerState$ = this.userService.profile$()
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

  createCustomer(newCustomerForm: NgForm): void {
  this.isLoadingSubject.next(true);
    this.newCustomerState$ = this.customerService.newCustomers$(newCustomerForm.value)
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          //console.log(response);
          newCustomerForm.reset({type:'INDIVIDUAL', status: 'ACTIVE'})
          this.isLoadingSubject.next(false);
          return {dataState: DataState.LOADED, appData: this.dataSubject.value};
        }),
        startWith({dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notificationService.onDefault(error);
          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED, error})

        })
      )
  }


}
