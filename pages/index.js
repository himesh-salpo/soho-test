import Head from 'next/head';
import { useEffect, useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Link from 'next/link';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import { useRef } from 'react';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(false);

  const PER_PAGE = 10;

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevPage = usePrevious(currentPage);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`https://api.github.com/search/users?q=${encodeURIComponent(`${searchTerm} in:login`)}&per_page=${PER_PAGE}&page=${currentPage}`);
      const pageCount = Math.ceil(res.data.total_count / PER_PAGE);
      const temp = [];
      for (let i = 1; i <= pageCount; i++) {
        temp.push(i);
      }
      setTotalPages(temp);
      setUsers(res.data.items);
    } catch (err) {
      setError(true);
    }
  }

  useEffect(() => {
    setError(false);

    if (searchTerm.length > 2) {
      fetchUsers();
      return () => {};
    }
  }, [searchTerm]);

  useEffect(() => {
    setError(false);

    if (currentPage > prevPage) {
      fetchUsers();
      return () => {};
    }
  }, [currentPage]);

  const handleOnChange = (e) => {
    setUsers([]);
    setSearchTerm(e.target.value);
  }

  const handleUsersPagination = (page) => {
    setCurrentPage(page);
  }

  const handleUsersPaginationNextClick = () => {
    if (currentPage < totalPages.length) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handleUsersPaginationPrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const renderUser = () => {
    if (users.length) {
      return (
        <div className="row">
          <div className="col-6">
            <ul className="list-group mb-3">
              {users.map(user => (
                <Link as={`/users/${user.login}`} href="/users/[user]" key={user.id}>
                  <li className="list-group-item" style={{ wordBreak: 'break-all' }}>
                    <button className="btn btn-link">{user.login}</button>
                  </li>
                </Link>
              ))}
            </ul>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              perPage={PER_PAGE}
              handlePaginationPrevClick={handleUsersPaginationPrevClick}
              handlePagination={handleUsersPagination}
              handlePaginationNextClick={handleUsersPaginationNextClick}
            />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          Seems like something went wrong, Please try again.
        </div>
      );
    }
  }

  return (
    <div className="container-fluid">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <div className="input-group mb-3">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => handleOnChange(e)}
                className="form-control" 
                placeholder="Github username" 
                aria-label="Github username" 
                aria-describedby="basic-addon2"
              />
            </div>
          </div>
        </div>
        {renderUser()}
        {searchTerm !== '' && !users.length && !error ? (
          <Spinner />
        ) : <></>}
      </div>
    </div>
  )
}

export default Home;
