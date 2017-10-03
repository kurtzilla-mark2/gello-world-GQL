import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { gql, graphql } from 'react-apollo';

const searchBooksQuery = gql`
  query($title: String!) {
    searchBooks(title: $title) {
      id
      title
    }
  }
`;

const Items = ({
  data: { loading, searchBooks },
  highlightedIndex,
  selectedItem,
  getItemProps,
}) =>
  loading ? null : (
    <div>
      {searchBooks.slice(0, 10).map(({ title, id }, index) => (
        <div
          {...getItemProps({ item: title })}
          key={id}
          style={{
            backgroundColor: highlightedIndex === index ? 'gray' : 'white',
            fontWeight: selectedItem === title ? 'bold' : 'normal',
          }}
        >
          {title}
        </div>
      ))}
    </div>
  );

const FetchItems = graphql(searchBooksQuery, {
  options: ({ title }) => ({ variables: { title } }),
})(Items);

Items.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    searchBooks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  highlightedIndex: PropTypes.number.isRequired,
  selectedItem: PropTypes.shape.isRequired,
  getItemProps: PropTypes.func.isRequired,
};

const BasicAutocomplete = (
  { items, onChange }, //eslint-disable-line
) => (
  <Downshift onChange={onChange}>
    {({
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      selectedItem,
      highlightedIndex,
    }) => (
      <div>
        <input {...getInputProps({ placeholder: 'Search a book!' })} />
        {isOpen ? (
          <div style={{ border: '1px solid #ccc' }}>
            <FetchItems
              title={inputValue}
              selectedItem={selectedItem}
              highlightedIndex={highlightedIndex}
              getItemProps={getItemProps}
            />
          </div>
        ) : null}
      </div>
    )}
  </Downshift>
);

BasicAutocomplete.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default () => (
  <BasicAutocomplete onChange={selectedItem => console.log(selectedItem)} />
);
