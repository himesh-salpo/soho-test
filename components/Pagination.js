import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Pagination = ({ totalPages, currentPage, perPage, handlePaginationPrevClick, handlePagination, handlePaginationNextClick }) => (
  <div className="row mt-3">
    <div className="col">
      <div className="mb-3">
        <h5>{`Current Page: ${currentPage} | Per Page: ${perPage} | Total Pages: ${totalPages.length}`}</h5>
      </div>
      {totalPages.length ? (
        <nav aria-label="pagination">
          <ul className="pagination" style={{ flexWrap: 'wrap' }}>
            <li className="page-item"><button onClick={() => handlePaginationPrevClick()} className="page-link">Prev</button></li>
            {totalPages.map(page => {
              if (page <= 20) {
                return <li className={`page-item ${currentPage === page ? 'active' : ''}`} key={page}><button onClick={() => handlePagination(page)} className="page-link">{page}</button></li>
              }
            })}
            {totalPages.length > 20 ? <li className="page-item"><button onClick={() => handlePaginationNextClick()} className="page-link">Next</button></li> : null}
          </ul>
        </nav>
      ) : 'No data found!'}
    </div>
  </div>
)

export default Pagination;