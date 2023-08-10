import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {State} from "../../interface/state";
import {CustomHttpResponse, Page} from "../../interface/appstates";
import {UserService} from "../../service/user.service";
import {CustomerService} from "../../service/customer.service";
import {DataState} from "../../enum/datastate.enum";
import {User} from "../../interface/user";
import {Customer} from "../../interface/customer";
import {Router} from "@angular/router";
import {HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from "@angular/common/http";
import {saveAs} from 'file-saver'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  homeState$: Observable<State<CustomHttpResponse<Page<Customer> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(true);
  showLogs$ = this.showLogsSubject.asObservable();
  private fileStatusSubject = new BehaviorSubject<{ status: string, type: string, percent: number }>(undefined);
  fileStatus$ = this.fileStatusSubject.asObservable();
  readonly DataState = DataState;

  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();


  constructor(private userService: UserService,
              private customerService: CustomerService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.homeState$ = this.customerService.customers$()
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
    this.homeState$ = this.customerService.customers$(pageNumber)
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

    this.goToPage(direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);

  }

  report(): void {
    this.homeState$ = this.customerService.downloadReport$()
      .pipe(
        map(response => {
          console.log(response);
          this.reportProgress(response);
          return {dataState: DataState.LOADED, appData: this.dataSubject.value};
        }),
        startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR, error, appData: this.dataSubject.value})
        })
      )
  }

  private reportProgress(httpEvent: HttpEvent<Blob | string [] & number>): void {

    switch (httpEvent.type) {
      case HttpEventType.DownloadProgress :
        this.fileStatusSubject.next({
          status: 'progress',
          type: "Downloading...",
          percent: Math.round(100 * httpEvent.loaded / httpEvent.total)
        })
        break;

      case HttpEventType.ResponseHeader :
        console.log("Headers retrieved {}", httpEvent);
        break;

      case HttpEventType.Response:
        saveAs(
          new File(
            [<Blob>httpEvent.body],
            httpEvent.headers.get("File-Name"),
            {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}))
        this.fileStatusSubject.next(undefined)
        break;

      default:
        console.log(httpEvent);
        break;
    }
  }
}
