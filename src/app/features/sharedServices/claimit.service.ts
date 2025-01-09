import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.dev';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClaimitService {

  constructor(private http: HttpClient) { }
  private notificationCountSource = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSource.asObservable();


  private pendingClaimsSubject = new BehaviorSubject<number>(0);

  // Observable for components to subscribe to
  pendingClaimsCount$ = this.pendingClaimsSubject.asObservable();
  public loginResponse = new BehaviorSubject<any>(false);
  loginResponse_Triggered = this.loginResponse.asObservable();
  public getAllItems(query: any) {
    return this.http.get(environment.getAllItems + '?email='+query.email +'&userName=' + query.name);
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
    return this.http.put(environment.approveOrRejectClaim+'?itemId='+reqbody.itemId+'&status='+reqbody.status+'&rejectedReason='+reqbody.reasonForReject,'')
  }
  public markASClaimed(reqbody:any){
    return this.http.put(environment.markASClaimed,reqbody)
  }
  
  public statusCount(month: string, year: number) {
    const url = `${environment.statusCount}?month=${year}-${month}`;
    return this.http.get(url);
  }
  
  public categoryItems(month: string, year: number) {
    const url = `${environment.categoryItems}?month=${year}-${month}`;
    return this.http.get(url);
  }
  public getCategories() {
    return this.http.get(environment.getCategories)
  }
  public contactUs(REQBODY: any) {
    return this.http.post(environment.contactUs, REQBODY)
  }
  public getNotifications(): Observable<any> {
    return this.http.get(environment.getNotifications)
  }
  public updateNotification(reqbody: any) {
    return this.http.put(environment.updateNotification, reqbody);
  }
  setNotificationCount(count: number): void {
    this.notificationCountSource.next(count);
  }

  pendingClaims: any[] = [];

  addClaim(claim: any) {
    this.pendingClaims.push(claim);
    this.pendingClaimsSubject.next(this.pendingClaims.length); // Update notification count
  }

  getClaims() {
    return this.pendingClaims;
  }
}
