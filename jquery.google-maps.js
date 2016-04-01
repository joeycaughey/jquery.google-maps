var Map = {
    markers: [],
    map: false,
    init: function() {
        var self = this;

        self.map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 14
        });


        var input = $('INPUT[name=searchstring]')[0];

        // var types = document.getElementById('type-selector');
        self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', elf.map);

    },
    search: function(address) {
        var self = this;

        var iconBase = '_assets/images/';
		var icons = {
			  parking: {
			    icon: iconBase + 'icon.marker.png'
			  },
			  library: {
			    icon: iconBase + 'library_maps.png'
			  },
			  info: {
			    icon: iconBase + 'info-i_maps.png'
			  }
		};

        self.check_postal_code(address, function(details) {
            self.map.setCenter(new google.maps.LatLng(details.lat, details.lng));
            //console.log("Address Details", details);

            self.add_marker({
            	lat: details.lat,
            	lng: details.lng,
            	title: "Test Marker",
            	icon: icons['parking'].icon
            })
        });
    },
    add_marker: function(marker) {
        var self = this;
     

        var marker = new MarkerWithLabel({
       // var marker = new google.maps.Marker({
            position: new google.maps.LatLng(marker.lat, marker.lng),
            map: self.map,
            title: marker.title,
            icon: marker.icon,


            labelContent: "$12",
	        labelAnchor: new google.maps.Point(16, 00),
	        labelClass: "label", // the CSS class for the label
	      
	        labelInBackground: false
        });

        google.maps.event.addListener(marker, 'click', function() {
		    Popup.init({
		    	width: 550,
		    	height: 250,
		    	url: 'map.details.html'
		    })
		});


        self.markers.push(marker);
    },
    check_postal_code: function(address, callback) {
        var self = this;
        $.getJSON("//maps.googleapis.com/maps/api/geocode/json", {
            address: address,
            sensor: false
        }, function(request) {
            if (request.status == "OK") {
                var object = request.results[0];

                $.each(object.address_components, function(i, component) {
                    if (component.types.contains("locality") || component.types.contains("sublocality_level_1") || component.types.contains("sublocality")) {
                        city = component;
                    } else if (component.types.contains("administrative_area_level_1")) {
                        region = component
                    } else if (component.types.contains("country")) {
                        country = component
                    }
                });

                callback({
                    formated: object.formatted_address,
                    address: {
                        city: city,
                        region: region,
                        country: country
                    },
                    lat: object.geometry["location"].lat,
                    lng: object.geometry["location"].lng
                });
            }
        });
    }
}