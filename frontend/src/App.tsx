import React, { useEffect, useState } from 'react';
import './App.css';
import { IconButton, createStyles, makeStyles, TextField, Theme, FormControlLabel, Checkbox } from '@material-ui/core';
import { Refresh, Publish, Delete } from '@material-ui/icons'
import axios from 'axios';
import { Image } from './types';

axios.defaults.baseURL = 'https://micl-shopify.herokuapp.com';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      margin: 10
    }
  })
);

function App() {
  const [password, setPassword] = useState('foo');
  const [images, setImages] = useState<Image[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const styles = useStyles();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const uri = event.target.value;
    if (isChecked) {
      setChecked(checked => new Set(checked).add(uri));
    } else {
      setChecked(checked => {
        const newChecked = new Set(checked);
        newChecked.delete(uri);
        return newChecked;
      });
    }
  }

  async function refresh() {
    const res = await axios.get('/images', {
      params: {
        password
      }
    })
    setImages(res.data);
  }

  async function uploadFiles(event: React.ChangeEvent<HTMLInputElement>, _public: boolean) {
    const formData = new FormData();
    const files = event.target.files;
    if (files != null) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      formData.append('data', JSON.stringify(Array.from(files as any).map((file: any) => ({
        password,
        public: _public
      }))))
      axios.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => refresh())
        .catch(err => console.log(err));
    }
  }

  async function deleteChecked() {
    axios.delete('/images', {
      data: {
        password,
        images: Array.from(checked)
      }
    })
      .then(res => refresh())
      .catch(err => console.log(err));
  }

  useEffect(() => {
    refresh();
  }, [])

  return (<>
    <div className={styles.root}>
      <p>The password here protects your images. You'll need to enter the corresponding password to be able to delete an image or view private images with that password.</p>
      <TextField id="password" label="Password" value={password} onChange={handlePasswordChange} />
      <IconButton aria-label="refresh" onClick={refresh}>
        <Refresh />
      </IconButton>
      Upload publicly:
      <input type="file" id="input" accept="image/*" multiple onChange={e => uploadFiles(e, true)} />
      Upload privately:
      <input type="file" id="input" multiple onChange={e => uploadFiles(e, false)} />
      {/* <IconButton aria-label="upload" onClick={upload}>
        <Publish />
      </IconButton> */}
      <IconButton aria-label="delete" onClick={deleteChecked}>
        <Delete />
      </IconButton>
      <br />
      <br />
      {images.map(image => <FormControlLabel key={image.uri}
        control={
          <Checkbox checked={checked.has(image.uri)} onChange={handleCheck} value={image.uri} />
        }
        label={
          <img src={image.uri} height={100} />
        }
      />)}
    </div>
  </>);
}

export default App;
