import React, { Component } from 'react';
import { Button, Icon,Container, Image } from 'semantic-ui-react'
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
          <div className="Social-Buttons">
              <LinkedinShareButton url={ this.state.shareURL}>
                <LinkedinIcon size={28} />
              </LinkedinShareButton>
              <WhatsappShareButton url={ this.state.shareURL}>
                <WhatsappIcon size={28} />
              </WhatsappShareButton>
              <FacebookShareButton url={ this.state.shareURL }>
                <FacebookIcon size={28} />
              </FacebookShareButton>
              <TwitterShareButton url={ this.state.shareURL }>
                <TwitterIcon size={28} />
              </TwitterShareButton>
            </div>

          { this.props.children }

          </div>
        </div>
      </BaseLayout>
    )
  }
}

export default CertificateLayout;
