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
		}, 3000);
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
		zoom: 2,
		dragging: true,
		tilting: false,
		scrollWheelZoom: true,
	});
	const addSatelite = (satellite) => {
		var str = "";

		str += `<option value="${satellite.NORAD_CAT_ID}">${satellite.OBJECT_NAME}</option>`;

		$("#satelliteList").append(str);

		var markerStr = "";

		markerStr += `<span class="text-center" style="font-weight:bold;width:100%;display:inline-block">${satellite.OBJECT_NAME}</span></br>`;
		markerStr += `<span class="text-right" style="font-weight:bold;width:45%;display:inline-block">NORAD Catalog ID:</span><span>${satellite.NORAD_CAT_ID}</span></br>`;
		markerStr += `<span class="text-right" style="font-weight:bold;width:45%;display:inline-block">Object Type:</span><span>${satellite.OBJECT_TYPE}</span></br>`;
		markerStr += `<span class="text-right" style="font-weight:bold;width:45%;display:inline-block">Revs at Epoch:</span><span>${satellite.REV_AT_EPOCH}</span></br>`;
		markerStr += `<a style="padding-left: 30px;font-weight:bold" target="_blank" href="https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${satellite.OBJECT_ID}">Learn more about this object</a>`
		
		var marker = WE.marker([
			satellite.CURRENT_LAT_LNG.lat,
			satellite.CURRENT_LAT_LNG.lng,
		]).addTo(map);

		marker.norad_id = satellite.NORAD_CAT_ID;
		marker.coordinates = marker.bindPopup(markerStr, {
			maxWidth: 250,
			closeButton: true,
		});


		var sat = new Satellite(satellite.NORAD_CAT_ID, satellite.CURRENT_LAT_LNG);

		window.satellites.push(sat);
		window.markers.push(marker);

	}
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
			url: "/satellite/19025",
			method: "GET",
		}).done((res) => {
			$("#loading").hide();
			$.each(res.satellites, (satK, satV) => {
				addSatelite(satV);
			});
			window.markers = markers;

			setTimeout(() => {
				$.each(window.satellites, (satK, satV) => {
					satV.orbit();
				});
				$("#satCount").html(window.satellites.length);
			}, 300);
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