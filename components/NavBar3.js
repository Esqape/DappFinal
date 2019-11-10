import React, { Component } from 'react';
import { Menu ,Segment,Button} from 'semantic-ui-react';
import { Link } from '../routes';
import * as firebase from "firebase/app";
import Cookie from "js-cookie";
import { Router } from '../routes';

class NavBar3 extends Component {
  constructor(props) {
    super(props);
  }
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    return (
      <div>
        <Menu pointing secondary>
          <Link route="/">
          <Menu.Item name='home'  >
          <img className="Nav-Logo-Img" src={`../static/Logo.png`}/>
          </Menu.Item>
          </Link>
          
          <Menu.Menu position='right'>
          <Link route="/toSign">
            <Menu.Item
              name='Certs to Sign'
              >
            </Menu.Item>
            </Link>
            <Link route="/signed">
            <Menu.Item
              name='Signed Certs'
              >
            </Menu.Item>
            </Link>
            <Link route="/about">
            <Menu.Item
              name='about'
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

export default NavBar3;
