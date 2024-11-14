function RenderPoint(point, color = [226, 119, 40]) {
    jsondata.points.push({
        type: "point",
        x: point[0],
        y: point[1],
        z: point[2],
        symbol: {
            type: "simple-marker",
            color: color,
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        },
    });
}

function RenderPolyline(listPoints, color) {
    jsondata.polyline.push({
        type: "polyline",
        paths: listPoints,
        symbol: {
            type: "simple-line",
            color: color,
            width: 1
        }
    });
}

function RenderPolygon(listPoints, color, have_outline = false) {
    jsondata.polygons.push({
        type: "polygon",
        rings: listPoints,
        symbol: {
            type: "simple-fill",
            color: color,
            outline: have_outline ? {
                color: [0, 0, 0],
                width: 1
            } : null
        }
    });
}

function RenderCircle(centerPoint, radius, delta) {
    const points = [];
    const angleIncrement = (360 / delta) * (Math.PI / 180); // Chuyển đổi từ độ sang radian

    for (let i = 0; i < delta; i++) {
        const angle = i * angleIncrement;
        const x = centerPoint[0] + radius * Math.cos(angle);
        const y = centerPoint[1] + radius * Math.sin(angle);

        points.push([x, y, centerPoint[2]]);
    }

    points.push(points[0]);
}

function RenderCircle(firstPoint, secondPoint, thirdPoint, delta, color = [0, 0, 0]) {

    points = GenerateCircle(firstPoint, secondPoint, thirdPoint, delta);
    RenderPolygon(points, color);
}

function RenderRoundCylinder(firstPoint, secondPoint, thirdPoint, delta, height, color = [0, 0, 0]) {
    bottomPoint = GenerateCircle(firstPoint, secondPoint, thirdPoint, delta);

    for (let i = bottomPoint.length - 1; i > 0; i--) {

        let firstBottomPoint = bottomPoint[i];
        let secondBottomPoint = bottomPoint[i - 1];

        let firstTopPoint = [
            firstBottomPoint[0],
            firstBottomPoint[1],
            firstBottomPoint[2] + height
        ]

        let secondTopPoint = [
            secondBottomPoint[0],
            secondBottomPoint[1],
            secondBottomPoint[2] + height
        ]

        ring = [firstBottomPoint, secondBottomPoint, secondTopPoint, firstTopPoint, firstBottomPoint];

        RenderPolygon(ring, color);
    }
}

function RenderRoundCylinder(center, radius, height, color = [0, 0, 0], filled = false, have_outline = false, have_filled_outline = false) {
    bottomPoints = GenerateCircle(center, radius, 20);

    RenderCylindner(bottomPoints, height, color, filled, have_outline, have_filled_outline);
}

function RenderCylindner(bottomPoints, height, color = [0, 0, 0], filled = false, have_outline = false, have_filled_outline = false, removeFace = []) {


    let topPoints = [];

    for (let i = bottomPoints.length - 1; i > 0; i--) {

        if (removeFace.includes(i)) {
            continue;
        }

        let firstBottomPoint = bottomPoints[i];
        let secondBottomPoint = bottomPoints[i - 1];

        let firstTopPoint = [
            firstBottomPoint[0],
            firstBottomPoint[1],
            firstBottomPoint[2] + height
        ]

        let secondTopPoint = [
            secondBottomPoint[0],
            secondBottomPoint[1],
            secondBottomPoint[2] + height
        ]

        topPoints.push(firstTopPoint);
        topPoints.push(secondTopPoint);

        ring = [firstBottomPoint, secondBottomPoint, secondTopPoint, firstTopPoint, firstBottomPoint];

        RenderPolygon(ring, color, have_outline);
    }

    if (filled) {
        RenderPolygon([...bottomPoints, bottomPoints[0]], color, have_filled_outline);
        RenderPolygon([...topPoints, topPoints[0]], color, have_filled_outline);
    } else if (have_outline) {
        RenderPolyline([...bottomPoints, bottomPoints[0]], [0, 0, 0]);
        RenderPolyline([...topPoints, topPoints[0]], [0, 0, 0]);
    }
}

