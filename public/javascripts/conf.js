function removeAPI(apiId){
    $('#aRemoveApi').attr('href', '/api/delete?id='+apiId);
    $('#confirmRemoveModal').modal('show');
}