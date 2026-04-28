import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section id="how-it-works">
      <div className="row">
        <h2 className="section-title">How it works?</h2>
        <p>We will show you step by step how to start watching your favorite movies & tv shows starting now!</p>
      </div>

      <div className="row">
        <div className="icon-box col-3">
          <i className="fas fa-sign-in-alt fa-3x"></i>
          <h3>Register</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam dolor repellendus minus doloribus tenetur accusamus?</p>
        </div>
        <div className="icon-box col-3">
          <i className="fab fa-buffer fa-3x"></i>
          <h3>Choose a Plan</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam dolor repellendus minus doloribus tenetur accusamus?</p>
        </div>
        <div className="icon-box col-3">
          <i className="far fa-smile fa-3x"></i>
          <h3>Enjoy Movies</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam dolor repellendus minus doloribus tenetur accusamus?</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;