var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
var tabPanels=document.querySelectorAll(".tabContainer .tabPanel");

function showPanel(panelIndex) {
	tabPanels.forEach(function(node){
		node.style.display="none";
	});
	tabButtons.forEach(function(node){
		node.style.color="";
	});
	tabPanels[panelIndex].style.display="block";
	tabButtons[panelIndex].style.color="white";
}

showPanel(0);
