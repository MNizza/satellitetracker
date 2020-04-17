class Satellite {
	constructor(id, coords, opts) {
		this.orbit_index = 1;
		this.norad_id = id;
		this.current_lat_lng = coords;
		this.opts = opts;
	}
	orbit = async function () {
		var tick = await setInterval(() => {
			$.each(window.markers, (k, v) => {
				if (v.norad_id == this.norad_id) {
					$.ajax({
						url: "/satellite",
						method: "GET",
					}).done((res) => {
						$("#loading").hide();
						$.each(res.satellites, (satK, satV) => {
							if (satV.NORAD_CAT_ID == this.norad_id) {
								v.setPosition(satV.CURRENT_LAT_LNG.lat, satV.CURRENT_LAT_LNG.lng);
							}
						});
					});
				}
			});
			this.orbit_index++;
		}, 20000);
	};
}
$("#loading").hide();
window.satellites = [];
window.markers = [];
window.satObjs = [];
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
			$.each(res.satellites, (satK, satV) => {
				window.satellites.push(satV)
				//console.log(satV)
				var str = "";

				str += `<option value="${satV.NORAD_CAT_ID}">${satV.OBJECT_NAME}</option>`;
				$("#satelliteList").append(str);

				var markerStr = "";
				markerStr += `${satV.OBJECT_NAME}</br>`;
				// markerStr += `Launched: ${satV.launch_date}</br>`;
				// markerStr += `Country: ${satV.country}</br>`;
				// markerStr += `Category: ${satV.categories}</br>`;

				var marker = WE.marker([
					satV.CURRENT_LAT_LNG.lat,
					satV.CURRENT_LAT_LNG.lng,
				]).addTo(map);
				marker.norad_id = satV.NORAD_CAT_ID;
				marker.coordinates = marker.bindPopup(markerStr, {
					maxWidth: 150,
					closeButton: true,
				});
				markers.push(marker);
				var sat = new Satellite(satV.NORAD_CAT_ID, satV.CURRENT_LAT_LNG);
				window.satObjs.push(sat);
				//zoom the map to the polyline
				//map.fitBounds(polyline.getBounds());
			});

			window.markers = markers;

			setTimeout(() => {
				$.each(window.satObjs, (satK, satV) => {
					satV.orbit();
				});
				$("#satCount").html(window.satellites.length);
			}, 2000);
		})
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
		$.each(window.satellites, (satK, satV) => {
			if (satV.NORAD_CAT_ID == noradID) {
				map.panTo(satV.CURRENT_LAT_LNG);
			}
		});
		$.each(window.markers, (mkrK, mkrV) => {
			if (mkrV.norad_id == noradID) {
				window.markers[mkrK].openPopup();
			}
		});
	});
});