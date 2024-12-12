import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.dev';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClaimitService {

  constructor(private http: HttpClient) { }

  public loginResponse = new BehaviorSubject<any>(false);
  loginResponse_Triggered = this.loginResponse.asObservable();
  public getAllItems(query: any) {
    return this.http.get(environment.getAllItems + '?email=' + query);
  }
  public unClaimItem(query: any) {
    let filterQuery = Object.fromEntries(Object.entries(query).filter(([k, v]) => v != '' && v != null))

    return this.http.put(environment.unClaim + '?status=' + query.status + '&claimId=' + query.claimId, '')
  }
  //List of itetems
  public listOfItems(query: any) {
    return this.http.get(environment.listOfItems);
  }

  //Admin login 
  public adminLogin(email: string, password: string) {
    const loginData = { email, password };
    return this.http.post(environment.adminLogin, loginData);
  }

  //List of Organization
  public organizationList() {
    return this.http.get(environment.organizationList);
  }

  //Admin upload an item
  public adminUploadItem(orgId: string, formData: FormData): Observable<any> {
    return this.http.post(`${environment.adminUploadItem}`, formData);
  }

  //Admin remove item 
  public adminRemoveItem(itemId: number): Observable<any> {
    const url = `${environment.adminRemoveItem}?itemId=${itemId}`;
    console.log('ItemId being sent in the request:', itemId);
    return this.http.put(url, {});
  }

  public createClaimRequest(REQBODY: any) {
    return this.http.post(environment.createClaimRequest, REQBODY)
  }
  public getUSerSlides() {
    return this.http.get(environment.userSlides)
  }
  public adminSearch(params:any){
    console.log('params',params)
    return this.http.get(environment.adminSearch+'?mail='+params.mail+'&status='+params.status+'&to='+params.to+'&from='+params.from)
  }
  public approveOrRejectClaim(reqbody:any){
    return this.http.put(environment.approveOrRejectClaim+'?itemId='+reqbody.itemId+'&status='+reqbody.status,'')
  }
}
