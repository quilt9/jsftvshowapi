//Create variables for HTML elements and templates
var listTemplate = document.getElementById("list_template").innerHTML,
	detailsTemplate = document.getElementById("details_template").innerHTML,
	searchText = document.getElementById("search_text"),
	listDiv = document.getElementById("list"),
	detailsDiv = document.getElementById("details"),
	searchBtn = document.getElementById("search_button");
	errorText = document.getElementById("error");//Added by Helen Shiu 04/04

//Create a click event listener to the button
searchBtn.addEventListener("click", function () {
	//Get the search input the user enter
	var title = searchText.value;
	//Make the first server call
	$.get("https://api.tvmaze.com/search/shows?q=:"+ title, null, null, "json")
		.done(onSearchResult)//Call done event handling function
		.fail(onSearchFail);//Call fail event handling function
});

//Create done event handling function
function onSearchResult(data){


	//Create variables for looping through the objects in the data array
	var i,
			x = "";

	//var dataKey = Object.keys(data);
	//var itemKey = Object.keys(dataKey);
	//data = JSON.stringify(data);
	//console.log(Object.prototype.toString.call(data));
	console.log(data);

	/*Validate the returned result. If error occurs, display a message*/
		if(data.length == 0) {
			errorText.innerHTML = "Match not found!<br>Please enter another search.";
		} else if (errorText.innerHTML != " ") {
			errorText.innerHTML = " ";
		}

	for(i in data) {
		x += "<li><a id=" + data[i].show.id + " href=\"#\">" + data[i].show.name + "</a></li>";
	}
	
	/* I can't make this work like the movie database api */
	//var html = Mustache.render(listTemplate, data);
	listDiv.innerHTML = x;

	//Create variable for the list resulted from the search
	var items = listDiv.getElementsByTagName("a");
	//Loop through every single item in the list
	for(var i = 0; i<items.length; i++) {
		var item = items[i];
		//Add a click event listener to each item
		item.addEventListener("click", getDetails);
	}
}

//Create fail event handling function
function onSearchFail(){
	alert("There was a problem contacting the server. Please try again.");
}

//Create a event handler function with an event object as parameter
function getDetails(event) {
	var id = event.target.id;//The target property returns the element that triggered the event with the corresponding id
	$.get("https://api.tvmaze.com/shows/" + id, null, null, "json")
		.done(onDetailResult)
		.fail(onSearchFail);//Reuse the same fail event handling function
}

//Create a event handling function when the details results return
function onDetailResult(data) {
	var html = Mustache.render(detailsTemplate, data);
	detailsDiv.innerHTML = html;

	/* Fix the html tags that comes with the data from api.tvmaze.com */
	var plotBody = document.getElementById("plot");
	var plotTxt = plotBody.nextElementSibling.textContent;
	var regex = /(<([^>]+)>)/ig,   
			result = plotTxt.replace(regex, "");

  plotBody.nextElementSibling.innerHTML = result;
  
}

