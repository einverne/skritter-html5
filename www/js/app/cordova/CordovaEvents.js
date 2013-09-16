/*
 * 
 * Module: CordovaEvents
 * 
 * Created By: Joshua McFarland
 * 
 */
define(function() {
    
    function CordovaEvents() {

	function handleBackButton() {
	    
	}
	
	function handleMenuButton() {
	    
	}
	
	document.addEventListener('backbutton', handleBackButton, false);
	document.addEventListener('menubutton', handleMenuButton, false);
    }
    
    
    return CordovaEvents;
});