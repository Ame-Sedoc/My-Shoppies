import React from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { PageHeader } from "./container/PageHeader";
import { SearchTile } from "./container/SearchTile";

function App() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [results, setResults] = React.useState([]);
  const [nominations, setNominations] = React.useState(
    JSON.parse(localStorage.getItem("nominations") || "[]")
  );

  const find = React.useCallback(debounce(searchAPI, 600), []);
  const nominate = (props) => {
    setNominations((existingNominations) => {
      const newNom = existingNominations.filter(
        (nomination) => nomination.id !== props.id
      );
      if (!props.denominate) {
        newNom.push({
          Title: props.Title,
          Poster: props.Poster,
          Year: props.Year,
          id: props.id,
        });
      }
      localStorage.setItem("nominations", JSON.stringify(newNom));
      if (newNom.length === 5) {
        toast.success("You Have 5 Nominations", { toastId: "happy" });
      }
      return newNom;
    });
  };
  const handleSearch = (event) => {
    setSearch(event.target.value);
    find(event.target.value, page);
  };

  const changePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    find(search, newPage);
  };

  async function searchAPI(value, page) {
    try {
      const response = await axios.get("https://www.omdbapi.com", {
        params: {
          apikey: "b9d36027",
          s: value,
          page,
        },
      });
      if (response.data.Response === "True") {
        setResults(response.data.Search);
        setTotalPages(Math.ceil(response.data.totalResults / 10));
      } else {
        setPage(1);
        setTotalPages(1);
        setResults([]);
      }
    } catch (error) {
      setPage(1);
      setTotalPages(1);
      setResults([]);
    }
  }
  return (
    <div className="pagecontainer">
      <main>
        <PageHeader />
        <SearchTile handleSearch={handleSearch} search={search} />

        <section className="results">
          <div className="tile">
            <h3>
              Results for <i>{search}</i>
            </h3>
            <ul className="movielist">
              {results.map((result) => (
                <Movie
                  key={result.imdbID}
                  id={result.imdbID}
                  Poster={result.Poster}
                  Title={result.Title}
                  Year={result.Year}
                  disabled={nominations.find(
                    (nomination) => nomination.id === result.imdbID
                  )}
                  nominate={nominate}
                />
              ))}
            </ul>
            {totalPages > 1 && <div className="pagination">
              <button
                className="btn"
                disabled={page <= 1}
                onClick={(event) => changePage(event, page - 1)}
              >
                &laquo;
              </button>
              <button
                className="btn"
                disabled={page >= totalPages}
                onClick={(event) => changePage(event, page + 1)}
              >
                &raquo;
              </button>
            </div>}
          </div>
          <div className="tile">
            <h3>Nominations</h3>
            <ul className="movielist">
              {nominations.map((result) => (
                <Movie
                  key={result.id}
                  id={result.id}
                  Poster={result.Poster}
                  Title={result.Title}
                  Year={result.Year}
                  nominate={nominate}
                  isNomination
                />
              ))}
            </ul>
          </div>
        </section>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        closeOnClick
        limit={1}
      />
    </div>
  );
}

export default App;

function Movie(props) {
  return (
    <li className="movie">
      <div className="moviedetails">
        <div className="imgcontainer">
          <img src={props.Poster} alt={props.Title} />
        </div>
        <div className="details">
          <span className="title">{props.Title}</span>
          <span>{props.Year}</span>
        </div>
      </div>
      <button
        className="nombutton"
        disabled={props.disabled}
        onClick={(event) => {
          event.preventDefault();
          props.nominate({
            Title: props.Title,
            Poster: props.Poster,
            Year: props.Year,
            id: props.id,
            denominate: props.isNomination,
          });
        }}
      >
        {props.isNomination ? "Remove" : "Nominate"}
      </button>
    </li>
  );
}
