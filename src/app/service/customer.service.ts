import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {CustomHttpResponse, Page} from "../interface/appstates";
import {User} from "../interface/user";
import {Statistics} from "../interface/statistics";
import {Customer} from "../interface/customer";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  private jwtHelper = new JwtHelperService();
  private readonly server: string = 'http://192.168.1.44:8080';


  constructor(private http: HttpClient) {
  }

  customers$ = (page: number =0) => <Observable<CustomHttpResponse<Page & User & Statistics>>>
    this.http.get<CustomHttpResponse<Page & User & Statistics>>
    (`${this.server}/customer/list?page=${page}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  newCustomers$ = (customer: Customer) => <Observable<CustomHttpResponse<Customer & User>>>
    this.http.post<CustomHttpResponse<Page & User & Statistics>>
    (`${this.server}/customer/create`, customer)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );


  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
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

