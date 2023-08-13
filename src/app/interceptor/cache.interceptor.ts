import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';
import {HttpCacheService} from "../service/http-cache.service";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  private readonly allowedPaths = [
    'http://192.168.1.44:8080/user/login',
    'http://192.168.1.44:8080/register',
    'http://192.168.1.44:8080/user/verify/code',
    'http://192.168.1.44:8080/user/verify/password',
    'http://192.168.1.44:8080/user/resetpassword',
    'http://192.168.1.44:8080/user/verify/account',
    'http://192.168.1.44:8080/user/refresh/token',
    'http://192.168.1.44:8080/user/new/password'
  ];
  constructor(private httpCache: HttpCacheService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>>{
    const isAllowedPath = this.allowedPaths.some((path) =>
      request.url.includes(path));
    if (isAllowedPath){
      return next.handle(request);

    }else if (request.method !== 'GET' || request.url.includes("download")){
      this.httpCache.evictAll();
      return next.handle(request);
    } else{
      const cachedResponse: HttpResponse<any> = this.httpCache.get(request.url);
      if (cachedResponse){
        //console.log("Found response in cache, " + cachedResponse);
        this.httpCache.logCache();
        return of(cachedResponse);
      }
      return this.handleRequestCache(request,next);
    }
  }

  private handleRequestCache(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(response =>{
        if (response instanceof HttpResponse && request.method!== "DELETE"){
            //console.log("Caching response", response);
            this.httpCache.put(request.url, response);
        }
      })
    );
  }
}
