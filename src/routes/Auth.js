import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql } from 'react-apollo';

// USER
const user = ({ id, username }) => <h1 key={id}>{username}</h1>;

user.propTypes = {
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
};

// AUTH
const Auth = ({ data: { allUsers = [] } }) => <div>{allUsers.map(user)}</div>;

const query = gql`
  {
    allUsers {
      id
      username
    }
  }
`;

Auth.propTypes = {
  data: PropTypes.shape({
    allUsers: PropTypes.array,
  }).isRequired,
};

export default graphql(query)(Auth);
