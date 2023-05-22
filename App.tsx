import React, { useRef } from 'react';
import { 
  Alert,
  Button,
  StyleSheet, 
  View,
  useColorScheme,
} from 'react-native'; 
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Constants from './Constants';
import Cell, { CellType } from './Cell';

const useGameEngine = () => {
  const boardWidth = Constants.BOARD_SIZE * Constants.CELL_SIZE;
  const grid = useRef<Array<Array<CellType | null>>>(Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, iex) => {
    return Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, iey) => {
      return null;
    });
  }));

  const onDie = () => {
    console.log('onDie');
  }

  const reset = () => {
    for(let i= 0; i < Constants.BOARD_SIZE; i++) {
      for(let j = 0; j < Constants.BOARD_SIZE; j++) {
        grid.current[i][j]?.reset?.();
      }
    }
  }

  const revealNeighbors = (x: number, y: number) => {
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        if(x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          console.log("Reveal neighbors")
           grid.current?.[x + i]?.[y + j]?.revealCell?.(x, y);
        }
      }
    }
  }

  const onReveal = (x: number, y: number)=> {
    let neighbors = 0;
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        if(x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          if(grid.current?.[x + i]?.[y + j]?.isMine) {
            neighbors++;
          }
        }
      }
    }
    if(neighbors) {
      console.log(neighbors);
      grid.current?.[x]?.[y]?.setState?.({
       neighbors: neighbors,
     });
    } else {
      revealNeighbors(x, y);
    }
  }

  const renderGrid = () => {
    return grid.current.map((row, rowIndex) => { 
      const cellList = row.map((_, cellIndex) => {
        return (
          <Cell onDie={onDie} onReveal={onReveal} key={`${cellIndex}_${rowIndex}`} num={cellIndex} x={rowIndex} y={cellIndex} ref={(ref)=> grid.current[rowIndex][cellIndex] = ref}/>
        );
      });
      return <View style={styles.row}>
        {cellList}
      </View>
    });
  }

  return { boardWidth, grid, renderGrid, reset };
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const { boardWidth, renderGrid, reset } = useGameEngine();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={[styles.container, backgroundStyle]}>
      <View style={{ width: boardWidth, height: boardWidth }}>
        {renderGrid()}
        <Button title='Reset' onPress={reset}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  container: {
    flexDirection: 'column',
    backgroundColor: Colors.lighter,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default App;
