
import React, { useState, useEffect } from "react";
import { Backdrop, CircularProgress, Card, CardContent, Typography, CardActionArea, CardMedia, Pagination, IconButton, TextField, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import styles from './User.module.css';
import RepositoryModal from '../../components/RepositoryModal'; // Substitua pelo caminho correto


const fetchUrl = async (url) => {
  try {
    return fetch(url).then(response => response.json())
  } catch (err) {
    return undefined;
  }
}

const Users = () => {
  const [users, setUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [searchLogin, setSearchLogin] = useState('');
  const [isRepositoryModalOpen, setRepositoryModalOpen] = useState(false);
  const [selectedRepositoryUser, setSelectedRepositoryUser] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/?since=0&page=${currentPage}`)
      .then((response) => response.json())
      .then(async (users) => {
        const usersJson = [];
        setCurrentPage(users.actual_page);
        setTotalPages(users.total_pages);

        for (let user of users.rows) {
          const repos = await fetchUrl(user.reposUrl) ?? 0;
          const followers = await fetchUrl(user.followersUrl) ?? 0;
          const following = await fetchUrl(user.followingUrl) ?? 0;
          Object.assign(user, {
            repos: repos ? repos.length : repos,
            followers: followers ? followers.length : followers,
            following: following ? following.length : following,
          });
          usersJson.push(user);
        }
        setUsers(users.rows);
      });
  }, [currentPage]);

  const handleChangePage = (event, newPage) => {
    setUsers(null);
    setCurrentPage(newPage);
  };

  const handleSearch = async () => {
    if (searchLogin) {
      try {
        const response = await fetch(`https://api.github.com/users/${searchLogin}`);
        if (response.ok) {
          const user = await response.json();
          setUsers([user]); // Define o usuário encontrado como a lista de usuários
        } else {
          setUsers([]); // Limpa a lista de usuários se não encontrar
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    }
  };

  const handleRepositoryModalOpen = (username) => {
    setSelectedRepositoryUser(username);
    setRepositoryModalOpen(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>GitHub Users</h1>
        <IconButton
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          color="inherit"
          className={styles.darkModeToggle}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </header>

      <div className={styles.searchContainer}>
        <TextField
          label="Login"
          variant="outlined"
          value={searchLogin}
          onChange={(e) => setSearchLogin(e.target.value)}
          className={styles.searchInput}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          className={`${styles.searchButton} ${darkMode ? styles.lightButton : ''}`}
          style={{ backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : 'black', marginLeft: '10px' }}
        >
          Search
        </Button>
      </div>

      <div className={styles.content}>
        {users ? (
          users.map((user, index) => (
            <Card key={index} className={styles.userCard} onClick={() => {
              setSelectedRepositoryUser(user); // Armazena os dados do usuário selecionado
              setRepositoryModalOpen(true); // Abre o modal
            }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="360"
                  image={user.avatarUrl}
                  alt={user.login}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" className={styles.userName}>
                    {user.login}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className={styles.userInfo}>
                    Repo: {user.url}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className={styles.userInfo}>
                    Followers: {user.followers || '0'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className={styles.userInfo}>
                    Following: {user.following || '0'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          <Backdrop
            open={true}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </div>
      {users && (
        <div className={styles.pagination}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            size="large"
          />
        </div>
      )}

      <RepositoryModal
        isOpen={isRepositoryModalOpen}
        onClose={() => setRepositoryModalOpen(false)}
        username={selectedRepositoryUser.login}
      />
    </div>
  );
};

export default Users;
