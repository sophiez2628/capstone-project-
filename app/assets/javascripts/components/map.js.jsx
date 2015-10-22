var Map = React.createClass({

  fetchFromGoogleAPI: function(query) {
    //grabbing user input from the query string
    var find, near, lat, lng;
    if (query) {
      find = query.find;
      near = {lat: query.near.lat, lng: query.near.lng};
    } else {
      find = this.props.location.query.find;
      near = {lat: parseFloat(this.props.location.query.near.lat),
                  lng: parseFloat(this.props.location.query.near.lng)};
    }
    //the request to be sent to google api
    //radius is in meters
    var request = {
      location: near,
      radius: 2000,
      keyword: find
    };
    var service = new google.maps.places.PlacesService(this.map);

    service.radarSearch(request, function(places) {
      console.log(places);
      //response from google api
      ApiActions.receiveGooglePlaces(places);
    }.bind(this));
  },

  componentDidMount: function(){
    var map = React.findDOMNode(this.refs.map);
    var mapOptions;
    if (this.props.place) {
      //map should only have a prop in the individual page
    } else {
      //need to readjust mapOptions so that the focus is on the search result
      mapOptions = {
        center: {lat: 37.7758, lng: -122.435},
        zoom: 14
      };
      // SearchResultsStore.addChangeListener(this.onSearchResultsChange);
      this.map = new google.maps.Map(map, mapOptions);
      window.map = new google.maps.Map(map, mapOptions);
      this.fetchFromGoogleAPI();
    }
  },


  componentWillReceiveProps: function(prop) {
    //for each individual page
    if (!prop.place) {
      this.fetchFromGoogleAPI();
    } else {
      var map = React.findDOMNode(this.refs.map);
      var lat;
      var lng;
      if (prop.place.place_id) {
        lat = prop.place.geometry.location.lat();
        lng = prop.place.geometry.location.lng();
      } else {
        lat = prop.place.lat;
        lng = prop.place.lng;
      }
      var mapOptions = {
        center: {lat: lat, lng: lng},
        zoom: 13
      };
      this.map = new google.maps.Map(map, mapOptions);
      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng }
      });
      marker.setMap(this.map);
    }
  },

  // onSearchResultsChange: function() {
  //   // var searchResults = SearchResultsStore.all();
  //   // searchResults.forEach(function(result, index) {
  //   //   var marker = new google.maps.Marker({
  //   //     position: {lat: result.lat, lng: result.lng },
  //   //     label: (index + 1) + "",
  //   //     title: result.name
  //   //   });
  //   //   marker.setMap(this.map);
  //   // }.bind(this));
  // },

  render: function() {
    var name;
    if (this.props.place) {
      name = "one-place";
    } else {
      name = "multiple-place";
    }

    return (
      <div className={name}>
        <div className={name} ref="map" id="map"></div>
      </div>
    );
  }

});
