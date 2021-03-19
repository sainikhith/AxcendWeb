import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/Operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {

baseUrl = environment.baseUrl;


  constructor(private _http:HttpClient) { }




  StudentGetDetails() {
    let result: Observable<any>;
      result = this._http.get<any>(this.baseUrl+"/api/Students");
    return result;
  }

  extractData(res: Response) {
    let body=res;
    
    return body || {};
  }
  private handleError<T>(operation='operation',result?:T){
    return(error:any):Observable<T>=>{
      console.error(error);
      console.log('${operation}failed:${error.message}');
      return of (result as T);
    };

  }

  StudentDetails(Details:any):Observable<any>
  {
      return this._http.post<any>(this.baseUrl+"/api/Students" ,Details).pipe(tap(this.extractData),catchError(this.handleError<any>('Student Add Failed')));
  }
}


