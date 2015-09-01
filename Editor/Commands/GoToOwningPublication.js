Type.registerNamespace("Extensions");

Extensions.GoToOwningPublication = function Extensions$GoToOwningPublication() {
    Type.enableInterface(this, "Extensions.GoToOwningPublication");
    this.addInterface("Tridion.Cme.Command", ["GoToOwningPublication"]);
};

Extensions.GoToOwningPublication.prototype.isAvailable = function GoToOwningPublication$isAvailable(selection) {
	if (selection.getItems().length == 1) {
		var itemType = $models.getItemType(selection.getItem(0));
		if (itemType == $const.ItemType.COMPONENT ||
		itemType == $const.ItemType.COMPONENT_TEMPLATE ||
		itemType == $const.ItemType.SCHEMA ||
		itemType == $const.ItemType.TEMPLATE_BUILDING_BLOCK ||
		itemType == $const.ItemType.FOLDER ||
		itemType == $const.ItemType.STRUCTURE_GROUP ||
		itemType == $const.ItemType.PAGE ||
		itemType == $const.ItemType.PAGE_TEMPLATE) {
			return true;
		}
	}
	return false;
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
     GoToOwningPublication_goToParent(it);
    }else{
     it.load(false);
     e.addEventHandler(it, "load", function(){
      GoToOwningPublication_goToParent(it)
     });
    }
};

function GoToOwningPublication_goToParent(item){
	var doc = item.getXmlDocument(); 
	var pubId = $xml.selectNodes(doc, "//tcm:Publication/@xlink:href")[0].value;   
	 var owningPubId = $xml.selectNodes(doc, "//tcm:OwningPublication/@xlink:href")[0].value;   
	 if (owningPubId != pubId) {
		var it = item.getId();
		var owningPubNr = owningPubId.slice(6, owningPubId.lastIndexOf("-"));
		var contextId = "tcm:"+owningPubNr + it.slice(it.indexOf("-"));
		 
		$models.getNavigator().navigateToCmItem(contextId, false, window);
	 }else if ($messages){
		$messages.registerNotification('Current publication is the owner.');
	 }else
	 {
		 alert('Current publication is the owner.');
	 }
}
	