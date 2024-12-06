import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ClaimitService {

  constructor(private http: HttpClient) { }
  public getAllItems(query: any) {
    return this.http.get(environment.getAllItems);
  }
  public unClaimItem(query: any) {
    let filterQuery = Object.fromEntries(Object.entries(query).filter(([k, v]) => v != '' && v != null))

    return this.http.put(environment.unClaim+'?status='+query.status+'&claimId='+query.claimId,'')
  }
}
