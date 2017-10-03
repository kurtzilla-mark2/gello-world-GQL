import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { gql, graphql } from 'react-apollo';

const BasicAutocomplete = ({ items, onChange }) => (
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
            {items
              .filter(
                i =>
                  !inputValue ||
                  i.title.toLowerCase().includes(inputValue.toLowerCase()),
              )
              .slice(0, 10)
              .map((book, index) => (
                <div
                  {...getItemProps({ item: book.title })}
                  key={book.id}
                  style={{
                    backgroundColor:
                      highlightedIndex === index ? 'gray' : 'white',
                    fontWeight: selectedItem === book.title ? 'bold' : 'normal',
                  }}
                >
                  {book.title}
                </div>
              ))}
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

const Search = ({ data: { allBooks = [] } }) => (
  <BasicAutocomplete
    items={allBooks}
    onChange={selectedItem => console.log(selectedItem)}
  />
);

const allBooksQuery = gql`
  {
    allBooks(key: 0, limit: 1000) {
      id
      title
    }
  }
`;

Search.propTypes = {
  data: PropTypes.shape({
    allBooks: PropTypes.array,
  }).isRequired,
};

export default graphql(allBooksQuery)(Search);
