var Map = React.createClass({
  mixins: [ReactRouter.History],
  getInitialState: function() {
    return {query: undefined };
  },

  fetchFromGoogleAPI: function(query) {
    // this.checkForMarkers();
    //grabbing user input from the query string

    var find, near, lat, lng;
    if (query) {
      find = query.find;
      near = query.near;
    } else {
      find = "food";
      near = { lat: 37.7749290, lng: -122.4194160 };
    }
    //the request to be sent to google api
    //radius is in meters
    var request = {
      location: near,
      radius: 1000,
      keyword: find
    };
    var service = new google.maps.places.PlacesService(this.map);

    service.radarSearch(request, function(places) {
      //response from google api
      if (places) {
        ApiActions.receiveGooglePlaces(places);
      }
    }.bind(this));
  },

  componentDidMount: function(){
    QueryStore.addChangeListener(this.onQueryChange);
    var map = React.findDOMNode(this.refs.map);
    var mapOptions;
    if (this.state.query) {
      //map should only have a prop in the individual page
      this.fetchFromGoogleAPI(this.state.query);
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
      this.props.mount && this.props.mount();
    }
  },

  onQueryChange: function() {
    this.setState({ query: QueryStore.all() }, function() {
      this.fetchFromGoogleAPI(this.state.query);
    }.bind(this));
  },

  componentWillReceiveProps: function(prop) {
    //for each individual page
    if (!prop.place) {
      this.fetchFromGoogleAPI();
    } else {
      // var map = React.findDOMNode(this.refs.map);
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
      this.map.setCenter({lat: lat, lng: lng});
      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng }
      });
      marker.setMap(this.map);
    }
  },


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
