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
    ) {
      id
    }
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

  uploadFile = async (e) => {
    console.log('Uploading file...');
    const files = e.target.files;
    // formData API is just part of vanilla JS
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'nickspicks');
  
    const res = await fetch('https://api.cloudinary.com/v1_1/boldlyfine/image/upload', {
      method: 'POST',
      body: data,
    });
 
    console.log({res});

    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
    
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTAION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={async e => {
            // stop the form from submitting
            e.preventDefault();
            // TODO: check to make sure img is done uploading before submitting
            // call the mutation
            const res = await createItem();
            console.log(res);
            // bring them to the PDP
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id },
            })
          }}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile}
                />
                {this.state.image && <img src={this.state.image} widt="200" alt="Upload preview" />}
              </label>
              
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
