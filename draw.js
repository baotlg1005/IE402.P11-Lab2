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
let wallHeight = 25;
//#endregion

//#region Thông số cửa sổ
let windowColor = [218, 218, 218];
//#endregion

//#region Thông số tầng 1
let mainStructureHeight = 7;
let mainStructureColor = [128, 0, 0];
//#endregion

//#region Thông số tầng 2
let secondFloorHeight = 8;
let secondFloorZPos = 8;
//endregion

//#region Thông số tầng 3
let thirdFloorHeight = 8;
let thirdFloorZPos = 16;
//endregion

//#region Thông số phòng hội trường
let auditoriumColor = [128, 0, 0];
let auditoriumZPos = secondFloorZPos + floorHeight;
let auditoriumHeight = wallHeight - auditoriumZPos;
let auditoriumRadiusRatio = 0.4;
//#endregion

//#region Thông số trần nhà
let ceilingColor = [255, 165, 0];
let ceilingHeight = 3;
let ceilingZPos = wallHeight + 1;
let centerColor = [0, 0, 128];
let centerHeight = 1;
let centerRadiusRatio = 0.4;
//#endregion

//#region thong so thu vien
let libraryWallHeight = 20;
let libraryCeilingZPos = libraryWallHeight + floorHeight;
let libraryCeilingHeight = 3;
let libraryCenterHeight = 1;

//#endregion



let listPoints; // Danh sách các điểm của đa giác
let centroid; // trung tâm của đa giác
let height;

let mainCentroid; // trung tâm của toà chính

function Render() {

    DrawMainBuilding();

    DrawLibrary();

    DrawConnector();



}

