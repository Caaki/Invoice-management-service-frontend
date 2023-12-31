import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {State} from "../../../interface/state";
import {CustomerState, CustomHttpResponse} from "../../../interface/appstates";
import {DataState} from "../../../enum/datastate.enum";
import {NgForm} from "@angular/forms";
import {CustomerService} from "../../../service/customer.service";
import {UserService} from "../../../service/user.service";
import {Customer} from "../../../interface/customer";
import {User} from "../../../interface/user";
import {NotificationService} from "../../../service/notification.service";
@Component({
  selector: 'app-newinvoice',
  templateUrl: './newinvoice.component.html',
  styleUrls: ['./newinvoice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewinvoiceComponent {

  newInvoiceState$: Observable<State<CustomHttpResponse<User & Customer[]>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<User & Customer[]>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(private notificationService: NotificationService,private customerService: CustomerService, private userService:UserService) {
  }

  ngOnInit(): void {

    this.newInvoiceState$ = this.customerService.newInvoice$()
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


  newInvoice(newInvoiceForm : NgForm): void{
    this.dataSubject.next({...this.dataSubject.value, message: null});
    this.isLoadingSubject.next(true);
    this.newInvoiceState$ = this.customerService.createInvoice$(
      newInvoiceForm.value.customerId,
      newInvoiceForm.value)
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          newInvoiceForm.reset({status: 'PENDING'})
          this.isLoadingSubject.next(false);
          this.dataSubject.next(response);
          return {dataState: DataState.LOADED, appData: this.dataSubject.value};
        }),
        startWith({dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notificationService.onError(error);

          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED, error})

        })
      )
  }


}
