import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section id="features">
      <div className="row">
        <div className="col-2 features__left"></div>
        <div className="col-2 features__right">
          <h3>Watch all Movies & TV Shows once they get released!</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate aperiam deserunt quaerat? Doloremque expedita repellendus adipisci eligendi nobis illum! Perferendis ab blanditiis eius iste incidunt esse numquam asperiores hic suscipit.</p>
          <a className="btn btn-secondary" href="#">View Features</a>
        </div>
      </div>
    </section>
  );
};

export default Features;