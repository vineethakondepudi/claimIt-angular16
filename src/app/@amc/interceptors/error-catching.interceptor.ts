import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import {
  STATUS_0,
  STATUS_400,
  STATUS_401,
  STATUS_403,
  STATUS_404,
  STATUS_405,
  STATUS_409,
  STATUS_422,
  STATUS_429,
  STATUS_500,
  STATUS_503,
  STATUS_UNkNOWN,
} from "../constants/error-messages.constants";

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('url ', request.url);
        
        let errorMessage = "";
        if (error.error instanceof ErrorEvent) {
          console.log("This is client side error");
          errorMessage = `Error: ${error.error.message}`;
        } else {
          console.log("This is server side error", error.status);
          switch (error.status) {
            case 0:
              errorMessage = STATUS_0;
              break;
            case 400:
              errorMessage = STATUS_400;
              break;
            case 401:
              errorMessage = STATUS_401;
              break;
            case 403:
              errorMessage = STATUS_403;
              break;
            case 404:
              errorMessage = STATUS_404;
              break;
            case 405:
              errorMessage = STATUS_405;
              break;
            case 409:
              errorMessage = STATUS_409;
              break;
            case 422:
              errorMessage = STATUS_422;
              break;
            case 429:
              errorMessage = STATUS_429;
              break;
            case 500:
              errorMessage = STATUS_500;
              break;
            case 503:
              errorMessage = STATUS_503;
              break;
            default:
              errorMessage = STATUS_UNkNOWN;
              break;
          }
        }
        console.log(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
