function AddPoint(point, color = [226, 119, 40]) {
    //add point to jsondata points
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

function AddCircleWithCenter(centerPoint, radius, delta) {
    const points = [];
    const angleIncrement = (360 / delta) * (Math.PI / 180); // Chuyển đổi từ độ sang radian

    for (let i = 0; i < delta; i++) {
        const angle = i * angleIncrement;
        const x = centerPoint[0] + radius * Math.cos(angle);
        const y = centerPoint[1] + radius * Math.sin(angle);

        points.push([x, y, centerPoint[2]]);
    }

    points.push(points[0]);

    //AddPoint(centerPoint, [0,255,255])
    //AddPolygon(points);
}

function AddCircleWithThreePoint(firstPoint, secondPoint, thirdPoint, delta, color = [0,0,0]) {

    points = CreateCircleWithThreePoint(firstPoint, secondPoint, thirdPoint, delta);
    AddPolygon(points, color);
}

function AddCylinder(firstPoint, secondPoint, thirdPoint, delta, height, color = [0,0,0]){
    bottomPoint = CreateCircleWithThreePoint(firstPoint, secondPoint, thirdPoint, delta);

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

        AddPolygon(ring, color);
    }

}

function CreateCurveLine(leftPoint, rightPoint, color, deg, delta, direction) {
    function findPointO(A, B, deg, direction) {
        // Chuyển góc từ độ sang radian
        const rad = (deg * Math.PI) / 180;

        A = {
            x: A[0],
            y: A[1],
            z: A[2]
        }

        B = {
            x: B[0],
            y: B[1],
            z: B[2]
        }

        // Tính trung điểm của A và B
        const M = {
            x: (A.x + B.x) / 2,
            y: (A.y + B.y) / 2
        };

        // Tính khoảng cách từ A đến M
        const AM = Math.sqrt((A.x - M.x) ** 2 + (A.y - M.y) ** 2);

        // Tính khoảng cách từ M đến O
        const MO = AM / Math.tan(rad / 2);

        // Vector AB
        const AB = {
            x: B.x - A.x,
            y: B.y - A.y
        };

        // Vector vuông góc với AB để tính tọa độ O
        const perpendicular = {
            x: -AB.y,
            y: AB.x
        };

        // Chuẩn hóa vector vuông góc
        const length = Math.sqrt(perpendicular.x ** 2 + perpendicular.y ** 2);
        perpendicular.x /= length;
        perpendicular.y /= length;

        // Tìm điểm O bằng cách đi từ M theo hướng của vector vuông góc
        let O1 = {
            x: M.x + MO * perpendicular.x,
            y: M.y + MO * perpendicular.y
        };
        let O2 = {
            x: M.x - MO * perpendicular.x,
            y: M.y - MO * perpendicular.y
        };

        let O;

        if (direction) O = O1;
        else O = O2

        O = [
            O.x,
            O.y,
            A.z
        ]

        return O;
    }

    let root = findPointO(leftPoint, rightPoint, deg)

    AddPoint(leftPoint, [0, 255, 0])
    AddPoint(rightPoint, [0, 255, 0])

    AddPoint(root, [255, 255, 0])

    let listPoint = [];
    listPoint.push(leftPoint)

    let z = leftPoint[2];

    // đường cong về phía root
    for (let i = 0; i < delta; i++) {

        let t = i / delta;
        let x = (1 - t) * (1 - t) * leftPoint[0] + 2 * (1 - t) * t * root[0] + t * t * rightPoint[0];
        let y = (1 - t) * (1 - t) * leftPoint[1] + 2 * (1 - t) * t * root[1] + t * t * rightPoint[1];

        listPoint.push([x, y, z]);
    }

    listPoint.push(rightPoint);
    return listPoint;
}

function CreateCircleWithThreePoint(firstPoint, secondPoint, thirdPoint, delta){
        // Hàm tính trung điểm của hai điểm
        function midpoint(P, Q) {
            return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
        }
    
        // Hàm tính độ dốc của một đoạn thẳng
        function slope(P, Q) {
            return (Q[1] - P[1]) / (Q[0] - P[0]);
        }
    
        // Hàm tìm giao điểm của hai đường thẳng
        function intersection(m1, b1, m2, b2) {
            const x = (b2 - b1) / (m1 - m2);
            const y = m1 * x + b1;
            return [x, y];
        }
    
        // Tính trung điểm và độ dốc của các đoạn thẳng
        const midAB = midpoint(firstPoint, secondPoint);
        const midBC = midpoint(secondPoint, thirdPoint);
    
        const slopeAB = slope(firstPoint, secondPoint);
        const slopeBC = slope(secondPoint, thirdPoint);
    
        // Tính độ dốc của đường trung trực (nghịch đảo và đổi dấu)
        const perpSlopeAB = -1 / slopeAB;
        const perpSlopeBC = -1 / slopeBC;
    
        // Tìm giao điểm của hai đường trung trực (tâm của đường tròn)
        const center = intersection(
            perpSlopeAB,
            midAB[1] - perpSlopeAB * midAB[0],
            perpSlopeBC,
            midBC[1] - perpSlopeBC * midBC[0]
        );
    
        // Tính bán kính (khoảng cách từ tâm đến bất kỳ điểm nào trong ba điểm đã cho)
        const radius = Math.sqrt(
            (center[0] - firstPoint[0]) ** 2 + (center[1] - firstPoint[1]) ** 2
        );
        console.log("radius:" + radius);
    
        // Tạo các điểm trên đường tròn
        const points = [];
        for (let i = 0; i < delta; i++) {
            const angle = (2 * Math.PI * i) / delta;
            const x = center[0] + radius * Math.cos(angle);
            const y = center[1] + radius * Math.sin(angle);
            points.push([x, y, firstPoint[2]]);
        }
    
        points.push(points[0]);
    
        return points;
}