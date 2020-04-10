$("#loading").hide();
$(document).ready((e) => {
	const map = WE.map("earth_div", {
		atmosphere: true,
		center: [37.0902, -95.7129],
		zoom: 3,
		dragging: true,
		scrollWheelZoom: true,
	});
	const satCollection = [];
	const initialize = () => {
		var baselayer = WE.tileLayer(
			"http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg",
			{
				minZoom: 0,
				maxZoom: 16,
				attribution: "Satellite Tracker(Marcus N.)",
			}
		).addTo(map);
		var marker = WE.marker([37.0902, -95.7129]).addTo(map);
		$("#earth_div")
			.css("background-image", "url(img/d099fbe1334992232264f479a516983e.jpg)")
			.css("background-size", "100% 100%");
	};
	const loadSatellites = () => {
		$("#loading").show();
		$.ajax({
			url: "/satellite",
			method: "GET",
		}).done((res) => {
			$("#loading").hide();

			var satsArr = [];
			$.each(res.satellites, (satK, satV) => {
				satV.location = {};
				satV.orbitalTrack = res.satelliteOrbit;
				$.each(res.satelliteXY, (xyK, xyV) => {
					satV.location = xyV;
					satsArr.push(satV);

					if (xyV.norad_id == satV.number) {
						var markerStr = "";
						markerStr += `${satV.name}</br>`;
						markerStr += `Launched: ${satV.launch_date}</br>`;
						markerStr += `Country: ${satV.country}</br>`;
						markerStr += `Category: ${satV.categories}</br>`;

						var marker = WE.marker([
							xyV.coordinates[0],
							xyV.coordinates[1],
						]).addTo(map);
						var latlngs = satV.orbitalTrack.coordinates;
						var polyline = WE.polyline(latlngs, { color: 'red' }).addTo(map);
						marker.bindPopup(markerStr, { maxWidth: 150, closeButton: true });
						
						// zoom the map to the polyline
						map.fitBounds(polyline.getBounds());
					}
				});
			});
			satCollection.push(satsArr);
		});
	};
	initialize();
	loadSatellites();
	console.log(satCollection);
});
