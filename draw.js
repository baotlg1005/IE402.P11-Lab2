let jsondata = {
    points: [
    ],
    polygons: [
    ],
    polyline: [
    ]
}

//#region Thông số nền
let floorColor = [128, 128, 128];
let floorHeight = 1;
//#endregion

//#region Thông số tường toà chính
let wallColor = [192, 192, 192];
let wallHeight = 30;
//#endregion

let listPoints; // Danh sách các điểm của đa giác
let centroid; // trung tâm của đa giác
let height;

function Draw() {
 
    //#region Toà chính

    //nền toà chính
    let mainListPoints = [
        [106.8030560874776, 10.870016633584468, 30],
        [106.80300378440316, 10.870067998208661, 30],
        [106.80290320156769, 10.870066681167124, 30],
        [106.80284955738875, 10.870016633584468, 30],
        [106.80268864649587, 10.870172634116262, 30],
        [106.80274356096164, 10.870228210216723, 30],
        [106.80274356096164, 10.870323037141057, 30],
        [106.80269058733496, 10.870375060232586, 30],

        [106.80283584083789, 10.870525407976633, 30],
        [106.80288965833641, 10.870474258352703, 30],
        [106.80298442895158, 10.870477525780004, 30],
        [106.80303807987654, 10.870534322608634, 30],
        [106.80319953223952, 10.87037888253703, 30],
        [106.80315136277952, 10.870323545735676, 30],
        [106.8031535122773, 10.870222977246332, 30],
        [106.80320664859447, 10.870172475087818, 30],

        [106.8030560874776, 10.870016633584468, 30],
    ]

    // vẽ nền toà chính
    RenderCylindner(
        bottomPoints = mainListPoints,
        height = floorHeight,
        color = floorColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )

    // tường phía tây
    let mainWallWestPoints = [
        [106.80290320156769, 10.870066681167124, 30],
        [106.80284955738875, 10.870016633584468, 30],
        [106.80268864649587, 10.870172634116262, 30],
        [106.80274356096164, 10.870228210216723, 30],

        [106.80290320156769, 10.870066681167124, 30],
    ]

    centroid = GetCentroid(mainWallWestPoints); // lấy tọa độ trung tâm của nền tường
    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + floorHeight
    ] // cộng thêm chiều cao của nền vào tọa độ trung tâm - nói cách khác là nâng tường lên 1 đơn vị để tường không bị chồng lên nền

    mainWallWestPoints = MovePolygon(
        listPoints = mainWallWestPoints,
        newCenter = centroid
    ); // di chuyển tường về trung tâm mới

    //vẽ các mặt tường
    [northFacePoint, eastFacePoint, southFacePoint, westFacePoint] = RenderWall(
        bottomPoints = mainWallWestPoints,
        height = wallHeight,
        color = wallColor,
        filled = true,
        have_outline = true,
        have_filled_outline = true
    )

    // thêm cửa sổ vào mặt tường phía tây - cửa sổ có màu vàng
    RenderWindowOnWallFace(
        facePoints = westFacePoint,
        windowBottomLeftPoint = [10, 10],
        windowTopRightPoint = [20, 20],
        unit = 100,
        windowColor = [255, 255, 0]
    )

    //thêm cửa sổ vào mặt tường phía bắc
    RenderWindowOnWallFace(
        facePoints = northFacePoint,
        windowBottomLeftPoint = [10, 10],
        windowTopRightPoint = [20, 20],
        unit = 100,
        windowColor = [255, 255, 0]
    )
    

    //#endregion
    
    //#region Toà thư viện
    let libraryListPoints = [
        [106.80288568667955, 10.870770202191375, 30],
        [106.80295542411216, 10.870840005220142, 30],
        [106.80299431614188, 10.870800494073794, 30],
        [106.80307679406697, 10.87080312815038, 30],
        [106.80311635664893, 10.870841980777332, 30],
        [106.80319279960389, 10.870766251076052, 30],
        [106.8031545781264, 10.870727398439241, 30],
        [106.80315591923087, 10.870648376111486, 30],
        [106.80319491772669, 10.87061103626323, 30],
        [106.80311981587619, 10.870537282062527, 30],

        [106.80308313689338, 10.870573744828032, 30],
        [106.80300410578818, 10.870573103535934, 30],
        [106.8029662240142, 10.870533919611557, 30],
        [106.80288860085525, 10.870608439127217, 30],
        [106.80292644898286, 10.870648963733922, 30],
        [106.80292701358562, 10.870731481778677, 30],
        [106.80288568667955, 10.870770202191375, 30]
    ]


    RenderCylindner(
        bottomPoints = libraryListPoints,
        height = floorHeight,
        color = floorColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )
    //#endregion

    //#region Đường nối
    //#region nền
    listPoints = [
        [106.8028731133926, 10.870490017143165, 30],
        [106.80294270819674, 10.870556511108466, 30],
        [106.8029662240142, 10.870533919611557, 30],
        [106.80300410578818, 10.870573103535934, 30],
        [106.80308313689338, 10.870573744828032, 30],
        [106.80310134845536, 10.870555909033689, 30],
        [106.80305746132825, 10.870515379565651, 30],
        [106.80303807987654, 10.870534322608634, 30],
        [106.80298442895158, 10.870477525780004, 30],
        [106.80288965833641, 10.870474258352703, 30],
        [106.8028731133926, 10.870490017143165, 30]
    ]

    RenderPolygon(
        listPoints = listPoints,
        color = [128, 128, 128],
        have_outline = true
    )

    //#endregion
    //#endregion
}