function DrawMainBuilding() {
    let mainListPoints = [
        [106.8030560874776, 10.870016633584468, 30],//
        [106.80300378440316, 10.870067998208661, 30],//
        [106.80290320156769, 10.870066681167124, 30],
        [106.80284955738875, 10.870016633584468, 30],
        [106.80268864649587, 10.870172634116262, 30],
        [106.80274356096164, 10.870228210216723, 30],
        [106.80274356096164, 10.870323037141057, 30],//
        [106.80269058733496, 10.870375060232586, 30],//

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
    mainCentroid = GetCentroid(
        [
            mainListPoints[0],
            mainListPoints[4],
            mainListPoints[8],
            mainListPoints[12]
        ]
    ); 

    // vẽ nền toà chính
    RenderCylindner(
        bottomPoints = mainListPoints,
        height = floorHeight,
        color = floorColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )

    RenderMainBuildingWalls();

    RenderCenterStructure(mainListPoints, mainCentroid);
    

    //#region sàn tầng 2
    let secondFloorListPoints = mainListPoints.slice()

    centroid = GetCentroid(secondFloorListPoints); // lấy tọa độ trung tâm của nền tường
    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + secondFloorZPos 
    ]

    secondFloorListPoints = MovePolygon(
        listPoints = secondFloorListPoints,
        newCenter = centroid
    ); // di chuyển tường về trung tâm mới


    let mainSecondFloorListPoints = secondFloorListPoints.slice();
    mainSecondFloorListPoints.splice(3, 1)
    mainSecondFloorListPoints.splice(3, 1)
    mainSecondFloorListPoints.splice(5, 1)
    mainSecondFloorListPoints.splice(5, 1)
    mainSecondFloorListPoints.splice(7, 1)
    mainSecondFloorListPoints.splice(7, 1)
    mainSecondFloorListPoints.splice(9, 1)
    mainSecondFloorListPoints.splice(9, 1)

    //remove first and last point
    mainSecondFloorListPoints.splice(0, 1)
    //add first point to last
    mainSecondFloorListPoints.push(mainSecondFloorListPoints[0])

    
    let secondFloorWallListPoints = mainListPoints.slice()    

    //mở rộng sàn tầng 2 để tạo ra mái che
    mainSecondFloorListPoints = ResizePolygon(mainSecondFloorListPoints, 1.1)

    RenderCylindner(
        bottomPoints = mainSecondFloorListPoints,
        height = floorHeight,
        color = floorColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true, // mặt đáy và nắp có viền đen hay không
    )

    //#endregion

    //#region tường tầng 2
    

    //#region render tường tầng 2
    let topLeftFaceBottomPoints = [
        secondFloorWallListPoints[9],
        secondFloorWallListPoints[10],
    ]

    let faceCenter = MidPoint(topLeftFaceBottomPoints[0], topLeftFaceBottomPoints[1])
    faceCenter = [
        faceCenter[0],
        faceCenter[1],
        faceCenter[2] + secondFloorZPos
    ]

    topLeftFaceBottomPoints = MovePolygon(
        listPoints = topLeftFaceBottomPoints,
        newCenter = faceCenter
    )


    let topLeftFacePoint =  RenderWallFace(
        bottomPoints = topLeftFaceBottomPoints,
        height = secondFloorHeight,
        color = wallColor,
        filled = true,
    )

    let topRightFaceBottomPoints = [
        secondFloorWallListPoints[13],
        secondFloorWallListPoints[14],
    ]

    faceCenter = MidPoint(topRightFaceBottomPoints[0], topRightFaceBottomPoints[1])
    faceCenter = [
        faceCenter[0],
        faceCenter[1],
        faceCenter[2] + secondFloorZPos
    ]

    topRightFaceBottomPoints = MovePolygon(
        listPoints = topRightFaceBottomPoints,
        newCenter = faceCenter
    )

    let topRightFacePoint =  RenderWallFace(
        bottomPoints = topRightFaceBottomPoints,
        height = secondFloorHeight,
        color = wallColor,
        filled = true,
    )

    let bottomLeftFaceBottomPoints = [
        secondFloorWallListPoints[5],
        secondFloorWallListPoints[6],
    ]

    faceCenter = MidPoint(bottomLeftFaceBottomPoints[0], bottomLeftFaceBottomPoints[1])

    faceCenter = [
        faceCenter[0],
        faceCenter[1],
        faceCenter[2] + secondFloorZPos
    ]

    bottomLeftFaceBottomPoints = MovePolygon(
        listPoints = bottomLeftFaceBottomPoints,
        newCenter = faceCenter
    )

    let bottomLeftFacePoint =  RenderWallFace(
        bottomPoints = bottomLeftFaceBottomPoints,
        height = secondFloorHeight,
        color = wallColor,
        filled = true,
    )

    let bottomRightFaceBottomPoints = [
        secondFloorWallListPoints[1],
        secondFloorWallListPoints[2],
    ]

    faceCenter = MidPoint(bottomRightFaceBottomPoints[0], bottomRightFaceBottomPoints[1])

    faceCenter = [
        faceCenter[0],
        faceCenter[1],
        faceCenter[2] + secondFloorZPos
    ]

    bottomRightFaceBottomPoints = MovePolygon(
        listPoints = bottomRightFaceBottomPoints,
        newCenter = faceCenter
    )

    let bottomRightFacePoint =  RenderWallFace(
        bottomPoints = bottomRightFaceBottomPoints,
        height = secondFloorHeight,
        color = wallColor,
        filled = true,
    )
    //#endregion

    //#region render cửa sổ tầng 2

    drawLongWallWindowFloor(38, 10, 20, 100, topLeftFacePoint, windowColor)
    drawLongWallWindowFloor(38, 10, 20, 100, topRightFacePoint, windowColor)
    drawLongWallWindowFloor(38, 10, 20, 100, bottomLeftFacePoint, windowColor)
    drawLongWallWindowFloor(38, 10, 20, 100, bottomRightFacePoint, windowColor)

    //#endregion

    //#endregion

    //#region sàn tầng 3
    let thirdFloorListPoints = mainListPoints.slice()

    centroid = GetCentroid(thirdFloorListPoints); // lấy tọa độ trung tâm của nền tường
    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + thirdFloorZPos
    ]

    thirdFloorListPoints = MovePolygon(
        listPoints = thirdFloorListPoints,
        newCenter = centroid
    ); // di chuyển tường về trung tâm mới

    let mainThirdFloorListPoints = thirdFloorListPoints.slice();
    mainThirdFloorListPoints.splice(3, 1)
    mainThirdFloorListPoints.splice(3, 1)
    mainThirdFloorListPoints.splice(5, 1)
    mainThirdFloorListPoints.splice(5, 1)
    mainThirdFloorListPoints.splice(7, 1)
    mainThirdFloorListPoints.splice(7, 1)
    mainThirdFloorListPoints.splice(9, 1)
    mainThirdFloorListPoints.splice(9, 1)

    //remove first and last point
    mainThirdFloorListPoints.splice(0, 1)
    //add first point to last
    mainThirdFloorListPoints.push(mainThirdFloorListPoints[0])

    RenderCylindner(
        bottomPoints = mainThirdFloorListPoints,
        height = floorHeight,
        color = floorColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true, // mặt đáy và nắp có viền đen hay không
    )

    //#endregion

    //#region lan can tầng 3

    let reilFirstPoint = thirdFloorListPoints[1];
    let reilSecondPoint = thirdFloorListPoints[2];

    RenderRailing(
        [
            reilFirstPoint[0],
            reilFirstPoint[1],
            reilFirstPoint[2] + 1,
        ],
        [
            reilSecondPoint[0],
            reilSecondPoint[1],
            reilSecondPoint[2] + 1,
        ],
        height = 2,
        weight = 0.2,
        color = [0, 0, 0],
        railCount = 5
    )

    reilFirstPoint = thirdFloorListPoints[5];
    reilSecondPoint = thirdFloorListPoints[6];

    RenderRailing(
        [
            reilFirstPoint[0],
            reilFirstPoint[1],
            reilFirstPoint[2] + 1,
        ],
        [
            reilSecondPoint[0],
            reilSecondPoint[1],
            reilSecondPoint[2] + 1,
        ],
        height = 2,
        weight = 0.2,
        color = [0, 0, 0],
        railCount = 5
    )

    reilFirstPoint = thirdFloorListPoints[9];
    reilSecondPoint = thirdFloorListPoints[10];

    RenderWallFace(
        [
            reilFirstPoint,
            reilSecondPoint
        ],
        height = thirdFloorHeight + floorHeight * 2,
        color = wallColor,
    )

    reilFirstPoint = thirdFloorListPoints[13];
    reilSecondPoint = thirdFloorListPoints[14];

    RenderRailing(
        [
            reilFirstPoint[0],
            reilFirstPoint[1],
            reilFirstPoint[2] + 1,
        ],
        [
            reilSecondPoint[0],
            reilSecondPoint[1],
            reilSecondPoint[2] + 1,
        ],
        height = 2,
        weight = 0.2,
        color = [0, 0, 0],
        railCount = 5
    )



    //#endregion

    //#region phòng hội trường

    let auditoriumRadius = GetDistance(mainCentroid, mainListPoints[0]) * auditoriumRadiusRatio;
    let auditoriumcentroid = [
        mainCentroid[0],
        mainCentroid[1],
        mainCentroid[2] + auditoriumZPos
    ]
    let auditoriumListPoints = GenerateCircleWithRadius(
        center = auditoriumcentroid,
        radius = auditoriumRadius,
        numPoints = 20
    )

    RenderCylindner(
        bottomPoints = auditoriumListPoints,
        height = auditoriumHeight,
        color = auditoriumColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = false, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )


    //#endregion

    //#region trần nhà
    let ceilingPointList = mainListPoints.slice()

    centroid = GetCentroid(ceilingPointList); // lấy tọa độ trung tâm của nền tường
    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + ceilingZPos
    ]

    ceilingPointList = MovePolygon(
        listPoints = ceilingPointList,
        newCenter = centroid
    ); // di chuyển tường về trung tâm mới

    RenderCylindner(
        bottomPoints = ceilingPointList,
        height = ceilingHeight,
        color = ceilingColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = false, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )

    let centerRadius = GetDistance(mainCentroid, mainListPoints[0]) * centerRadiusRatio;

    let centercentroid = [
        mainCentroid[0],
        mainCentroid[1],
        mainCentroid[2] + centerHeight + ceilingHeight + ceilingZPos
    ]

    let centerListPoints = GenerateCircleWithRadius(
        center = centercentroid,
        radius = centerRadius,
        numPoints = 20
    )

    RenderCylindner(
        bottomPoints = centerListPoints,
        height = centerHeight,
        color = centerColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = false, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )

    //#endregion

}

