function displayLines(r){var o=$("ul#lines");$.each(r.lines,function(r,a){var t=$("<li>"),e=$("<span>").html(a.code).addClass("line-circle").css({backgroundColor:"#"+a.color});t.html("("+a.network.name+" "+a.commercial_mode.name+") "+a.name).prepend(e),o.append(t)})}var linesUrl="https://api.navitia.io/v1/coverage/sandbox/lines";$.ajax({type:"GET",url:linesUrl,dataType:"json",headers:{Authorization:"Basic "+btoa("a61f4cd8-3007-4557-9f4c-214969369cca")},success:displayLines,error:function(r,o,a){alert("Error: "+o+" "+a)}}),$("pre").html(linesUrl);