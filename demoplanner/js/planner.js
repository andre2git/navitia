var map;

var depart_arrivee = {
    depart :  { lat : -1, lon : -1},
    arrivee : { lat : -1, lon : -1}
};

var planner;


var destination_idx = -1;
var departure_idx = -1;
var debut_requete = -1;
var fin_requete = -1;
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

function format(datetime){

    datetime.trim();

    var year = datetime.slice(0, 4);
    var mounth = datetime.slice(4,6);
    var day = datetime.slice(6,8);
    var hour = datetime.slice(9, 13);
    var str = "";
    var hours = datetime.slice(9,11);
    var mins = datetime.slice(11,13);
    str += hours + "h";
    str += mins;

    str += " le " + day + "-" + mounth + "-" + year; 
    return str;
}

function aff_planning(idPlanning) {

    if(!planner.journey_list[idPlanning].section_list){
        $("#details").html("Pas d'itinéraire trouvé :'(");
    } else {
        map.removeAllPolylines();
        map.removeAllMarkers();
        var arraypolys = new Array();

        $("#details").html("<ul>");

        for(i=0;i<planner.journey_list[idPlanning].section_list.length;i++) {
            var item = planner.journey_list[idPlanning].section_list[i];
            var point = new mxn.LatLonPoint(item.origin.stop_area.coord.y, item.origin.stop_area.coord.x);
            var marker = new mxn.Marker(point);
            if(i==0) {
                marker.setInfoBubble("Depart");
                //  marker.openBubble();
            } else {
                marker.setInfoBubble("Depart arrivee");
            }
            map.addMarker(marker);
            if(item.type == "PUBLIC_TRANSPORT"){
                var sa_name = item.origin.stop_area.name;
                var line_name = item.line.name;
                $("#details").append("<li>Depart à " + format(item.departure_date_time)+" de "+ sa_name +" avec la ligne : "+ line_name + "</li>");
                $("#details").append("<li>Arrivée à : "+ format(item.arrival_date_time)+"</li>");
            } else {
                $("details").append("<li>Marche à pied</li>");            
            }

            for(j=0;j<item.stop_point_list.length;j++) {
                arraypolys.push(new mxn.LatLonPoint(item.stop_point_list[j].coord.y, item.stop_point_list[j].coord.x));
            }
        }
        $("#details").append("</ul>");

        var myPoly = new mxn.Polyline(arraypolys);
        myPoly.setWidth(5);
        map.addPolyline(myPoly);
    }
}

function aff_data(data) {
    fin_requete = new Date().getTime();
    planner = data.planner;


    $("#infos").text("");
    $("div#listecontainer ul").empty();
    if(planner.journey_list){
        for(i=0;i<planner.journey_list.length;++i) {
            $("div#listecontainer ul").append($("<li><a href=\"#\" onclick=\"javascript:aff_planning("+i+");\">Itineraire "+(i+1)+"</a></li>"));
        }
    } else {
        $("#details").append("On a trouvé aucun trajet<br/>");
    }

    aff_planning(0);

    $("#details").append("timer : "+(fin_requete - debut_requete));

}

function planner() {

    if((departure_idx !== -1) && (destination_idx !== -1)) {
        debut_requete = new Date().getTime();
        $.getJSON("../journeys?format=json&origin="+departure_idx+"&destination="+destination_idx+"&datetime="+$("#date").val()+"T"+$("#timeheure").val()+""+$("#timemin").val()+"&date="+
                  +"&clockwise="+$("#typeitineraire option:selected'").val(),
                  aff_data
                  );



    } else {
        alert("Selectionnez une ville");
    }
}

function clickmap(event_name, event_source, event_args) {
    var p = event_args.location;

    if(depart_arrivee.depart.lat === -1) {
        depart_arrivee.depart.lat = p.lat;
        depart_arrivee.depart.lon = p.lon;
        $("#infos").text("Choisissez maintenant une destination");
    } else {
        depart_arrivee.arrivee.lat = p.lat;
        depart_arrivee.arrivee.lon = p.lon;
        $("#infos").text("Calcul en cours ... ");
        debut_requete = new Date().getTime();

        $.getJSON("../journeys?format=json&origin=coord:"+depart_arrivee.depart.lon+":"+depart_arrivee.depart.lat+
                  "&destination=coord:"+depart_arrivee.arrivee.lon+":"+depart_arrivee.arrivee.lat+"&datetime="+$("#date").val()
+"T"+$("#timeheure").val()+""+$("#timemin").val()+"&clockwise="+$("#typeitineraire option:selected'").val(),
                  aff_data
                  );


        depart_arrivee.depart.lat = -1;
    }

}



window.onload= function() {

            map = new mxn.Mapstraction('mapdiv', 'openlayers');

            var latlon = new mxn.LatLonPoint(48.866667, 2.333333);
            map.setCenterAndZoom(latlon, 13);
            map.click.addHandler(clickmap);
            $("#go").click(planner);
        }

$(function() {
      $( "#departure" ).autocomplete({
                                         source: function( request, response ) {
                                                     $.ajax({
                                                                url: "http://127.0.0.1/firstletter",
                                                                dataType: "json",
                                                                data: {
                                                                    format : "json",
                                                                    name: request.term,
                                                                },
                                                                success: function( data ) {
                                                                             response( $.map( data.firstletter.items, function( item ) {
                                                                                                 return {
                                                                                                     label: item.name,
                                                                                                     value: item.uri
                                                                                                 }
                                                                                             }));
                                                                         }
                                                            });
                                                 },
                                         minLength: 2,
                                         select: function( event, ui ) {
                                                     departure_idx = ui.item.value;
                                                 },
                                         open: function() {
                                                   $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                                               },
                                         close: function() {
                                                    $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                                                }
                                     });

      $( "#destination" ).autocomplete({
                                           source: function( request, response ) {
                                                       $.ajax({
                                                                  url: "http://127.0.0.1/firstletter",
                                                                  dataType: "json",
                                                                  data: {
                                                                      format : "json",
                                                                      name: request.term,
                                                                  },
                                                                  success: function( data ) {
                                                                               response( $.map( data.firstletter.items, function( item ) {
                                                                                                   return {
                                                                                                       label: item.name,
                                                                                                       value: item.uri
                                                                                                   }


                                                                                               }));
                                                                           }
                                                              });
                                                   },
                                           minLength: 2,
                                           select: function( event, ui ) {
                                                       destination_idx = ui.item.value;
                                                   },
                                           open: function() {
                                                     $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                                                 },
                                           close: function() {
                                                      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                                                  }
                                       });

  });
