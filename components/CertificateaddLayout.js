import React, { Component } from 'react';
import { Button, Icon,Container } from 'semantic-ui-react'
import Head from 'next/head';
import { Link } from '../routes';
import "../style.css";
import { LinkedinShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton, GooglePlusShareButton,
  LinkedinIcon,  FacebookIcon, TwitterIcon, WhatsappIcon, GooglePlusIcon } from 'react-share';
import BaseLayout from './BaseLayout'

class CertificateLayout extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    shareURL: '',
    certificateName: this.props.certName,
    certType: this.props.type
  }

  componentDidMount() {
    this.setState({ shareURL: window.location.href });
  }

  render() {
    return (
      <BaseLayout>
        
        <div className="Certificate-Layout">
          <div className="Certificate-Layout-Child">
          <div className="Certificate-Layout-Header">
            <Link route={`/`}>
              <div className="Home-Button">
              <Button animated>
                <Button.Content visible>Back</Button.Content>
                <Button.Content hidden>
                  <Icon name='arrow left' />
                </Button.Content>
              </Button>
              </div>
            </Link>
            <h1 className="Cert-Title">{this.props.certName}</h1>
            <div className="Cert-Subtitle">{this.props.type} Certificate</div>
          </div>
          { this.props.children }

          </div>
        </div>
      </BaseLayout>
    )
  }
}

export default CertificateLayout;
