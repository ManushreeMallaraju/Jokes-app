<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="Email" v-model="email" />
      <!--bind the data to respective input elements through v-model attribute-->
      <input type="text" placeholder="password" v-model="password" />
      <input type="submit" value="Login" />
      <p>
        Need an account ?
        <router-link to="/register">Register Here</router-link>
      </p>
    </form>
    <button @click="addUserData">Add Data</button>
    <p>
      Need to manage User Data ?
      <router-link to='/manageUserData'>Click Here !</router-link>
    </p>

  </div>
</template>

<script>
import {fstore, auth} from '../firebase/firebase.js'


export default {
  data: () => ({
    email: "",
    password: "",
  }),
  methods: {
    Login() {
        auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then((data) => console.log(data))
        .catch((err) => alert(err.message));
    },   
    addUserData() {
      console.log("entering the method ")

      fstore
        .collection('userInfo')
        .doc("generateAutoID")
        .set({
          firstName: "David",
          LastName: "Gomez",
          Age: 55,
        })
        .then(() => {  //do not pass data in then(())
          console.log("Doc added successfully");
        })
        .catch((err) => {
          console.log("Error in writing the doc: ", err);
        });
    },
  },
};
</script>

<style>
</style>