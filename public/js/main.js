$("#loading").hide();
window.markers = [];
window.satellites = [];
window.updateSatCoords = function (noradID) {
	orbitI = 0;
	console.log('Hello')

	setInterval(() => {
		console.log(`Updating coords for ${noradID}`);
		//figure out the satellites orbital period
		$.each(window.markers, (markerK, markerV) => {
			$.each(window.satellites[0].satelliteOrbit, (orbK, orbV) => {
				if (markerV.norad_id == noradID && orbV.norad_id == noradID) {
					if (orbitI > window.satellites[0].satelliteOrbit.length) {
						window.markers[markerK].setLatLng([orbV.coordinates[orbitI].lat,orbV.coordinates[orbitI].lng])
						orbitI++;
					}
					else if (orbitI = window.satellites[0].satelliteOrbit.length) {
						window.markers[markerK].setLatLng([orbV.coordinates[orbitI].lat,orbV.coordinates[orbitI].lng])
						orbitI = 0;
					}
				}
			})
		})
	}, 60000)


}

$(document).ready((e) => {
	const map = WE.map("earth_div", {
		atmosphere: true,
		center: [37.0902, -95.7129],
		zoom: 3,
		dragging: true,
		tilting: false,
		scrollWheelZoom: true,
	});
	var satCollection = [];
	const initialize = () => {
		var baselayer = WE.tileLayer(
			"https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}@2x.jpg?key=WGCEVQZ0rsY9YIzTDjIr",
			{
				tileSize: 512,
				minZoom: 0,
				maxZoom: 16,
				attribution: "Satellite Tracker(Marcus N.)",
			}
		).addTo(map);
		// var marker = WE.marker([37.0902, -95.7129]).addTo(map);
		$("#earth_div")
			.css("background-image", "url(img/d099fbe1334992232264f479a516983e.jpg)")
			.css("background-size", "100% 100%");
	};
	const loadSatellites = () => {
		var count = 0;
		$("#loading").show();
		$.ajax({
			url: "/satellite",
			method: "GET",
		}).done((res) => {
			$("#loading").hide();
			window.satellites.push(res);

			$.each(res.satellites, (satK, satV) => {
				$.each(res.satelliteXY, (xyK, xyV) => {
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
						marker.norad_id = xyV.norad_id;
						marker.bindPopup(markerStr, { maxWidth: 150, closeButton: true });
						window.markers.push(marker);
						// zoom the map to the polyline
						//map.fitBounds(polyline.getBounds());
					}
				});
			});

		});
	};

	initialize();
	loadSatellites();
	window.markers = markers;

	setTimeout(() => {
		$.each(window.satellites[0].satellites,(satK, satV) => {
			window.updateSatCoords(satV.number);
		})
	}, 1000)

	$("#SearchSatBtn").on("click", (e) => {
		$.each(window.satellites[0].satelliteXY, (satK, satV) => {
			if (satV.norad_id == $("#NoradID").val()) {
				map.panTo(satV.coordinates);
			}
		});
	});
});