function RenderMainBuildingWalls(){
    
    //#region tường phía tây
    let mainWallWestPoints = [
        [106.80290320156769, 10.870066681167124, 30],
        [106.80284955738875, 10.870016633584468, 30],
        [106.80268864649587, 10.870172634116262, 30],
        [106.80274356096164, 10.870228210216723, 30],
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

    drawLongWallWindowFloor(10, 10, 10, 100, westFacePoint, windowColor)
    drawLongWallWindowFloor(40, 10, 8, 100, westFacePoint, windowColor)
    drawLongWallWindowFloor(70, 10, 10, 100, westFacePoint, windowColor)

    drawShortWallWindowFloor(10, 28, 10, 100, northFacePoint, windowColor)
    drawShortWallWindowFloor(40, 28, 8, 100, northFacePoint, windowColor)
    drawShortWallWindowFloor(70, 28, 10, 100, northFacePoint, windowColor)

    drawShortWallWindowFloor(10, 28, 10, 100, southFacePoint, windowColor)
    drawShortWallWindowFloor(40, 28, 8, 100, southFacePoint, windowColor)
    drawShortWallWindowFloor(70, 28, 10, 100, southFacePoint, windowColor)
    //#endregion

    //#region tường phía đông
    let mainWallEastPoints = [
        [106.80298442895158, 10.870477525780004, 30],
        [106.80303807987654, 10.870534322608634, 30],
        [106.80319953223952, 10.87037888253703, 30],
        [106.80315136277952, 10.870323545735676, 30],
    ]

    centroid = GetCentroid(mainWallEastPoints); // lấy tọa độ trung tâm của nền tường
    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + floorHeight
    ] // cộng thêm chiều cao của nền vào tọa độ trung tâm - nói cách khác là nâng tường lên 1 đơn vị để tường không bị chồng lên nền

    mainWallEastPoints = MovePolygon(
        listPoints = mainWallEastPoints,
        newCenter = centroid
    ); // di chuyển tường về trung tâm mới

    //vẽ các mặt tường
    [northFacePoint, eastFacePoint, southFacePoint, westFacePoint] = RenderWall(
        bottomPoints = mainWallEastPoints,
        height = wallHeight,
        color = wallColor,
        filled = true,
        have_outline = true,
        have_filled_outline = true
    )

    drawLongWallWindowFloor(10, 10, 10, 100, eastFacePoint, windowColor)
    drawLongWallWindowFloor(40, 10, 8, 100, eastFacePoint, windowColor)
    drawLongWallWindowFloor(70, 10, 10, 100, eastFacePoint, windowColor)

    drawShortWallWindowFloor(10, 28, 10, 100, northFacePoint, windowColor)
    drawShortWallWindowFloor(40, 28, 8, 100, northFacePoint, windowColor)
    drawShortWallWindowFloor(70, 28, 10, 100, northFacePoint, windowColor)

    drawShortWallWindowFloor(10, 28, 10, 100, southFacePoint, windowColor)
    drawShortWallWindowFloor(40, 28, 8, 100, southFacePoint, windowColor)
    drawShortWallWindowFloor(70, 28, 10, 100, southFacePoint, windowColor)

    //#endregion

    //#region tường phía bắc
    let mainWallNorthPoints = [
        [106.80274356096164, 10.870323037141057, 30],
        [106.80269058733496, 10.870375060232586, 30],

        [106.80283584083789, 10.870525407976633, 30],
        [106.80288965833641, 10.870474258352703, 30],
    ]

    centroid = GetCentroid(mainWallNorthPoints); // lấy tọa độ trung tâm của nền tường

    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + floorHeight
    ] // cộng thêm chiều cao của nền vào tọa độ trung tâm - nói cách khác là nâng tường lên 1 đơn vị để tường không bị chồng lên nền

    mainWallNorthPoints = MovePolygon(
        listPoints = mainWallNorthPoints,
        newCenter = centroid
    ); // di chuyển tường về trung tâm mới

    //vẽ các mặt tường
    [northFacePoint, eastFacePoint, southFacePoint, westFacePoint] = RenderWall(
        bottomPoints = mainWallNorthPoints,
        height = wallHeight,
        color = wallColor,
        filled = true,
        have_outline = true,
        have_filled_outline = true
    )

    drawLongWallWindowFloor(10, 10, 10, 100, westFacePoint, windowColor)
    drawLongWallWindowFloor(40, 10, 8, 100, westFacePoint, windowColor)
    drawLongWallWindowFloor(70, 10, 10, 100, westFacePoint, windowColor)

    drawShortWallWindowFloor(10, 28, 10, 100, northFacePoint, windowColor)
    drawShortWallWindowFloor(40, 28, 8, 100, northFacePoint, windowColor)
    drawShortWallWindowFloor(70, 28, 10, 100, northFacePoint, windowColor)

    drawShortWallWindowFloor(10, 28, 10, 100, southFacePoint, windowColor)
    drawShortWallWindowFloor(40, 28, 8, 100, southFacePoint, windowColor)
    drawShortWallWindowFloor(70, 28, 10, 100, southFacePoint, windowColor)

    //#endregion

    //#region tường phía nam
    let mainWallSouthPoints = [
        [106.8031535122773, 10.870222977246332, 30],
        [106.80320664859447, 10.870172475087818, 30],
        [106.8030560874776, 10.870016633584468, 30],
        [106.80300378440316, 10.870067998208661, 30],
    ]

    centroid = GetCentroid(mainWallSouthPoints); // lấy tọa độ trung tâm của nền tường
    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + floorHeight
    ] // cộng thêm chiều cao của nền vào tọa độ trung tâm - nói cách khác là nâng tường lên 1 đơn vị để tường không bị chồng lên nền

    mainWallSouthPoints = MovePolygon(
        listPoints = mainWallSouthPoints,
        newCenter = centroid
    ); // di chuyển tường về trung tâm mới

    //vẽ các mặt tường
    [northFacePoint, eastFacePoint, southFacePoint, westFacePoint] = RenderWall(
        bottomPoints = mainWallSouthPoints,
        height = wallHeight,
        color = wallColor,
        filled = true,
        have_outline = true,
        have_filled_outline = true
    )

    drawLongWallWindowFloor(10, 10, 10, 100, eastFacePoint, windowColor)
    drawLongWallWindowFloor(40, 10, 8, 100, eastFacePoint, windowColor)
    drawLongWallWindowFloor(70, 10, 10, 100, eastFacePoint, windowColor)

    drawShortWallWindowFloor(10, 28, 10, 100, northFacePoint, windowColor)
    drawShortWallWindowFloor(40, 28, 8, 100, northFacePoint, windowColor)
    drawShortWallWindowFloor(70, 28, 10, 100, northFacePoint, windowColor)

    drawShortWallWindowFloor(10, 28, 10, 100, southFacePoint, windowColor)
    drawShortWallWindowFloor(40, 28, 8, 100, southFacePoint, windowColor)
    drawShortWallWindowFloor(70, 28, 10, 100, southFacePoint, windowColor)
    //#endregion

}