function RenderWall(bottomPoints, height, color = [0, 0, 0], filled = false, have_outline = false, have_filled_outline = false) {
    //sort bottom points by x then y
    bottomPoints.sort(function (a, b) {
        if (a[0] == b[0]) {
            return a[1] - b[1];
        }
        return a[0] - b[0];
    });

    //swap 4th and 3rd point
    let temp = bottomPoints[2];
    bottomPoints[2] = bottomPoints[3];
    bottomPoints[3] = temp;

    let topPoints = [];
    for (let i = 0; i < bottomPoints.length; i++) {
        topPoints.push([
            bottomPoints[i][0],
            bottomPoints[i][1],
            bottomPoints[i][2] + height
        ]);
    }

    let northFacePoint = [
        bottomPoints[0],
        bottomPoints[1],
        topPoints[1],
        topPoints[0],
    ]

    let eastFacePoint = [
        bottomPoints[1],
        bottomPoints[2],
        topPoints[2],
        topPoints[1],
    ]

    let southFacePoint = [
        bottomPoints[2],
        bottomPoints[3],
        topPoints[3],
        topPoints[2],
    ]

    let westFacePoint = [
        bottomPoints[3],
        bottomPoints[0],
        topPoints[0],
        topPoints[3],
    ]

    RenderPolygon(northFacePoint, color, have_outline);
    RenderPolygon(eastFacePoint, color, have_outline);
    RenderPolygon(southFacePoint, color, have_outline);
    RenderPolygon(westFacePoint, color, have_outline);

    if (filled) {
        let topFacePoints = [
            topPoints[0],
            topPoints[1],
            topPoints[2],
            topPoints[3],
            topPoints[0],
        ]

        RenderPolygon(topFacePoints, color, have_filled_outline);

        let bottomFacePoints = [
            bottomPoints[0],
            bottomPoints[1],
            bottomPoints[2],
            bottomPoints[3],
            bottomPoints[0],
        ]

        RenderPolygon(bottomFacePoints, color, have_filled_outline);
    }

    return [northFacePoint, eastFacePoint, southFacePoint, westFacePoint];
}

function RenderWallFace(bottomPoints, height, color = [0, 0, 0], filled = false, have_outline = false, have_filled_outline = false) {
    //bottomPoint only have 2 points

    let facePoints = [
        bottomPoints[0],
        bottomPoints[1],
        [bottomPoints[1][0], bottomPoints[1][1], bottomPoints[1][2] + height],
        [bottomPoints[0][0], bottomPoints[0][1], bottomPoints[0][2] + height],
    ]

    RenderPolygon(facePoints, color, have_outline);

    return facePoints;
}

function RenderWindowOnWallFace(facePoints, windowBottomLeftPoint, windowTopRightPoint, unit, windowColor = [255, 255, 255]) {
    //facePoints là 4 điểm của mặt tường
    //wall face sẽ được chia thành unit * unit phần bằng nhau với 
    //điểm 0,0 là điểm facePoints[0]
    //điểm unit,unit là điểm facePoints[1]

    //windowBottomLeftPoint và windowRightTopPoint là tọa độ của cửa sổ trên mặt tường theo hệ tọa độ unit x unit
    //windowBottomLeftPoint và windowRightTopPoint có dạng [x, y]

    //tính tọa độ thực của điểm trái dưới và phải trên của cửa sổ

    // Lấy các điểm xác định mặt tường
    const p0 = facePoints[0];
    const p1 = facePoints[1];
    const p3 = facePoints[3];

    // Tính các vector chiều ngang và chiều dọc của mặt tường
    const wallWidthVector = [
        p3[0] - p0[0],
        p3[1] - p0[1],
        p3[2] - p0[2]
    ];

    const wallHeightVector = [
        p1[0] - p0[0],
        p1[1] - p0[1],
        p1[2] - p0[2]
    ];

    // Tính tỷ lệ từ hệ tọa độ unit x unit sang hệ tọa độ thực của mặt tường
    const scaleX = 1 / unit;
    const scaleY = 1 / unit;

    //tạo hàm chuyển đổi từ hệ toạ độ unit x unit sang hệ tọa độ thực
    function ConvertWindowPointToReal(point) {
        return [
            p0[0] + point[0] * wallWidthVector[0] * scaleX + point[1] * wallHeightVector[0] * scaleY,
            p0[1] + point[0] * wallWidthVector[1] * scaleX + point[1] * wallHeightVector[1] * scaleY,
            p0[2] + point[0] * wallWidthVector[2] * scaleX + point[1] * wallHeightVector[2] * scaleY,
        ];
    }

    //tính tọa độ thực của cửa sổ
    const realWindowBottomLeftPoint = ConvertWindowPointToReal(windowBottomLeftPoint);
    const realWindowTopRightPoint = ConvertWindowPointToReal(windowTopRightPoint);

    let height = realWindowTopRightPoint[2] - realWindowBottomLeftPoint[2];

    let windowPoints = [
        realWindowBottomLeftPoint,
        [realWindowTopRightPoint[0], realWindowTopRightPoint[1], realWindowBottomLeftPoint[2]],
    ];

    let normalVector = GetNormalVector(facePoints);

    function SplitToBottomPoint(windowPoints){
        let bottomPoints = [];
        for (let i = 0; i < windowPoints.length; i++) {
            bottomPoints.push([
                windowPoints[i][0]+ normalVector[0] * 0.000001,
                windowPoints[i][1]+ normalVector[1] * 0.000001,
                windowPoints[i][2] + normalVector[2] * 0.000001,
            ]);
        }

        for (let i = windowPoints.length - 1; i >= 0; i--) {
            bottomPoints.push([
                windowPoints[i][0] - normalVector[0] * 0.000001,
                windowPoints[i][1] - normalVector[1] * 0.000001,
                windowPoints[i][2] - normalVector[2] * 0.000001,
            ]);
        }

        return bottomPoints;
    }
    
    let bottomPoints = SplitToBottomPoint(windowPoints);

    RenderCylindner(bottomPoints, height, windowColor, true, true, true);
}

