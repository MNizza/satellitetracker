$("#loading").hide();
$(document).ready((e) => {
	const map = WE.map("earth_div", {
		atmosphere: true,
		center: [37.0902, -95.7129],
		zoom: 3,
		dragging: true,
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
		var marker = WE.marker([37.0902, -95.7129]).addTo(map);
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
			satCollection.push(res);

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

						marker.bindPopup(markerStr, { maxWidth: 150, closeButton: true });

						// zoom the map to the polyline
						//map.fitBounds(polyline.getBounds());
					}
				});
			});

			$.each(res.satelliteOrbit, (orbK, orbV) => {
				$.each(res.satelliteOrbit[orbK].coordinates, (xyTrackK, xyTrackV) => {
					if (count < 5) return;
					var polyline = WE.polygon(
						[xyTrackV.lat, xyTrackV.lng],
						{
							color: "#ff0",
							opacity: 1,
							fillColor: "#f00",
							fillOpacity: 0.1,
							editable: false,
							weight: 2,
						}
					);
					polyline.addTo(map);
					count++;
				});
			});
		});
	};
	initialize();
	loadSatellites();
	console.log(satCollection);
});
