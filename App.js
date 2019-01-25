import React from 'react';
import Game from './src/components/Game';
import { StyleSheet } from 'react-native';

export default class App extends React.Component {
    state = {
		gameId: 1,
    };

	resetGame = () => {
	this.setState((prevState) => {
		return {gameId: prevState.gameId + 1};
	});
    };

    //change initial seconds to extend or shorten duration of game
    //change random number count to make the game more difficult (adding more numbers to pick from)

	render() {
        return (
            <Game 
			key={this.state.gameId}
			onPlayAgain={this.resetGame}
			randomNumberCount={8}
			initialSeconds={10}
			/>
            );
    }
}
//changing the game components key ID(gameId) results in a remount thus resetting the timer, and all components 
//this is acomplished by invoking resetGame

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ddd',
        flex: 1,
    },
});

