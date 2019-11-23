import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';


import './App.css';
import Header from "./Components/header";

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  {
    organization(login: "google") {
      repositories(first: 15) {
        edges {
          node {
            id
            name
            url
            viewerHasStarred
          }
        }
      }
    }
  }
`;

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const App = () => (
  <Query query={GET_REPOSITORIES_OF_ORGANIZATION}>
    {({ data: { organization }, loading }) => {
      if (loading || !organization) {
        return <div>Loading ...</div>;
      }

      return (
        <div>
          <Header/>
        <Repositories repositories={organization.repositories} />
        </div>

      );
    }}
  </Query>
);



class Repositories extends React.Component {
  state = {
    selectedRepositoryIds: [],
  };

  toggleSelectRepository = (id, isSelected) => {
    let { selectedRepositoryIds } = this.state;

    selectedRepositoryIds = isSelected
      ? selectedRepositoryIds.filter(itemId => itemId !== id)
      : selectedRepositoryIds.concat(id);

    this.setState({ selectedRepositoryIds });
  };

  render() {
    return (
      <RepositoryList
        repositories={this.props.repositories}
        selectedRepositoryIds={this.state.selectedRepositoryIds}
        toggleSelectRepository={this.toggleSelectRepository}
      />
    );
  }
}

const RepositoryList = ({
  repositories,
  selectedRepositoryIds,
  toggleSelectRepository,
}) => (

  <div className="card-columns cardContainer">
    {repositories.edges.map(({ node }) => {
      const isSelected = selectedRepositoryIds.includes(node.id);

      const rowClassName = ['card-body'];

      if (isSelected) {
        rowClassName.push('row_selected');
      }

      return (
          <div className="card repoCard" >
            <div className={rowClassName.join(' ')} key={node.id}>
              <h5 className="card-title">{node.name}</h5>
              <a href={node.url} className="card-link">{node.name}</a>{' '}<p/>
                <Select
                  id={node.id}
                  isSelected={isSelected}
                  toggleSelectRepository={toggleSelectRepository}
                />{' '}

                {!node.viewerHasStarred && <Star id={node.id} />}

            </div>
          </div>

      );
    })}
  </div>
);

const Star = ({ id }) => (
  <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
    {starRepository => (
      <button type="button" className="btn btn-outline-danger" onClick={starRepository}>
        Star
      </button>
    )}
  </Mutation>
);

const Select = ({ id, isSelected, toggleSelectRepository }) => (
  <button
    type="button"
    className="btn btn-light"
    onClick={() => toggleSelectRepository(id, isSelected)}
  >
    {isSelected ? 'Unselect' : 'Select'}
  </button>
);

export default App;
