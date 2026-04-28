import React from 'react';
import './Plans.css';

const Plans = () => {
  return (
    <section id="plans">
      <div className="row">
        <h2 className="section-title">Become a Premium Member</h2>
        <div className="container clearfix">
          <div className="plan">
            <div className="inner-plan">
              <h2>Free</h2>
              <h3>0/month</h3>
              <ul className="plan__features">
                <li>HD available</li>
                <li>Unlimited Movies and TV shows</li>
                <li>Watch on your phone & tablet</li>
                <li>Download and watch offline</li>
                <li>Screens you can watch</li>
                <li>First Month Free</li>
              </ul>
              <div>
                <button className="btn btn-primary">Choose Plan</button>
              </div>
            </div>
          </div>
          <div className="plan plan--featured">
            <div className="inner-plan recommended_plan">
              <h2 className="plan__badge">Recommended</h2>
              <h2>Basic</h2>
              <h3>$9.99/month</h3>
              <ul className="plan__features">
                <li>HD available</li>
                <li>Unlimited Movies and TV shows</li>
                <li>Watch on your phone & tablet</li>
                <li>Download and watch offline</li>
                <li>Screens you can watch</li>
                <li>First Month Free</li>
              </ul>
              <div>
                <button className="btn btn-primary">Choose Plan</button>
              </div>
            </div>
          </div>
          <div className="plan">
            <div className="inner-plan">
              <h2>Premium</h2>
              <h3>$19.99/month</h3>
              <ul className="plan__features">
                <li>HD available</li>
                <li>Unlimited Movies and TV shows</li>
                <li>Watch on your phone & tablet</li>
                <li>Download and watch offline</li>
                <li>Screens you can watch</li>
                <li>First Month Free</li>
              </ul>
              <div>
                <button className="btn btn-primary">Choose Plan</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;