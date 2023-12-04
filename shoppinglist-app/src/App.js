import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import Delete from "@mui/icons-material/Delete";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Box,
  Grid,
  FormGroup,
  FormControl,
} from "@mui/material";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore/lite";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOFAOgHBsrwPPecsWK_3HDmAQlR6ALWrg",
  authDomain: "shoppinglistapp-706f6.firebaseapp.com",
  projectId: "shoppinglistapp-706f6",
  storageBucket: "shoppinglistapp-706f6.appspot.com",
  messagingSenderId: "637020103555",
  appId: "1:637020103555:web:e95a42ea272f495e454cb6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const useStyles = styled((theme) => ({
  appBar: {
    backgroundColor: theme.palette.primary.main,
  },
  bannercontainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  container: {
    textAlign: "center",
    marginTop: theme.spacing(5),
  },
  form: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },

  paper: {
    padding: theme.spacing(2),
  },
}));

function Banner() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Container className={classes.bannercontainer}>
        <div>
          <Button component={Link} to="/shoppinglist" color="inherit">
            Shopping List
          </Button>
          <Button onClick={() => signOut(auth)} color="inherit">
            Logout
          </Button>
        </div>
      </Container>
    </AppBar>
  );
}

const ShoppingList = () => {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const itemsCollection = collection(db, "items");
    const itemsSnapshot = await getDocs(itemsCollection);

    const items = itemsSnapshot.docs.map((doc) => ({
      name: doc.data().name,
      count: doc.data().count,
      id: doc.id,
    }));

    setItems(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addItem = async (newItem) => {
    const docRef = await addDoc(collection(db, "items"), newItem);
    newItem.id = docRef.id;
    setItems([...items, newItem]);
  };

  const removeItem = async (item) => {
    await deleteDoc(doc(db, "items", item.id));
    const filteredArray = items.filter(
      (collectionItem) => collectionItem.id !== item.id
    );
    setItems(filteredArray);
  };

  return (
    <Container
      className={classes.container}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
      }}>
      <Typography variant="h4" gutterBottom>
        Shopping List
      </Typography>
      <Grid container justifyContent="center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newItem = {
              name: e.target.name.value,
              count: e.target.count.value,
            };
            addItem(newItem);
            e.target.reset();
          }}
          className={classes.form}>
          <TextField
            label="Item"
            name="name"
            variant="outlined"
            className={classes.textField}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginY: 2,
              textAlign: "center",
            }}
          />
          <TextField
            label="Count"
            name="count"
            type="number"
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginY: 2,
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </form>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper className={classes.paper}>
            <List>
              {loading && <p>Loading...</p>}
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #ccc",
                    borderRadius: 5,
                    marginY: 2,
                  }}>
                  <ListItemText primary={`${item.name} ${item.count}`} />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeItem(item)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/shoppinglist");
    } catch (error) {
      console.error("Login failed", error.message);
    }
  };

  return (
    <Container>
      <form onSubmit={handleLogin}>
        <FormGroup className="mb-3">
          <FormControl className="">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </FormGroup>
        <Button type="submit">Login</Button>
      </form>
    </Container>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Banner />
        <Routes>
          <Route
            path="/shoppinglist"
            element={user ? <ShoppingList /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              user ? <Navigate to="/shoppinglist" /> : <Login auth={auth} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
