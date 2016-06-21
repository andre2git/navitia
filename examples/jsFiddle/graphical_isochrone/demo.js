function drawIsochron(e){$.each(e.isochrones,function(e,t){var n=t.geojson,i=L.geoJson(n).addTo(map),o=i.getBounds();map.fitBounds(o)})}var sandboxToken="a61f4cd8-3007-4557-9f4c-214969369cca",from=[48.846905,2.377097],maxDuration=2e3,minDuration=1e3,url="https://api.navitia.io/v1/coverage/sandbox/isochrones?from="+from[1]+";"+from[0]+"&datetime=20160505T080000&max_duration="+maxDuration+"&min_duration="+minDuration;$.ajax({type:"GET",url:url,dataType:"json",headers:{Authorization:"Basic "+btoa(sandboxToken)},success:drawIsochron,error:function(e,t,n){alert('Error when trying to process isochron: "'+t+'", "'+n+'"')}});var tiles={url:"http://www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png",attrib:'Navitia Isochron example \xa9 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'},map=L.map("map").setView(from,13).addLayer(new L.TileLayer(tiles.url,{minZoom:0,maxZoom:16,attribution:tiles.attrib}));L.marker(from).addTo(map);