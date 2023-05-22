import React, { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Constants from './Constants';
import { useImperativeHandle } from 'react';
export interface CellType {
    num: number;
    x: number;
    y: number;
    height?: number;
    width?: number;
    onDie: () => void;
    onReveal: (x: number, y: number) => void;
    setState?: Function;
    revealCell?: Function;
    isMine?: boolean;
    reset?: Function;
}

const Cell =forwardRef(({ num, onDie, onReveal, x, y, height = Constants.CELL_SIZE,
    width = Constants.CELL_SIZE }: CellType, ref: ForwardedRef<CellType>) =>  {
    const [{ revealed, isMine, neighbors }, setState] = useState({ revealed: false, isMine: Math.random() < 0.2, neighbors: null });
    const scaleAnimationRef = useRef(new Animated.Value(0));
    useEffect(()=> {
        if(revealed) {
            if (isMine) {
                onDie();
            } else {
                onReveal(x, y);
            }
            Animated.timing(scaleAnimationRef.current, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start();
            
        }
    }, [revealed]);

    useImperativeHandle(ref, () => {
        return {
            setState: (props) => setState(state=> ({...state, ...props})),
            isMine,
            revealCell,
            reset,
        }
    })

    const reset  = ()=> {
        setState({
            revealed: false, isMine: Math.random() < 0.2, neighbors: null
        });
    }

    const revealCell = (isUserInitiated: boolean) => {
        if(revealed) {
            return;
        }
        if(!isUserInitiated && isMine) {
            return;
        }
        setState((state) => ({ ...state, revealed: true }));
    }
    if (!revealed) {
        return (<TouchableOpacity onPress={()=> revealCell(true)}>
            <View style={[styles.reveledCell, { height, width }]}>

            </View>
        </TouchableOpacity>);
    }
    const content = (isMine ? <Animated.Image  source={require('./assets/images/mine.png')} style={[{height: Constants.CELL_SIZE, width: Constants.CELL_SIZE, position: 'absolute', resizeMode: 'contain'}, {
        transform: [
            {
                scale: scaleAnimationRef.current,
            }, 
        ],
    }]}/>: (
        <Text>
            {neighbors ? neighbors: ''}
        </Text>
    ));
    return (
        <View
            key={num}
            style={[
                styles.cell,
                { height, width }
            ]}
        >
            {content}
        </View>
    )
});

export default Cell

const styles = StyleSheet.create({
    cell: {
        backgroundColor: '#bdbdbd',
        borderWidth: 3,
        borderColor: '#bdbdbd',
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#7d7d7d',
        borderBottomColor: '#7d7d7d',
        justifyContent: 'center',
        alignItems: 'center'
    },
    reveledCell: {
        borderWidth: 1,
        borderColor: '#8d8d8d',
        backgroundColor: '#6d6d6d',
        justifyContent: 'center',
        alignItems: 'center'
    }
});