function RenderCenterStructure(mainListPoints, mainCentroid){

    let firstRadius = GetDistance(mainCentroid, mainListPoints[0]) * 0.5;
    let firstcentroid = [
        mainCentroid[0],
        mainCentroid[1],
        mainCentroid[2] + 1
    ]
    let firstListPoints = GenerateCircleWithRadius(
        center = firstcentroid,
        radius = firstRadius,
        numPoints = 4
    )

    firstListPoints = ResizePolygon(firstListPoints, 1.3)

    let square = GenerateSquare(firstcentroid, firstRadius * 1.6, firstRadius * 1.6, 45);

    [TopLeftSquare, TopRightSquare, BottomLeftSquare, BottomRightSquare] = SplitSquare(square);

    //set TopLeftSquare to roomListPoint
    let bottomLeftStructureListPoint = [];
    bottomLeftStructureListPoint = AddPointToSquare(TopLeftSquare, bottomLeftStructureListPoint, [5, 5])
    bottomLeftStructureListPoint = AddPointToSquare(TopLeftSquare, bottomLeftStructureListPoint, [5, 95])
    bottomLeftStructureListPoint = AddPointToSquare(TopLeftSquare, bottomLeftStructureListPoint, [60, 95])
    bottomLeftStructureListPoint = AddPointToSquare(TopLeftSquare, bottomLeftStructureListPoint, [80, 80])
    bottomLeftStructureListPoint = AddPointToSquare(TopLeftSquare, bottomLeftStructureListPoint, [80, 60])
    bottomLeftStructureListPoint = AddPointToSquare(TopLeftSquare, bottomLeftStructureListPoint, [95, 60])
    bottomLeftStructureListPoint = AddPointToSquare(TopLeftSquare, bottomLeftStructureListPoint, [95, 5])
    bottomLeftStructureListPoint = AddPointToSquare(TopLeftSquare, bottomLeftStructureListPoint, [5, 5])

    let  topLeftStructureListPoint =  [];
    topLeftStructureListPoint = AddPointToSquare(TopRightSquare, topLeftStructureListPoint, [5, 5])
    topLeftStructureListPoint = AddPointToSquare(TopRightSquare, topLeftStructureListPoint, [5, 95])
    topLeftStructureListPoint = AddPointToSquare(TopRightSquare, topLeftStructureListPoint, [60, 95])
    topLeftStructureListPoint = AddPointToSquare(TopRightSquare, topLeftStructureListPoint, [80, 80])
    topLeftStructureListPoint = AddPointToSquare(TopRightSquare, topLeftStructureListPoint, [80, 60])
    topLeftStructureListPoint = AddPointToSquare(TopRightSquare, topLeftStructureListPoint, [95, 60])
    topLeftStructureListPoint = AddPointToSquare(TopRightSquare, topLeftStructureListPoint, [95, 5])
    topLeftStructureListPoint = AddPointToSquare(TopRightSquare, topLeftStructureListPoint, [5, 5])

    let bottomRightStructureListPoint =  [];
    bottomRightStructureListPoint = AddPointToSquare(BottomLeftSquare, bottomRightStructureListPoint, [5, 5])
    bottomRightStructureListPoint = AddPointToSquare(BottomLeftSquare, bottomRightStructureListPoint, [95, 5])
    bottomRightStructureListPoint = AddPointToSquare(BottomLeftSquare, bottomRightStructureListPoint, [95, 60])
    bottomRightStructureListPoint = AddPointToSquare(BottomLeftSquare, bottomRightStructureListPoint, [80, 80])
    bottomRightStructureListPoint = AddPointToSquare(BottomLeftSquare, bottomRightStructureListPoint, [60, 80])
    bottomRightStructureListPoint = AddPointToSquare(BottomLeftSquare, bottomRightStructureListPoint, [60, 95])
    bottomRightStructureListPoint = AddPointToSquare(BottomLeftSquare, bottomRightStructureListPoint, [5, 95])
    bottomRightStructureListPoint = AddPointToSquare(BottomLeftSquare, bottomRightStructureListPoint, [5, 5])

    let topRightStructureListPoint =  [];
    topRightStructureListPoint = AddPointToSquare(BottomRightSquare, topRightStructureListPoint, [5, 5])
    topRightStructureListPoint = AddPointToSquare(BottomRightSquare, topRightStructureListPoint, [95, 5])
    topRightStructureListPoint = AddPointToSquare(BottomRightSquare, topRightStructureListPoint, [95, 60])
    topRightStructureListPoint = AddPointToSquare(BottomRightSquare, topRightStructureListPoint, [80, 80])
    topRightStructureListPoint = AddPointToSquare(BottomRightSquare, topRightStructureListPoint, [60, 80])
    topRightStructureListPoint = AddPointToSquare(BottomRightSquare, topRightStructureListPoint, [60, 95])
    topRightStructureListPoint = AddPointToSquare(BottomRightSquare, topRightStructureListPoint, [5, 95])
    topRightStructureListPoint = AddPointToSquare(BottomRightSquare, topRightStructureListPoint, [5, 5])

    RenderCylindner(
        bottomPoints = bottomLeftStructureListPoint,
        height = mainStructureHeight,
        color = mainStructureColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )

    RenderCylindner(
        bottomPoints = topLeftStructureListPoint,
        height = mainStructureHeight,
        color = mainStructureColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )

    RenderCylindner(
        bottomPoints = bottomRightStructureListPoint,
        height = mainStructureHeight,
        color = mainStructureColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )

    RenderCylindner(
        bottomPoints = topRightStructureListPoint,
        height = mainStructureHeight,
        color = mainStructureColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )
}

