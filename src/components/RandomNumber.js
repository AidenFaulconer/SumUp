import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'; 


//RandomNumber is a component providing the playable numbers 
//the propTypes are leveraged from the resulting components children in game.js

class RandomNumber extends React.Component {
    static propTypes = {
        number: PropTypes.number.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
    };

    handlePress = () => {
        if (this.props.isDisabled) { return; }
        this.props.onPress(this.props.id)
    };   
    //if the selected item "isDisabled" then do nothing since its disabled already
    //otherwise process the childs Id

    render() {
        return (
            <TouchableOpacity onPress={this.handlePress}>
                <Text style={[styles.random, this.props.isDisabled && styles.disabled]}>{this.props.number}</Text>
            </TouchableOpacity>
            );
    }
}
 
const styles = StyleSheet.create({
    random: {
        backgroundColor: '#aaa',
        width: 100,
        marginHorizontal: 15,
        marginVertical: 25,
        fontSize: 35,
        textAlign: 'center',
       
    },

    disabled: {
        opacity: 0.3,
    }

});


export default RandomNumber;