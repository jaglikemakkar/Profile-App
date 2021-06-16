import React, { useState } from 'react';
import { Image } from 'react-native-svg';
import { gql } from "apollo-boost";
import { graphql } from 'react-apollo';

const getPic = gql`
 {
   pic(id: 1)
   {
     uri
   }
 }
`;

import {
  StyleSheet,
  View,
} from 'react-native';
import { Component } from 'react';

class PicComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalopen: false
    }
  }


  displayPic() {
    var data = this.props.data;
    if (!data.loading) {
      return (
        <Image
          scale={1}
          width="100%"
          height="100%"
          clipPath="url(#clip)"
          href={{ uri: data.pic.uri }}
        />

      );
    }
  };
  //apollo-client_________________________
  render() {
    return (
      <View>{this.displayPic()}</View>
    );
  }
};

export default graphql(getPic)(PicComponent);