import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    httpRequest = httpRequest.clone({
      setHeaders: {
        Authorization: `Basic X3N5c3RlbTpTWVM=` //Typical _system
      }
    });
    return next.handle(httpRequest);
  }
}