function DrawLibrary(){
        //#region TOÀ THƯ VIỆN
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

        DrawLibraryWall();

        //#region trần nhà
        let ceilingPointList = libraryListPoints.slice()
    
        centroid = GetCentroid(ceilingPointList); // lấy tọa độ trung tâm của nền tường
        centroid = [
            centroid[0],
            centroid[1],
            centroid[2] + libraryCeilingZPos
        ]
    
        ceilingPointList = MovePolygon(
            listPoints = ceilingPointList,
            newCenter = centroid
        ); // di chuyển tường về trung tâm mới
    
        RenderCylindner(
            bottomPoints = ceilingPointList,
            height = libraryCeilingHeight,
            color = ceilingColor,
            filled = true, // hình trụ có mặt đáy và nắp hay không
            have_outline = false, // các hình polygon tạo thành hình trụ có viền đen hay không
            have_filled_outline = true // mặt đáy và nắp có viền đen hay không
        )
    
        let centerRadius = GetDistance(centroid, ceilingPointList[0]) * centerRadiusRatio;
    
        let centercentroid = [
            centroid[0],
            centroid[1],
            centroid[2] + libraryCeilingHeight
        ]
    
        let centerListPoints = GenerateCircleWithRadius(
            center = centercentroid,
            radius = centerRadius,
            numPoints = 20
        )
    
        RenderCylindner(
            bottomPoints = centerListPoints,
            height = libraryCenterHeight,
            color = centerColor,
            filled = true, // hình trụ có mặt đáy và nắp hay không
            have_outline = false, // các hình polygon tạo thành hình trụ có viền đen hay không
            have_filled_outline = true // mặt đáy và nắp có viền đen hay không
        )
    
        //#endregion
    
    
        //#endregion
    
}

