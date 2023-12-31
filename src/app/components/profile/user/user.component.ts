import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {CustomHttpResponse, Profile} from "../../../interface/appstates";
import {UserService} from "../../../service/user.service";
import {NgForm} from "@angular/forms";
import {DataState} from "../../../enum/datastate.enum";
import {State} from "../../../interface/state";
import {EventType} from "../../../enum/event-type.enum";
import {NotificationService} from "../../../service/notification.service";

@Component({
  selector: 'app-profile',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit{

  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>| null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(true);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;



  constructor(private notificationService: NotificationService,private userService:UserService) {}

  ngOnInit(): void {

      this.profileState$ = this.userService.profile$()
        .pipe(
          map(response =>{
              this.dataSubject.next(response);
              return {dataState: DataState.LOADED,appData: response};
          }),
          startWith({dataState: DataState.LOADING}),
          catchError((error: string)=>{
            return of({dataState:DataState.ERROR, addData: this.dataSubject.value, error})
          })
        )
  }

  updateProfile(profileForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.update$(profileForm.value)
      .pipe(
        map(response =>{
          this.notificationService.onDefault(response.message);
          this.dataSubject.next({...response, data: response.data});
          this.isLoadingSubject.next(false);
          return {dataState: DataState.LOADED,appData: this.dataSubject.value};
        }),
        startWith({dataState: DataState.LOADED,appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.notificationService.onError(error);
          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED,appData: this.dataSubject.value, error})
        })
      )
  }


  updatePassword(passwordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    if (passwordForm.value.newPassword === passwordForm.value.confirmNewPassword){
      this.profileState$ = this.userService.updatePassword$(passwordForm.value)
        .pipe(
          map(response =>{
            this.notificationService.onDefault(response.message);
            this.dataSubject.next({...response, data: response.data});
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return {dataState: DataState.LOADED,appData: this.dataSubject.value};
          }),
          startWith({dataState: DataState.LOADED,appData: this.dataSubject.value}),
          catchError((error: string)=>{
            this.notificationService.onError(error);
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return of({dataState: DataState.LOADED,appData: this.dataSubject.value, error})
          })
        )
    }else {
      passwordForm.reset();
      this.notificationService.onError("Passwords do not match!");
      this.isLoadingSubject.next(false);
    }
  }


  updateUserRole(roleForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateUserRole$(roleForm.value)
      .pipe(
        map(response =>{
          this.notificationService.onDefault(response.message);
          this.dataSubject.next({...response, data: response.data});
          this.isLoadingSubject.next(false);
          return {dataState: DataState.LOADED,appData: this.dataSubject.value};
        }),
        startWith({dataState: DataState.LOADED,appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.notificationService.onError(error);
          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED,appData: this.dataSubject.value, error})
        })
      )
  }


  updateAccountSettings(settingsForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateAccountSettings$(settingsForm.value)
      .pipe(
        map(response =>{
          this.notificationService.onDefault(response.message);
          this.dataSubject.next({...response, data: response.data});
          this.isLoadingSubject.next(false);
          return {dataState: DataState.LOADED,appData: this.dataSubject.value};
        }),
        startWith({dataState: DataState.LOADED,appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.notificationService.onError(error);
          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED,appData: this.dataSubject.value, error})
        })
      )
  }


  toggleMfa(): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.toggleMfa$()
      .pipe(
        map(response =>{
          this.notificationService.onDefault(response.message);
          this.dataSubject.next({...response, data: response.data});
          this.isLoadingSubject.next(false);
          return {dataState: DataState.LOADED,appData: this.dataSubject.value};
        }),
        startWith({dataState: DataState.LOADED,appData: this.dataSubject.value}),
        catchError((error: string)=>{
          this.notificationService.onError(error);
          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED,appData: this.dataSubject.value, error})
        })
      )
  }

  updateImage(image: File): void {
    if (image){
      this.isLoadingSubject.next(true);
      this.profileState$ = this.userService.updateImage$(this.getFormData(image))
        .pipe(
          map(response =>{
            this.notificationService.onDefault(response.message);
            this.dataSubject.next(
              {...response,
                data: {...response.data,
                  user: {...response.data.user,
                    imageUrl:`${response.data.user.imageUrl}?time=${new Date().getTime()}`}}});
            this.isLoadingSubject.next(false);
            return {dataState: DataState.LOADED,appData: this.dataSubject.value};
          }),
          startWith({dataState: DataState.LOADED,appData: this.dataSubject.value}),
          catchError((error: string)=>{
            this.notificationService.onDefault(error);
            this.isLoadingSubject.next(false);
            return of({dataState: DataState.LOADED,appData: this.dataSubject.value, error})
          })
        )
    }
  }

  toggleLogs(): void {
    this.showLogsSubject.next(!this.showLogsSubject.value);
  }

  private getFormData(image: File): FormData {
    const formData = new FormData();
    formData.append('image',image);
    return formData;
  }
}
