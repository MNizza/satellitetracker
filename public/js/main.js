class Satellite {
	constructor(id, coords, period, speed, spread) {
		this.orbitIndex = 1;
		this.orbitalPeriod = period;
		this.orbitalSpeed = speed;
		this.orbitalSpread = spread;
		this.norad_id = id;
		this.coordinates = coords;
	}

	orbit = async function () {
		var tick = await setInterval(() => {
			$.each(window.satCollection, (satK, satV) => {
				if (satV.norad_id == this.norad_id) {
					$.each(window.markers, (mkrK, mkrV) => {
						if (mkrV.norad_id == satV.norad_id) {
							$.each(satV.coordinates, (xyK, xyV) => {
								if (xyK == this.orbitIndex) {
									console.log(
										`Moving ${satV.norad_id} moved to [${xyV.lat}, ${xyV.lng}]`
									);
									mkrV.setPosition(xyV.lat, xyV.lng);
								}
							});
						}
					});
				}
			});
			this.orbitIndex++;
		}, 60000);
	};
}
$("#loading").hide();

window.markers = [];
window.satellites = [];
window.satCollection = [];

$(document).ready((e) => {
	const map = WE.map("earth_div", {
		atmosphere: true,
		center: [37.0902, -95.7129],
		zoom: 3,
		dragging: true,
		tilting: false,
		scrollWheelZoom: true,
	});
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
			var markers = [];
			$.each(res.satellites, (satK, satV) => {
				var str = "";
				str += `<option value="${satV.number}">${satV.name}</option>`;
				$("#satelliteList").append(str);
				$.each(res.satelliteXY, (xyK, xyV) => {
					v
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
						markers.push(marker);
						// zoom the map to the polyline
						//map.fitBounds(polyline.getBounds());
					}
				});
				$.each(res.satelliteOrbit, (k, v) => {
					if (satV.number == v.norad_id) {
						var sat = new Satellite(satV.number, v.coordinates, satV.orbital_period, xyV.speed, xyV.footprint_radius);
						window.satCollection.push(sat);
					}
				});
			});
			window.markers = markers;
			setTimeout(() => {
				$.each(window.satCollection, (satK, satV) => {
					satV.orbit();
				});
				$("#satCount").html(window.satCollection.length);
			}, 2000);
		});
	};

	initialize();
	loadSatellites();

	$("#SearchSatBtn").on("click", (e) => {
		$.each(window.satellites[0].satelliteXY, (satK, satV) => {
			if (satV.norad_id == $("#NoradID").val()) {
				map.panTo(satV.coordinates);
			}
		});
		$.each(window.markers, (mkrK, mkrV) => {
			if (mkrV.norad_id == $("#NoradID").val()) {
				window.markers[mkrK].openPopup();
			}
		});
	});
	$("#satelliteList").on("change", (e) => {
		var noradID = $(e.target).children("option:selected").val();
		$.each(window.satellites[0].satelliteXY, (satK, satV) => {
			if (satV.norad_id == noradID) {
				map.panTo(satV.coordinates);
			}
		});
		$.each(window.markers, (mkrK, mkrV) => {
			if (mkrV.norad_id == noradID) {
				window.markers[mkrK].openPopup();
			}
		});
	});
});
