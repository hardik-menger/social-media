import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
export default () => {
  return (
    <footer id="myFooter" className="mt-4">
      <div className="container">
        <div className="row">
          <div className="col-sm-3 myCols">
            <h5>Get started</h5>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/">Sign up</Link>
              </li>
              <li>
                <Link to="/">Downloads</Link>
              </li>
            </ul>
          </div>
          <div className="col-sm-3 myCols">
            <h5>About us</h5>
            <ul>
              <li>
                <Link to="/">Company Information</Link>
              </li>
              <li>
                <Link to="/">Contact us</Link>
              </li>
              <li>
                <Link to="/">Reviews</Link>
              </li>
            </ul>
          </div>
          <div className="col-sm-3 myCols">
            <h5>Support</h5>
            <ul>
              <li>
                <Link to="/">FAQ</Link>
              </li>
              <li>
                <Link to="/">Help desk</Link>
              </li>
              <li>
                <Link to="/">Forums</Link>
              </li>
            </ul>
          </div>
          <div className="col-sm-3 myCols">
            <h5>Legal</h5>
            <ul>
              <li>
                <Link to="/">Terms of Service</Link>
              </li>
              <li>
                <Link to="/">Terms of Use</Link>
              </li>
              <li>
                <Link to="/">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="social-networks">
        <Link to="/" className="twitter">
          <i className="fab fa-twitter" />
        </Link>
        <Link to="/" className="facebook">
          <i className="fab fa-facebook" />
        </Link>
        <Link to="/" className="google">
          <i className="fab fa-google-plus" />
        </Link>
      </div>
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} Copyright Text </p>
      </div>
    </footer>
  );
};
