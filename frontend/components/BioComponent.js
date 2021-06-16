import React, { useState } from 'react';
import { gql } from "apollo-boost";
import { graphql } from 'react-apollo';

const getUserQuery = gql`
 {
   user(id: 1)
   {
     name
     bio
     email
   }
 }
`;

import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Component } from 'react';

class nameBioComp extends Component {

    displayUser() {
        var data = this.props.data;
        if (data.loading) {
            return (
                <View style={styles.content}>
                    <View style={styles.name}>
                        <Text style={styles.nameText}>loading...</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.detailsText}>loading...</Text>
                        <Text style={styles.detailsText}>loading...</Text>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={styles.content}>
                <View style={styles.name}>
                  <Text style={styles.nameText}>{data.user.name}</Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>{data.user.bio}</Text>
                  <Text style={styles.detailsText}>{data.user.email}</Text>
                </View>
              </View>
            );
        }
    };
    //apollo-client_________________________
    render() {
        return (
            <View style={{flex: 1}}>
            {this.displayUser()}
            </View>

        );
    }
};
const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'center',
    },

    details: {
        marginTop: 5,
        alignItems: 'center',
        textAlign: 'center',
    },

    nameText: {
        fontSize: 20,
        color: 'grey',
    },

    detailsText: {
        fontSize: 15,
        color: 'grey',
    },
});


export default graphql(getUserQuery)(nameBioComp);