import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../components/Pagination';
import ReactJson from 'react-json-view';
import Spinner from '../../components/Spinner';

const User = () => {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [repos, setRepos] = useState([]);
  const [totalPagesFollowers, setTotalPagesFollowers] = useState([]);
  const [currentPageFollowers, setCurrentPageFollowers] = useState(1);
  const [totalPagesRepos, setTotalPagesRepos] = useState([]);
  const [currentPageRepos, setCurrentPageRepos] = useState(1);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);

  const PER_PAGE = 10;

  const fetchUser = async () => {
    try {
      const res = await axios.get(`https://api.github.com/users/${router.query.user}`);
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const fetchFollowers = async () => {
    setIsLoadingFollowers(true);
    try {
      const res = await axios.get(`${user.followers_url}?per_page=${PER_PAGE}&page=${currentPageFollowers}`);
      const pageCount = Math.ceil(user.followers / PER_PAGE);
      const temp = [];
      for (let i = 1; i <= pageCount; i++) {
        temp.push(i);
      }
      setTotalPagesFollowers(temp);
      setFollowers(res.data);
    } catch (err) {
      console.log(err);
    }
    setIsLoadingFollowers(false);
  }

  const fetchRepos = async () => {
    setIsLoadingRepos(true);
    try {
      const res = await axios.get(`${user.repos_url}?per_page=${PER_PAGE}&page=${currentPageRepos}`);
      const pageCount = Math.ceil(user.public_repos / PER_PAGE);
      const temp = [];
      for (let i = 1; i <= pageCount; i++) {
        temp.push(i);
      }
      setTotalPagesRepos(temp);
      setRepos(res.data);
    } catch (err) {
      console.log(err);
    }
    setIsLoadingRepos(false);
  }

  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  useEffect(() => {
    if (Object.keys(user).length) {
      fetchFollowers();
      fetchRepos();
      return () => {};
    }
  }, [user, currentPageFollowers, currentPageRepos]);

  const handleFollowersPagination = (page) => {
    setCurrentPageFollowers(page);
  }

  const handleFollowersPaginationNextClick = () => {
    if (currentPageFollowers < totalPagesFollowers.length) {
      setCurrentPageFollowers(currentPageFollowers + 1);
    }
  }

  const handleFollowersPaginationPrevClick = () => {
    if (currentPageFollowers > 1) {
      setCurrentPageFollowers(currentPageFollowers - 1);
    }
  }

  const handleReposPagination = (page) => {
    setCurrentPageRepos(page);
  }

  const handleReposPaginationNextClick = () => {
    if (currentPageRepos < totalPagesRepos.length) {
      setCurrentPageRepos(currentPageRepos + 1);
    }
  }

  const handleReposPaginationPrevClick = () => {
    if (currentPageRepos > 1) {
      setCurrentPageRepos(currentPageRepos - 1);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p>
            {Object.keys(user).length ? <ReactJson src={user} /> : 'No data found!'}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6" style={{ padding: 20 }}>
          <h2>Followers</h2>
          <ul className="list-group mb-3">
            {followers.length && !isLoadingFollowers ? followers.map(follower => <li className="list-group-item" style={{ wordBreak: 'break-all' }} key={follower.id}>{follower.login}</li>) : <Spinner />}
          </ul>
          <Pagination
            totalPages={totalPagesFollowers}
            currentPage={currentPageFollowers}
            perPage={PER_PAGE}
            handlePaginationPrevClick={handleFollowersPaginationPrevClick}
            handlePagination={handleFollowersPagination}
            handlePaginationNextClick={handleFollowersPaginationNextClick}
          />
        </div>
        <div className="col-6" style={{ padding: 20 }}>
          <h2>Repos</h2>
          <ul className="list-group mb-3">
            {repos.length && !isLoadingRepos ? repos.map(repo => <li className="list-group-item" style={{ wordBreak: 'break-all' }} key={repo.id}>{repo.name}</li>) : <Spinner />}
          </ul>
          <Pagination
            totalPages={totalPagesRepos}
            currentPage={currentPageRepos}
            perPage={PER_PAGE}
            handlePaginationPrevClick={handleReposPaginationPrevClick}
            handlePagination={handleReposPagination}
            handlePaginationNextClick={handleReposPaginationNextClick}
          />
        </div>
      </div>
    </div>
  )
}

export default User;