function DrawLibraryWall(){
        
        //#region tường phía tây - thư viện
        mainWallWestPoints = [
            [106.80307679406697, 10.87080312815038, 30],
            [106.80311635664893, 10.870841980777332, 30],
            [106.80319279960389, 10.870766251076052, 30],
            [106.8031545781264, 10.870727398439241, 30],
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
            height = libraryWallHeight,
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
        //#endregion
    
}

function DrawConnector(){
    //#region ĐƯỜNG NỐI
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

    RenderCylindner(
        bottomPoints = listPoints,
        height = floorHeight,
        color = floorColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = true // mặt đáy và nắp có viền đen hay không
    )

    RenderCylindner(
        bottomPoints = listPoints,
        height = mainStructureHeight + floorHeight,
        color = wallColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = false, // mặt đáy và nắp có viền đen hay không
        [0, 1, 6, 7, 8, 9]
    )

    centroid = GetCentroid(listPoints); // lấy tọa độ trung tâm của nền tường
    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + mainStructureHeight + floorHeight
    ] // cộng thêm chiều cao của nền vào tọa độ trung tâm - nói cách khác là nâng tường lên 1 đơn vị để tường không bị chồng lên nền

    listPoints = MovePolygon(
        listPoints = listPoints,
        newCenter = centroid
    ); // di chuyển tường về trung tâm mới

    RenderCylindner(
        bottomPoints = listPoints,
        height = secondFloorHeight + floorHeight + thirdFloorHeight / 2,
        color = wallColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = false, // mặt đáy và nắp có viền đen hay không
    )

    let ceilingPoint = listPoints.slice()
    centroid = [
        centroid[0],
        centroid[1],
        centroid[2] + secondFloorHeight + floorHeight + thirdFloorHeight / 2
    ]

    ceilingPoint = MovePolygon(
        listPoints = ceilingPoint,
        newCenter = centroid
    )

    RenderCylindner(
        bottomPoints = ceilingPoint,
        height = ceilingHeight / 2,
        color = ceilingColor,
        filled = true, // hình trụ có mặt đáy và nắp hay không
        have_outline = true, // các hình polygon tạo thành hình trụ có viền đen hay không
        have_filled_outline = false, // mặt đáy và nắp có viền đen hay không
    )

    //#endregion
}