import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the server API
    fetch("http://localhost:4000/api/portfolio")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPortfolioItems(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="text-center my-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center my-4">Error: {error}</div>;
  }

  return (
    <div className="container my-4">
      <div className="row portfolio-container">
        {portfolioItems.length === 0 ? (
          <div className="col-12 text-center">
            <h4>No portfolio items found.</h4>
          </div>
        ) : (
          portfolioItems.map((item, index) => (
            <div
              key={index}
              className={`col-lg-4 col-md-6 portfolio-item filter-${item.type}`}
            >
              <div className="card">
                <div className="portfolio-img">
                  <img
                    className="card-img-top img-fluid"
                    src={item.image}
                    alt={item.title}
                  />
                </div>
                <div className="card-body text-center portfolio-info">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.location}</p>
                  <a
                    href={item.image}
                    className="btn btn-primary portfolio-lightbox preview-link"
                    title={item.title.toUpperCase()}
                  >
                    <i className="bi bi-eye"></i> View
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
