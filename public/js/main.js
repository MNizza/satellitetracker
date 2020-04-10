$(document).ready(e => {
	const map = WE.map("earth_div", {
		center: [37.0902, -95.7129],
		zoom: 3,
		dragging: true,
		scrollWheelZoom: true,
	});
	const satCollection = [];
	const initialize = () => {


		var baselayer = WE.tileLayer(
			"https://webglearth.github.io/webglearth2-offline/{z}/{x}/{y}.jpg",
			{
				tileSize: 256,
				bounds: [
					[-85, -180],
					[85, 180],
				],
				minZoom: 0,
				maxZoom: 16,
				attribution: "Satellite Tracker(Marcus N.)",
				tms: true,
			}
		).addTo(map);
		var marker = WE.marker([37.0902, -95.7129]).addTo(map);

	}
	const loadSatellites = () => {
		$.ajax({
			url: "/satellite",
			method: "GET",
		}).done((res) => {
			var satsArr = [];
			$.each(res.satellites, (satK, satV) => {
				satV.location = {};
				$.each(res.satelliteXY, (xyK, xyV) => {
					satV.location = xyV;
					satsArr.push(satV);

					if (xyV.norad_id == satV.number) {
						var markerStr = '';
						markerStr += `${satV.name}</br>`;
						markerStr += `Launched: ${satV.launch_date}</br>`;
						markerStr += `Country: ${satV.country}</br>`;
						markerStr += `Category: ${satV.categories}</br>`;

						var marker = WE.marker([xyV.coordinates[0], xyV.coordinates[1]]).addTo(map);
						marker
							.bindPopup(
								markerStr,
								{ maxWidth: 150, closeButton: true }
							)
					}
				});
			});
			satCollection.push(satsArr);
		});
	};
	initialize();
	loadSatellites();
	console.log(satCollection)
});
