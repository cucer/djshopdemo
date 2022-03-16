// import React, { useEffect } from 'react'
import { Carousel, Image } from 'react-bootstrap';
import Slide1 from '../../assets/slide1.jpg';
import Slide2 from '../../assets/slide2.jpg';
import Slide3 from '../../assets/slide3.jpg';
import Slide4 from '../../assets/slide4.jpg';

const ProductCarousel = () => {
  return (
    <Carousel pause="hover" className="bg-dark" interval={200000} fade>
      <Carousel.Item>
        <Image className="d-block w-100" src={Slide1} alt="First slide" />
        <Carousel.Caption>
          <h3 className="text-dark">
            Major CDJ-3000 firmware introduces rekordbox CloudDirectPlay
          </h3>
          <p className="text-dark">
            AlphaTheta Corporation has today released the new firmware for the
            CDJ-3000 multi player.
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <Image className="d-block w-100" src={Slide2} alt="Second slide" />
        <Carousel.Caption>
          <h3 className="text-primary">
            Bundled rekordbox ver. 5 license key cards discontinued
          </h3>
          <p className="text-primary">
            The latest version of our DJ application, does not need to be
            activated by a license key.
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <Image className="d-block w-100" src={Slide3} alt="Third slide" />
        <Carousel.Caption>
          <h3 className="text-info">
            Introducing the XDJ-RX3, with key features from flagship Pioneer DJ
            gear
          </h3>
          <p className="text-info">
            AlphaTheta Corporation has today announced the release of the new
            XDJ-RX3.
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <Image className="d-block w-100" src={Slide4} alt="Fourth slide" />
        <Carousel.Caption>
          <h3 className="text-warning">
            Introducing the limited-edition DDJ-FLX6-W with stylish matte white
            finish
          </h3>
          <p className="text-warning">
            AlphaTheta Corporation has today announced the release of the new
            DDJ-FLX6-W.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ProductCarousel;
