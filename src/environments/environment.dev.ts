export const environment = {
    production: false,
    adminLogin:'http://172.17.12.38:8081/api/admin/login',
    getAllItems:'http://172.17.12.101:8081/api/users/claim-history',
    unClaim:'http://172.17.12.38:8081/api/users/updateStatus',
    listOfItems:'http://172.17.12.38:8081/api/admin/listOfItems',
    organizationList:'http://172.17.12.38:8081/api/admin/listOfOrganisation',
    adminUploadItem:'http://172.17.12.38:8081/api/admin/upload',
    adminRemoveItem:'http://172.17.12.38:8081/api/admin/archive-expired-items',
    createClaimRequest:'http://172.17.12.38:8081/api/admin/popup-claim'
  };