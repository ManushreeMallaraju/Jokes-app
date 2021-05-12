<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="register">  <!--register method will get called on submitting the form -->
      <input type="text" placeholder="Email" v-model="email" />
      <input type="text" placeholder="password" v-model="password" />
      <input type="submit" value="Register" />
      <p>
        Have an account ?
        <router-link to="/login">Login Here</router-link>
      </p>
    </form>
    
  </div>
</template>

<script>
import {auth} from '../firebase/firebase';

export default {
  data: () => ({
    email: "",
    password: "",
  }),
  methods: {
    register() {
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => console.log(data))
        .catch((err) => alert(err.message));
    }
  },
};
</script>
