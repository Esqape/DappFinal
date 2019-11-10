import React, { Component } from 'react';
import { Menu ,Segment,Button} from 'semantic-ui-react';
import { Link } from '../routes';
import * as firebase from "firebase/app";
import { Router } from '../routes';
import Cookie from "js-cookie";

class NavBar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  componentDidMount(){
      
    }

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Menu pointing secondary>
          <Link route="/">
          <Menu.Item name='home'  >
          <img className="Nav-Logo-Img" src={`../static/Logo.png`}/>
          </Menu.Item>
          </Link>
          
          <Menu.Menu position='right'>

            <Link route="/addUser">
            <Menu.Item
              name='Add User'
              
            >
            </Menu.Item>
            </Link>
            <Link route="/createUser">
            <Menu.Item
              name='Create User'
              
            >
            </Menu.Item>
            </Link>
            <Link route="/add">
            <Menu.Item
              name='Add certificate'
              
            >
            </Menu.Item>
            </Link>
            <Link route="/about">
            <Menu.Item
              name='About'
              >
            </Menu.Item>
            </Link>
            <Menu.Item>
              <Button onClick={() => {Cookie.set("ClientEmail",null);firebase.app().auth().signOut();
                                      Router.replaceRoute(`/`);
               }}>Logout</Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}

export default NavBar;
