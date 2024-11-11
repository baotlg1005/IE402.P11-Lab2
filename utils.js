function AddPoint(x, y, z) {
    //add point to jsondata points
    jsondata.points.push({
        type: "point",
        x: x,
        y: y,
        z: z,
        symbol: {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        },
    });
}

function AddPolyline(listPoint, color) {
    //add polyline to jsondata polyline
    jsondata.polyline.push({
        type: "polyline",
        paths: listPoint,
        symbol: {
            type: "simple-line",
            color: color,
            width: 4
        }
    });
}

function AddPolygon(listRing, color) {
    //add polygon to jsondata polygons
    jsondata.polygons.push({
        type: "polygon",
        rings: listRing,
        symbol: {
            type: "simple-fill",
            color: color,
            outline: null
        }
    });
}

function AddWallWithWindow(outerPoint, innerPoint, color = [255, 255, 255]) {
    ring = outerPoint;
    ring.push(outerPoint[0]);

    ring = [...ring, ...innerPoint.reverse()];

    ring.push(innerPoint[0]);

    AddPolygon(ring, color);
}

function AddCurveWall(listPoint, color, deg, delta, direction) {

    let top = CreateCurveLine(listPoint[0], listPoint[1], color, deg, delta, direction);
    let bottom = CreateCurveLine(listPoint[3], listPoint[2], color, deg, delta, direction);

    AddPolyline(top, [0, 0, 0]);
    AddPolyline(bottom, [0, 0, 0]);

    rings = [];

    for (let i = top.length - 1; i > 0; i--) {
        let ring = [top[i], top[i - 1], bottom[i - 1], bottom[i], top[i]];

        AddPolygon(ring, color);
    }
}

function CreateCurveLine(leftPoint, rightPoint, color, deg, delta, direction) {

    // Chuyển đổi góc deg thành radian
    let rad = deg * Math.PI / 180;

    // Tính toán khoảng cách giữa left và right
    let dx = rightPoint[0] - leftPoint[0];
    let dy = rightPoint[1] - leftPoint[1];
    let distance = Math.sqrt(dx * dx + dy * dy);

    const d = distance / (2 * Math.sin(rad / 2));

    // Tính tọa độ trung điểm của left và right
    let midX = (leftPoint[0] + rightPoint[0]) / 2;
    let midY = (leftPoint[1] + rightPoint[1]) / 2;

    // Tính vector vuông góc với vector AB
    const perpDx = -dy;
    const perpDy = dx;

    // Chuẩn hóa vector vuông góc
    const len = Math.sqrt(perpDx * perpDx + perpDy * perpDy);
    const ux = perpDx / len;
    const uy = perpDy / len;

    let root = [0,0,leftPoint[2]];

    //toạ độ góc
    if (direction = true) {
        root[0] = midX + d * ux;
        root[1] = midY + d * uy;
    } else {
        root[0] = midX - d * ux;
        root[1] = midY - d * uy;
    }

    // Tính tọa độ các điểm trên đường cong
    let listPoint = [];

    let z = leftPoint[2];

    AddPoint(leftPoint[0], leftPoint[1], leftPoint[2]);
    AddPoint(rightPoint[0], rightPoint[1], rightPoint[2]);
    AddPoint(root[0], root[1], leftPoint[2]);

    for (let i = 0; i < delta; i++) {

        let t = i / delta;
        let x = (1 - t) * (1 - t) * leftPoint[0] + 2 * (1 - t) * t * root[0] + t * t * rightPoint[0];
        let y = (1 - t) * (1 - t) * leftPoint[1] + 2 * (1 - t) * t * root[1] + t * t * rightPoint[1];

        

        listPoint.push([x, y, z]);
    }

    listPoint.push(rightPoint);	

    return listPoint;
}

