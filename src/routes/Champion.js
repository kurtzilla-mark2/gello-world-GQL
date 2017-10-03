import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql } from 'react-apollo';
import { Image } from 'cloudinary-react';

const Champion = ({ data: { loading, getChampion } }) => {
  if (loading) {
    return <h1>loading...</h1>;
  }

  const { name, publicId } = getChampion;

  return (
    <div>
      <h1>{name}</h1>
      <Image cloudName={process.env.REACT_APP_CLOUD_NAME} publicId={publicId} />
    </div>
  );
};

const getChampionQuery = gql`
  query($id: Int!) {
    getChampion(id: $id) {
      name
      publicId
    }
  }
`;

Champion.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    getChampion: PropTypes.func.isRequired,
  }).isRequired,
};

export default graphql(getChampionQuery, {
  options: ({ match }) => ({
    variables: match.params,
  }),
})(Champion);
