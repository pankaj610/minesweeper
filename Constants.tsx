import { Dimensions } from "react-native";

const Constants = {
    MAX_HEIGHT: Dimensions.get('screen').height,
    MAX_WIDTH: Dimensions.get('screen').width,
    BOARD_SIZE: 10,
    CELL_SIZE: 35,
}

export default Constants;