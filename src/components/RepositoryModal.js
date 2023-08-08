import React, { useState, useEffect } from "react";
import { Card, CardContent, Modal, CircularProgress, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RepositoryModal = ({ isOpen, onClose, username }) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && username) {
      fetchRepositories();
    }
  }, [isOpen, username]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card style={{ maxWidth: 400 }}>
        <CardContent>
          <IconButton
            onClick={onClose}
            aria-label="Close Modal"
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-title" variant="h6" component="div">
            Repositories of {username}
          </Typography>
          <div style={{ textAlign: 'center' }}>
            {loading ? (
              <CircularProgress />
            ) : (
              repositories.map((repo) => (
                <Typography key={repo.id} variant="body2" component="div">
                  {repo.name}
                </Typography>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default RepositoryModal;
