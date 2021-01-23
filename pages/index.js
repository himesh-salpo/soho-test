import Head from 'next/head';
import { useEffect, useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Link from 'next/link';
import Spinner from '../components/Spinner';

const Home = () => {
  const [user, setUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`https://api.github.com/users/${searchTerm}`);
      setUser(res.data);
    } catch (err) {
      setError(true);
    }
  }

  useEffect(() => {
    setError(false);

    if (searchTerm.length > 2) {
      fetchUser();
      return () => {};
    }
  }, [searchTerm]);

  const handleOnChange = (e) => {
    setUser({});
    setSearchTerm(e.target.value);
  }

  const renderUser = () => {
    if (Object.keys(user).length) {
      return (
        <div className="card" style={{ width: `${18}rem` }}>
          <img className="card-img-top" src={user.avatar_url} alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">{user.login}</h5>
            <p className="card-text">{`Followers: ${user.followers}`}</p>
            <p className="card-text">{`Following: ${user.following}`}</p>
            <Link as={`/users/${user.login}`} href="/users/[user]">
              <button className="btn btn-primary">View</button>
            </Link>
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
        <div className="d-flex flex-column align-items-center">
          {renderUser()}
          {searchTerm !== '' && !Object.keys(user).length && !error ? (
            <Spinner />
          ) : <></>}
        </div>
      </div>
    </div>
  )
}

export default Home;
