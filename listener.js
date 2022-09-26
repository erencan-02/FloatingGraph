
const CUSTOM_EVENTS = [82, 88, 65, 90, 32, 83];


function KeyPress(e) {
	var evtobj = window.event ? event : e

	if(!CUSTOM_EVENTS.includes(evtobj.keyCode)){
		return;
	}

	e.preventDefault();

	if ((evtobj.keyCode == 82 && evtobj.ctrlKey) || evtobj.keyCode == 116)  location.reload();

	if (evtobj.keyCode == 88 && evtobj.ctrlKey) removeAll();

	if (evtobj.keyCode == 65 && evtobj.ctrlKey) addRandomNodes(10);

	if (evtobj.keyCode == 90 && evtobj.ctrlKey) removeNodes(recentlyAddedNodesCount);

	if (evtobj.keyCode == 32) isPaused = !isPaused;

	if (evtobj.keyCode == 83 && evtobj.ctrlKey){
		var link = document.createElement("a");
  		link.setAttribute('download', 'MintyPaper.png');
		link.setAttribute('href', document.getElementById("defaultCanvas0").toDataURL("image/png"));//.replace("image/png", "image/octet-stream"));
		document.body.appendChild(link);
  		link.click();
  		link.remove();
      } 
}

document.onkeydown = KeyPress;

