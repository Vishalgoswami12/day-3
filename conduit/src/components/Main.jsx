import React, { Component } from "react";
import { Switch, Route,BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import Homepage from "./Homepage";
import Signin from "./Signin";
import Signup from "./Singup";
import Singlepost from "./Singlepost";
import { localStorageKey, userVerifyURL } from "../Utilis/Constant";
import Fullpagespinner from "./Fullpagespinner";
import NotFound from "./NotFound";
import NewPost from "./NewPost";
import Setting from "./Setting";
import UserProfile from "./UserProfile";


export default class Main extends Component {
  state = {
    isLoggedIn: false,
    user: null,
    isVerified: true,
  };

  componentDidMount() {
    const storageKey = localStorage.getItem(localStorageKey);
    fetch(userVerifyURL, {
      method: "GET",
      headers: {
        authorization: `Token ${storageKey}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ user }) => {
        this.updateUser(user);
      })
      .catch((error) => {
        this.setState({ isVerified: false });
      });
  }

  updateUser = (userData) => {
    this.setState({
      isLoggedIn: true,
      user: userData,
      isVerified: false,
    });
    localStorage.setItem("localStorageKey", userData.token);
  };
 
  render() {
    console.log(this.state)
    if (this.state.isVerified) {
      return <Fullpagespinner />;
    }
    return (
      <>
      <Router>
      <Header isLoggedIn={this.state.isLoggedIn} />
        {this.state.isLoggedIn && this.state.user===null? (
          <AuthenticatedApp updateUser={this.updateUser} />
        ) : (
          <UnauthenticatedApp />
        )}
        </Router>
      </>
    );
  }
}

function UnauthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/register">
          <Signup updateUser={props.updateUser} />
        </Route>
        <Route path="/login">
          <Signin updateUser={props.updateUser} />
        </Route>
        <Route path="/article" component={Singlepost}/>
        <Route path="/" exact={true}component={Homepage}/>
        <Route  exact={true} >
            <NotFound />
        </Route>
    </Switch>
  );
}

function AuthenticatedApp() {
  return (
    <Switch>
       
        <Route path="/article">
          <Singlepost />
        </Route>
        <Route path="/article/new">
          <NewPost />
        </Route>
        <Route path="/settings">
          <Setting />
        </Route>
        <Route path="/users/profile">
          <UserProfile />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
        <Route path="/" exact>
          <Homepage />
        </Route>
    </Switch>
  );
}