import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient, HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {CustomerState, CustomHttpResponse, Page} from "../interface/appstates";
import {User} from "../interface/user";
import {Statistics} from "../interface/statistics";
import {Customer} from "../interface/customer";
import {Invoice} from "../interface/invoice";

@Injectable()
export class CustomerService {


  private jwtHelper = new JwtHelperService();
  private readonly server: string = 'http://192.168.1.44:8080';


  constructor(private http: HttpClient) {
  }

  customers$ = (page: number = 0) => <Observable<CustomHttpResponse<Page<Customer> & User & Statistics>>>
    this.http.get<CustomHttpResponse<Page<Customer> & User & Statistics>>
    (`${this.server}/customer/list?page=${page}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  customer$ = (customerId: number) => <Observable<CustomHttpResponse<CustomerState>>>
    this.http.get<CustomHttpResponse<CustomerState>>
    (`${this.server}/customer/get/${customerId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  update$ = (customer: Customer) => <Observable<CustomHttpResponse<CustomerState>>>
    this.http.put<CustomHttpResponse<CustomerState>>
    (`${this.server}/customer/update`, customer)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  searchCustomers$ = (name: string = "", page: number = 0) => <Observable<CustomHttpResponse<Page<Customer> & User>>>
    this.http.get<CustomHttpResponse<Page<Customer> & User>>
    (`${this.server}/customer/search?name=${name}&page=${page}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  newCustomers$ = (customer: Customer) => <Observable<CustomHttpResponse<User & Customer>>>
    this.http.post<CustomHttpResponse<User & Statistics>>
    (`${this.server}/customer/create`, customer)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  newInvoice$ = () => <Observable<CustomHttpResponse<User & Customer[]>>>
    this.http.get<CustomHttpResponse<User & Customer[]>>
    (`${this.server}/customer/invoice/new`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  createInvoice$ = (customerId: number, invoice: Invoice) => <Observable<CustomHttpResponse<User & Customer[]>>>
    this.http.post<CustomHttpResponse<User & Customer[]>>
    (`${this.server}/customer/invoice/addtocustomer/${customerId}`, invoice)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  invoices$ = ( page: number = 0) => <Observable<CustomHttpResponse<Page<Invoice> & User>>>
    this.http.get<CustomHttpResponse<Page<Invoice> & User>>
    (`${this.server}/customer/invoice/list?page=${page}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  invoice$ = (invoiceId: string) => <Observable<CustomHttpResponse<Customer & Invoice & User>>>
    this.http.get<CustomHttpResponse<Customer & Invoice & User>>
    (`${this.server}/customer/invoice/get/${invoiceId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  downloadReport$ = () => <Observable<HttpEvent<Blob>>>
    this.http.get(`${this.server}/customer/download/report`,
      {reportProgress: true, observe:'events', responseType:'blob'})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  handleError(error: HttpErrorResponse): Observable<never> {
    //console.log(error)
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`
      }
    }
    return throwError(() => errorMessage);
  }


}

