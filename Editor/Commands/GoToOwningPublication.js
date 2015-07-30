Type.registerNamespace("Extensions");

Extensions.GoToOwningPublication = function Extensions$GoToOwningPublication() {
    Type.enableInterface(this, "Extensions.GoToOwningPublication");
    this.addInterface("Tridion.Cme.Command", ["GoToOwningPublication"]);
};

Extensions.GoToOwningPublication.prototype.isAvailable = function GoToOwningPublication$isAvailable(selection) {
    if (selection.getItems().length != 1) {
        return false;
    }
	return true;
};

Extensions.GoToOwningPublication.prototype.isEnabled = function GoToOwningPublication$isEnabled(selection) {
	return this.isAvailable(selection);
};

Extensions.GoToOwningPublication.prototype._execute = function GoToOwningPublication$_execute(selection) {
	
   var d = $display;
   var m = $models; 
   var e = $evt; 
   var x = $xml; 
   var u = $tcmutils;
   var cme = $cme; 
   
	var tcmid = selection.getItems()[0];
	var it = m.getItem(tcmid);  
	
	if(it.isLoaded(true)){
     GoToOwningPublication_goToParent(it.getXmlDocument());
    }else{
     it.load(false);
     e.addEventHandler(it, "load", function(){
      GoToOwningPublication_goToParent(it.getXmlDocument())
     });
    }
};

function GoToOwningPublication_isShared(doc) {
     var pubId = $xml.selectNodes(doc, "//tcm:Publication/@xlink:href")[0].value;   
	 var owningPubId = $xml.selectNodes(doc, "//tcm:OwningPublication/@xlink:href")[0].value;   
	 /*var isShared = $xml.selectNodes(doc, "//tcm:IsShared")[0].innerHTML;
	 var isLocalized = $xml.selectNodes(doc, "//tcm:IsLocalized")[0].innerHTML;*/
	 return owningPubId != pubId;
}

function GoToOwningPublication_goToParent(doc){ 
	 if (GoToOwningPublication_isShared(doc)) {
		var owningPubId = $xml.selectNodes(doc, "//tcm:OwningPublication/@xlink:href")[0].value;   
		var it = $xml.selectNodes(doc, "//tcm:OrganizationalItem/@xlink:href")[0].value;
		 
		var owningPubNr = owningPubId.slice(6, owningPubId.lastIndexOf("-"));
		var contextId = "tcm:"+owningPubNr + it.slice(it.indexOf("-"));
		 
		GoToOwningPublication_redirectBrowser(contextId);
	 }else if ($messages){
		$messages.registerNotification('Current publication is the owner.');
	 }else
	 {
		 alert('Current publication is the owner.');
	 }
}

function GoToOwningPublication_redirectBrowser(contextId) {
     var urlsel = document.location.href
	 urlsel = urlsel.slice(0, urlsel.indexOf('.aspx')+5) + '#locationId=' + contextId;
	 document.location.href = urlsel
	 location.reload();
}
	