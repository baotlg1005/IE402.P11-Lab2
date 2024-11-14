
function GenerateCurveLine(leftPoint, rightPoint, color, deg, delta, direction) {
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

    RenderPoint(leftPoint, [0, 255, 0])
    RenderPoint(rightPoint, [0, 255, 0])

    RenderPoint(root, [255, 255, 0])

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

function GenerateCircle(firstPoint, secondPoint, thirdPoint, delta) {
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

function GenerateCircleWithRadius(center, radius, delta) {
    const points = [];
    const angleIncrement = (360 / delta) * (Math.PI / 180); // Chuyển đổi từ độ sang radian

    for (let i = 0; i < delta; i++) {
        const angle = i * angleIncrement;
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);

        points.push([x, y, center[2]]);
    }

    points.push(points[0]);
    return points;

}

function GenerateSquare(center, width, height, rotateDeg = 0) {
    let z = center[2];

    let halfWidth = width / 2;
    let halfHeight = height / 2;

    let topLeft = [center[0] - halfWidth, center[1] + halfHeight, z];
    let topRight = [center[0] + halfWidth, center[1] + halfHeight, z];
    let bottomRight = [center[0] + halfWidth, center[1] - halfHeight, z];
    let bottomLeft = [center[0] - halfWidth, center[1] - halfHeight, z];

    let square = [topLeft, topRight, bottomRight, bottomLeft, topLeft];

    if (rotateDeg != 0) {
        square = RotatePolygon(square, center, rotateDeg);
    }

    return square;
}

function SplitSquare(squareListPoint) {
    //split square into 4 smaller squares
    let TopLeftSquare;
    let TopRightSquare;
    let BottomLeftSquare;
    let BottomRightSquare;

    let topLeft = squareListPoint[0];
    let topRight = squareListPoint[1];
    let bottomRight = squareListPoint[2];
    let bottomLeft = squareListPoint[3];

    let midTop = MidPoint(topLeft, topRight);
    let midRight = MidPoint(topRight, bottomRight);
    let midBottom = MidPoint(bottomRight, bottomLeft);
    let midLeft = MidPoint(bottomLeft, topLeft);
    let center = MidPoint(topLeft, bottomRight);

    TopLeftSquare = [center, midLeft, topLeft, midTop, center];
    TopRightSquare = [center, midTop , topRight, midRight, center];
    BottomRightSquare = [center, midRight, bottomRight, midBottom, center];
    BottomLeftSquare = [center, midBottom, bottomLeft, midLeft, center];


    return [TopLeftSquare, TopRightSquare, BottomLeftSquare, BottomRightSquare]
}

function AddPointToSquare(squarePoint, listPoint, newPoint, index = -1) {
    // Lấy các điểm xác định mặt tường
    const p0 = squarePoint[0];
    const p1 = squarePoint[1];
    const p3 = squarePoint[3];

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
    const scaleX = 1 / 100;
    const scaleY = 1 / 100;

    //tạo hàm chuyển đổi từ hệ toạ độ unit x unit sang hệ tọa độ thực
    function ConvertWindowPointToReal(point) {
        return [
            p0[0] + point[0] * wallWidthVector[0] * scaleX + point[1] * wallHeightVector[0] * scaleY,
            p0[1] + point[0] * wallWidthVector[1] * scaleX + point[1] * wallHeightVector[1] * scaleY,
            p0[2] + point[0] * wallWidthVector[2] * scaleX + point[1] * wallHeightVector[2] * scaleY,
        ];
    }

    // Tính tọa độ thực của điểm mới
    const realPoint = ConvertWindowPointToReal(newPoint);

    // Thêm điểm mới vào danh sách vao phia sau index
    if (index == -1) {
        listPoint.push(realPoint);
    } else {
        listPoint.splice(index, 0, realPoint);
    }

    return listPoint;
}

function RotatePolygon(listPoint, center, deg) {
    let z = center[2];

    center = {
        x: center[0],
        y: center[1]
    }

    listPoint = listPoint.map(point => {
        return {
            x: point[0],
            y: point[1]
        }
    })

    // Chuyển góc từ độ sang radian
    const rad = (deg * Math.PI) / 180;

    // Mảng lưu các điểm đã xoay
    let rotatedPoints = [];

    // Duyệt qua từng điểm trong listPoint
    for (let i = 0; i < listPoint.length; i++) {
        let P = listPoint[i]; // Lấy điểm thứ i

        // Tính vector từ trung tâm đến điểm P
        let v = {
            x: P.x - center.x,
            y: P.y - center.y
        };

        // Tính tọa độ mới của điểm P sau khi xoay
        let x = center.x + v.x * Math.cos(rad) - v.y * Math.sin(rad);
        let y = center.y + v.x * Math.sin(rad) + v.y * Math.cos(rad);

        // Thêm điểm mới vào mảng kết quả
        rotatedPoints.push([x, y, z]);
    }

    return rotatedPoints;

}

function MidPoint(pointA, pointB) {

    let z = pointA[2];

    pointA =
    {
        x: pointA[0],
        y: pointA[1]
    }

    pointB = {
        x: pointB[0],
        y: pointB[1]
    }

    // Tính tọa độ trung điểm
    let x_m = (pointA.x + pointB.x) / 2;
    let y_m = (pointA.y + pointB.y) / 2;

    // Trả về trung điểm dưới dạng đối tượng
    return [x_m, y_m, z];
}

function ReflectPointsAcrossLine(pointsToReflect, lineStartPoint, lineEndPoint) {

    let z = lineStartPoint[2]

    lineStartPoint = {
        x: lineStartPoint[0],
        y: lineStartPoint[1]
    }

    lineEndPoint = {
        x: lineEndPoint[0],
        y: lineEndPoint[1]
    }

    //for each item in listPoint
    pointsToReflect = pointsToReflect.map(point => {
        return {
            x: point[0],
            y: point[1]
        }
    })

    // Tính vector chỉ phương của đường thẳng
    let v = {
        x: lineEndPoint.x - lineStartPoint.x,
        y: lineEndPoint.y - lineStartPoint.y
    };

    // Mảng để lưu các điểm phản chiếu
    let reflectedPoints = [];

    // Lặp qua từng điểm trong listPoint
    for (let i = 0; i < pointsToReflect.length; i++) {
        let P = pointsToReflect[i]; // Điểm cần chiếu

        // Tính vector từ topReflectPoint đến điểm P
        let w = {
            x: P.x - lineStartPoint.x,
            y: P.y - lineStartPoint.y
        };

        // Tính tỉ lệ chiếu (dot product)
        let t = (w.x * v.x + w.y * v.y) / (v.x * v.x + v.y * v.y);

        // Tính điểm chiếu Q trên đường thẳng
        let Q = {
            x: lineStartPoint.x + t * v.x,
            y: lineStartPoint.y + t * v.y
        };

        // Tính điểm phản chiếu R đối xứng với Q qua đường thẳng
        let R = {
            x: 2 * Q.x - P.x,
            y: 2 * Q.y - P.y
        };

        // Thêm điểm phản chiếu vào mảng kết quả
        reflectedPoints.push(R);
    }

    reflectedPoints = reflectedPoints.map(point => {
        return [point.x, point.y, z]
    });

    return reflectedPoints;
}

function ResizePolygon(listPoint, ratio) {
    let centroid = GetCentroid(listPoint);

    centroid = {
        x: centroid[0],
        y: centroid[1],
        z: centroid[2],
    }

    listPoint = listPoint.map(point => {
        return {
            x: point[0],
            y: point[1],
            z: point[2],
        }
    })

    // Mảng lưu các điểm đã resize
    let resizedPoints = [];

    // Resize từng điểm
    for (let i = 0; i < listPoint.length; i++) {
        let P = listPoint[i];

        // Tính điểm mới bằng công thức resize
        let newPoint = {
            x: centroid.x + ratio * (P.x - centroid.x),
            y: centroid.y + ratio * (P.y - centroid.y),
            z: centroid.z + ratio * (P.z - centroid.z)
        };

        resizedPoints.push([
            newPoint.x,
            newPoint.y,
            newPoint.z
        ]);
    }

    return resizedPoints;
}

function MovePolygon(listPoint, newCenter) {
    let centroid = GetCentroid(listPoint);

    centroid = {
        x: centroid[0],
        y: centroid[1],
        z: centroid[2],
    }

    newCenter = {
        x: newCenter[0],
        y: newCenter[1],
        z: newCenter[2],
    }

    listPoint = listPoint.map(point => {
        return {
            x: point[0],
            y: point[1],
            z: point[2],
        }
    })

    // Tính vector dịch chuyển (newCenter - centroid)
    let offset = {
        x: newCenter.x - centroid.x,
        y: newCenter.y - centroid.y,
        z: newCenter.z - centroid.z
    };

    // Mảng lưu các điểm đã dịch chuyển
    let movedPoints = [];

    // Dịch chuyển từng điểm
    for (let i = 0; i < listPoint.length; i++) {
        let P = listPoint[i];

        // Dịch chuyển điểm P theo vector dịch chuyển
        let newPoint = {
            x: P.x + offset.x,
            y: P.y + offset.y,
            z: P.z + offset.z
        };

        movedPoints.push([
            newPoint.x,
            newPoint.y,
            newPoint.z
        ]);
    }

    newCenter = [newCenter.x, newCenter.y, newCenter.z];

    return movedPoints;
}

function GetCentroid(listPoint) {
    listPoint = listPoint.map(point => {
        return {
            x: point[0],
            y: point[1],
            z: point[2],
        }
    })

    // Tính toán trung điểm (centroid) của đa giác
    let centroid = { x: 0, y: 0, z: 0 };

    // Tính tổng các tọa độ điểm
    for (let i = 0; i < listPoint.length; i++) {
        centroid.x += listPoint[i].x;
        centroid.y += listPoint[i].y;
        centroid.z += listPoint[i].z
    }

    // Tính trung điểm
    centroid.x /= listPoint.length;
    centroid.y /= listPoint.length;
    centroid.z /= listPoint.length;

    centroid = [centroid.x, centroid.y, centroid.z];

    return centroid;
}

function GetCentroidDistance(listPoint) {
    centroid = GetCentroid(listPoint);

    centroid = {
        x: centroid[0],
        y: centroid[1],
        z: centroid[2],
    }

    //find shortest distance from centroid to points

    let minDistance = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < listPoint.length; i++) {
        let point = listPoint[i];

        let distance = Math.sqrt(
            (point[0] - centroid.x) ** 2 +
            (point[1] - centroid.y) ** 2 +
            (point[2] - centroid.z) ** 2
        );

        if (distance < minDistance) {
            minDistance = distance;
        }
    }

    centroid = [centroid.x, centroid.y, centroid.z];

    return minDistance;
}

function GetDistance(pointA, pointB) {
    return Math.sqrt(
        (pointA[0] - pointB[0]) ** 2 +
        (pointA[1] - pointB[1]) ** 2 +
        (pointA[2] - pointB[2]) ** 2
    );
}

function GetNormalVector(facePoints) {
    // Kiểm tra đầu vào có ít nhất 3 điểm
    if (facePoints.length < 3) {
        throw new Error("Cần ít nhất 3 điểm để tính vector pháp tuyến.");
    }

    // Lấy ba điểm đầu tiên của mảng
    const p0 = facePoints[0];
    const p1 = facePoints[1];
    const p2 = facePoints[2];

    // Tạo hai vector từ các điểm
    const v1 = [
        p1[0] - p0[0],
        p1[1] - p0[1],
        p1[2] - p0[2]
    ];

    const v2 = [
        p2[0] - p0[0],
        p2[1] - p0[1],
        p2[2] - p0[2]
    ];

    // Tích chéo của v1 và v2 để tìm vector pháp tuyến
    const normal = [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
    ];

    // Tính độ dài của vector pháp tuyến
    const length = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);

    // Normalize vector pháp tuyến
    return [
        normal[0] / length,
        normal[1] / length,
        normal[2] / length
    ];
}