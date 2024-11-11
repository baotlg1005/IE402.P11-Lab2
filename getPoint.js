var list_points = [];
var string_points = "";

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function pointExists(point) {
    return list_points.some(existingPoint =>
        existingPoint[0] === point[0] && existingPoint[1] === point[1]
    );
}

function setupGetPoint(view, graphicsLayer) {
    view.popup.autoOpenEnabled = false; // Disable the default popup behavior

    view.on("click", function (event) { // Listen for the click event
        view.hitTest(event).then(function (hitTestResults) { // Search for features where the user clicked
            if (hitTestResults.results) {
                var newPoint = [event.mapPoint.longitude, event.mapPoint.latitude];

                if (!pointExists(newPoint)) {
                    list_points.push(newPoint);
                    string_points += "[" + newPoint[0] + ", " + newPoint[1] + "],";
                    copyTextToClipboard("[" + newPoint[0] + ", " + newPoint[1] + "]");

                    // Draw the line if there are at least two points
                    if (list_points.length > 1) {
                        //drawLine();
                    }
                } else {
                    console.log("Duplicate point, not added.");
                }
            }
        });
    });

    function drawLine() {
        var polyline = new Polyline({
            paths: [list_points]
        });

        var lineSymbol = new SimpleLineSymbol({
            color: [226, 119, 40],
            width: 2
        });

        var lineGraphic = new Graphic({
            geometry: polyline,
            symbol: lineSymbol
        });

        graphicsLayer.add(lineGraphic);
    }

}
