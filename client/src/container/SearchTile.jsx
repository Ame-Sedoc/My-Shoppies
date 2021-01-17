export function SearchTile(props) {
  return (
    <section>
      <div className="tile tileone">
        <div>
          <h3>Movie Title</h3>
          <div className="inputwrapper">
            <input
              type="text"
              placeholder="Enter Movie Title"
              className="searchbar"
              value={props.search}
              onChange={props.handleSearch}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