const drawLongWallWindowFloor = (elevation, windowWidth, windowHeight, unit, facePoint, windowColor) => {
    let gap = (unit - 8*windowWidth)/4
    let xWindow = gap;
    let yWindow = elevation;

    for (let i = 0; i < 3; i++) {
        RenderWindowOnWallFace(
            facePoints = facePoint,
            windowBottomLeftPoint = [yWindow, xWindow],
            windowTopRightPoint = [yWindow + windowHeight, xWindow + windowWidth],
            unit = 100,
            windowColor = windowColor
        )

        xWindow += windowWidth;
    }

    xWindow += gap;
    for (let i = 0; i < 2; i++) {
        RenderWindowOnWallFace(
            facePoints = facePoint,
            windowBottomLeftPoint = [yWindow, xWindow],
            windowTopRightPoint = [yWindow + windowHeight, xWindow + windowWidth],
            unit = 100,
            windowColor = windowColor
        )

        xWindow += windowWidth;
    }

    xWindow += gap;
    for (let i = 0; i < 3; i++) {
        RenderWindowOnWallFace(
            facePoints = facePoint,
            windowBottomLeftPoint = [yWindow, xWindow],
            windowTopRightPoint = [yWindow + windowHeight, xWindow + windowWidth],
            unit = 100,
            windowColor = windowColor
        )

        xWindow += windowWidth;
    }
}

const drawShortWallWindowFloor = (elevation, windowWidth, windowHeight, unit, facePoint, windowColor) => {
    let gap = (unit - 3*windowWidth)/2
    let xWindow = gap;
    let yWindow = elevation;

    for (let i = 0; i < 3; i++) {
        RenderWindowOnWallFace(
            facePoints = facePoint,
            windowBottomLeftPoint = [yWindow, xWindow],
            windowTopRightPoint = [yWindow + windowHeight, xWindow + windowWidth],
            unit = 100,
            windowColor = windowColor
        )

        xWindow += windowWidth;
    }
}

function RenderRailing(firstPoint, secondPoint, height, weight, railCount, color){

    let bottomPoints = LineToPolygon(firstPoint, secondPoint, 0.000001);
    let midPoints = bottomPoints.map(point => [point[0], point[1], point[2] + height/2]);
    let topPoints = bottomPoints.map(point => [point[0], point[1], point[2] + height]);

    RenderCylindner(bottomPoints, weight, color, true, true, true);
    RenderCylindner(midPoints, weight, color, true, true, true);
    RenderCylindner(topPoints, weight, color, true, true, true);

    
}

function LineToPolygon(firstPoint, secondPoint, width) {
    let normalVector = [
        secondPoint[1] - firstPoint[1],
        firstPoint[0] - secondPoint[0],
    ]

    let length = Math.sqrt(normalVector[0] * normalVector[0] + normalVector[1] * normalVector[1]);

    normalVector[0] /= length;
    normalVector[1] /= length;

    let bottomPoints = [];

    bottomPoints.push([
        firstPoint[0] + normalVector[0] * width,
        firstPoint[1] + normalVector[1] * width,
        firstPoint[2],
    ]);

    bottomPoints.push([
        secondPoint[0] + normalVector[0] * width,
        secondPoint[1] + normalVector[1] * width,
        secondPoint[2],
    ]);

    bottomPoints.push([
        secondPoint[0] - normalVector[0] * width,
        secondPoint[1] - normalVector[1] * width,
        secondPoint[2],
    ]);

    bottomPoints.push([
        firstPoint[0] - normalVector[0] * width,
        firstPoint[1] - normalVector[1] * width,
        firstPoint[2],
    ]);

    bottomPoints.push(bottomPoints[0]);

    return bottomPoints;

}