								Application architecture:

I. Navigation Folder: "fsts\Navigation\Route.js"
  Holdes the pages of the app using react-navigation library

  I.1. Pages:

    I.1.1. Browser: "fsts\Navigation\Pages\Browser.js"
       Custom Component created to holde :

	* button to change the mapType : it uses state to change the value
	* Google maps API Based Component "fsts\googleMapAPI\MapView.js" :
		-- create, count and render the drawings (marker, line, polygone) --

		it works depending on the drawing tool clicked in the Component "fsts\Components\DrawingTools.js", they are connected to a globale state using redux.
		  
		how does it work ?
			- it changes the globale state in the reducer "fsts\Store\reducers\toggleToolsReducer.js".
			- the "fsts\googleMapAPI\MapView.js" detect the choosen drawing tool.

		then? after the drawing tool is knowen :
			- on long press the map it will :
			   . push drawing informations to its sepecefied array "eg: markers = []" in "fsts\googleMapAPI\MapView.js".
			   . update the drawing tool id in the state "eg: markerNumber: 0," in "fsts\googleMapAPI\MapView.js".
			   . in the render of "fsts\googleMapAPI\MapView.js" map the sepecefied array of drawing tools to show them.
			   . send a value to the reducer "fsts\Store\reducers\showTableReducer.js" to tell that the tool is drawen and fill data about it in "fsts\Components\DataForm.js"
			   . When finish drawing tool, in the "fsts\Components\DataForm.js":
				. fill <TextInput>'s with the specified informations in an object in the state "editing"
				. search from the global store the acuale drawing tool "this.props.too = "marker/mplygone ..etc"
				. fii an array in the state with data : push "editing".