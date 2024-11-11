// Khai báo biến toàn cục để lưu điểm gốc và vectơ đơn vị
let newOrigin = [0, 0, 0];  // điểm gốc của hệ tọa độ mới
let newUnitVector = [1, 0, 0];  // vectơ đơn vị của hệ tọa độ mới

// Hàm setup hệ tọa độ mới với điểm gốc rootPoint và vectơ đơn vị unitPoint
function SetupNewCoordinate(rootPoint, unitPoint) {
    // Lưu lại điểm gốc và vectơ đơn vị
    newOrigin = rootPoint;
    newUnitVector = normalize(unitPoint);  // Chuẩn hóa vectơ đơn vị
}

// Hàm chuẩn hóa một vectơ (tính độ dài và chia cho độ dài)
function normalize(vect) {
    const length = Math.sqrt(vect[0] * vect[0] + vect[1] * vect[1] + vect[2] * vect[2]);
    return [vect[0] / length, vect[1] / length, vect[2] / length];
}

// Hàm chuyển từ hệ tọa độ tuyệt đối sang hệ tọa độ mới
function funcChangeToNewCoordinate(point) {
    // Tính điểm tương đối trong hệ tọa độ mới
    const relativePoint = [
        point[0] - newOrigin[0],
        point[1] - newOrigin[1],
        point[2] - newOrigin[2]
    ];

    // Chiếu điểm vào vectơ đơn vị của hệ tọa độ mới
    const newCoord = dotProduct(relativePoint, newUnitVector);
    return newCoord;
}

// Hàm tính tích vô hướng giữa hai vectơ
function dotProduct(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

// Hàm chuyển từ hệ tọa độ mới về hệ tọa độ tuyệt đối
function ChangeToOldCoordinate(point) {
    // Tính lại tọa độ trong hệ tọa độ tuyệt đối
    const oldCoord = [
        newOrigin[0] + point * newUnitVector[0],
        newOrigin[1] + point * newUnitVector[1],
        newOrigin[2] + point * newUnitVector[2]
    ];
    return oldCoord;
}

// Ví dụ sử dụng các hàm:

// Khởi tạo hệ tọa độ mới
SetupNewCoordinate([10.870015767286764, 106.80284997218187, 0], [10.87006647339033, 106.80290361635979, 0]);

// Chuyển tọa độ từ hệ tọa độ tuyệt đối sang hệ tọa độ mới
const newCoord = funcChangeToNewCoordinate([10.87006647339033, 106.80290361635979, 0]);
console.log("Tọa độ mới:", newCoord);

// Chuyển tọa độ từ hệ tọa độ mới về hệ tọa độ tuyệt đối
const oldCoord = ChangeToOldCoordinate(newCoord);
console.log("Tọa độ tuyệt đối:", oldCoord);
