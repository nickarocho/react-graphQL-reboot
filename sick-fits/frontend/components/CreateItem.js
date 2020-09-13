import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTAION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    )
  }
`;

class CreateItem extends Component {
  state = {
    title: 'cool shoes',
    description: 'i love those ctxt',
    image: 'dog.jpg',
    largeImage: 'large-dog.jpg',
    price: 1069,
  };

  // using an arrow function so "this" can access everything on the class instance
  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val }); // mirrors multiple inputs to state from destructured vars above
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTAION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={async e => {
            // stop the form from submitting
            e.preventDefault();
            // call the mutation
            const res = await createItem();
            // bring them to the PDP
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id },
            })
          }}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Sumbit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTAION };
