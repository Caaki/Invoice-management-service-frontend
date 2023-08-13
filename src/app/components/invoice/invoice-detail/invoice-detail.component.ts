import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {State} from "../../../interface/state";
import {CustomerState, CustomHttpResponse, Page} from "../../../interface/appstates";
import {Invoice} from "../../../interface/invoice";
import {User} from "../../../interface/user";
import {UserService} from "../../../service/user.service";
import {CustomerService} from "../../../service/customer.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {DataState} from "../../../enum/datastate.enum";
import {Customer} from "../../../interface/customer";
import {jsPDF as pdf} from 'jspdf';
import {NotificationService} from "../../../service/notification.service";


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailComponent implements OnInit {

  invoiceState$: Observable<State<CustomHttpResponse<Customer & User & Invoice>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Customer & User & Invoice>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;



  constructor(private notificationService: NotificationService,private userService: UserService,
              private customerService: CustomerService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.invoiceState$= this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) =>{
        return this.customerService.invoice$(params.get("id"))
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
  exportAsPDF(): void{
    this.notificationService.onDefault("Exporting pdf");

    const filename = `invoice-${this.dataSubject.value.data['invoice'].invoiceNumber}.pdf`;
    const doc = new pdf();
    doc.html(document.getElementById('invoice'), {
      margin: 5,
      windowWidth:1000,
      width : 200,
      callback :(invoice) => invoice.save(filename)});

  }


}
