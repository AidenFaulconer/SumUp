import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, StyleSheet } from 'react-native';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

//This component is where the game is played, thus isolating components for modular usage
//This component features an array to store the children of the RandomNumber component
//and functions to interact with that component when it is instantiated in render().
//Using dynamic string values through the gameStatus property(serving as a reusable method) 
//'STATUS_${gameStatus}' takes the STRING output and has different UI outcomes described in the stylesheet.
class Game extends React.Component {

    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
        initialSeconds: PropTypes.number.isRequired,
		onPlayAgain: PropTypes.func.isRequired,
    };

    state = {
        selectedIds: [],
        remainingSeconds: this.props.initialSeconds,
    };
    //this function doesn't hold DISPLAYED numbers, it instead holds their array INDEX

    gameStatus = 'PLAYING';
    //gameStatus STARTS cached in a state of PLAYING, and gets changed later in the components lifecycle. componentWillUpdate anticipated changes in a lifecycle and chancges this

    randomNumbers = Array
        .from({ length: this.props.randomNumberCount }).map(
		() => 1 + Math.floor(10 * Math.random()),
		);

    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0);
    //target is an example of functional programming, its holding the values outputted from another function
    //that way we dont change the variables directly, allowing us to precompute values to then be reused without worrying
    //about the flow of informtion, not being in control && changing the origin of that information.
    shuffledRandomNumbers = shuffle(this.randomNumbers);


    //start a timer when a the game component renders 
    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState((prevState) => {
                return { remainingSeconds: prevState.remainingSeconds - 1};
            }, () => {
                if (this.state.remainingSeconds === 0) {
                    clearInterval(this.intervalId);
                }
            });
        }, 1000);
    }

    //when the game component stops rendering stop timer to avoid it going into - infinitely
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    //function to 
    isNumberSelected = (numberIndex) => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    };

    selectNumber = (numberIndex) => {
        this.setState((prevState) =>({
                selectedIds: [...prevState.selectedIds, numberIndex],
            }));
        //using the spread to take everything in from selectedId's
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0) {
            this.gameStatus = this.calcGameStatus(nextState);
			//console.warn(this.gameStatus);
            if (this.gameStatus !== 'PLAYING') {
                clearInterval(this.intervalId)
            }
        }
    }
    //gameStatus is cached, this method changes the cache so that we dont need to continually compute gameStatus

    //PLAYING WON LOST
    calcGameStatus = (nextState) => {
        const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
            return acc + this.shuffledRandomNumbers[curr];
        }, 0);
        //start accumulator at 0
        if (nextState.remainingSeconds === 0) {
            return 'LOST';
        }
        if (sumSelected < this.target) {
            return 'PLAYING';
        }
        if (sumSelected === this.target) {
            return 'WON';
        }
        if (sumSelected > this.target) {
            return 'LOST';
        }
        //returned strings will be computed dynamically with stylesheets for interactivity
        //and enforcing game play rules
    };

    //rendering happens every second hence its 'rendering'
    render() {
        //we need to cache this instead of having it run every second draining precious computation
        //change cached instance of computed value WHEN NEEDED via componentWillUpdate
        const gameStatus = this.gameStatus;

        return (
            <View style={styles.container}>
                <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
                    {this.target}
                </Text>
                <View style={styles.randomContainer}>
                    {this.shuffledRandomNumbers.map((randomNumber, index) => (
                            <RandomNumber
                                key={index}
                                id={index}
                                number={randomNumber}
                                isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'
                                }
                                onPress={this.selectNumber}
                            />
                            //render children of RandomNumber component w key(identification) 
							//utilizing the index of that child within the randomNumbers array
                    ))}
                </View>
                {this.gameStatus !== 'PLAYING' && (
                    <Button title="Play Again" onPress={this.props.onPlayAgain} />
                )}
                <Text style={[styles.playAgain, styles[`STATUS_${gameStatus}`]]}>
                    {this.state.remainingSeconds}
                </Text>
            </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ddd',
        flex: 1,
        paddingTop: 30,
    },

    target: {
        fontSize: 40,
        backgroundColor: '#aaa',
        marginHorizontal: 50,
        textAlign: 'center',
    },

    playAgain: {
        fontSize: 70,
        textAlign: 'center',
        padding: '20%',

    },

    randomContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },

    STATUS_PLAYING: {
        backgroundColor: '#bbb',
    },

    STATUS_WON: {
        backgroundColor: '#66ff33',
    },

    STATUS_LOST: {
        backgroundColor: '#ff0000',
    },
});

export default Game;
