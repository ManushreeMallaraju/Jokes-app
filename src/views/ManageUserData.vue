<template>
  <div>
    <!-- <h3>Manage User Data</h3>
    <form @submit.prevent>
      First Name:
      <input
        type="text"
        placeholder="Enter first name.."
        name="fname"
        v-model="user.fname"
      />
      <br />
      Last Name :
      <input
        type="text"
        placeholder="Enter last lname.."
        name="lname"
        v-model="user.lname"
      />
      <br />
      Age :
      <input
        type="number"
        placeholder="Enter your age.."
        name="age"
        v-model="user.age"
      />
      <br />
      <div>
        <button @click="createDoc" class="btn btn-primary">Create</button>
        <br />

         <button @click="readData" class="btn btn-primary">Read Doc</button>
         <br />
         can call realTimeDoc(), cannot call a lifecycle method with click -->

    <!-- <button type="button" class="btn btn-primary">MDB-Button</button> -->
    <!-- </div>
    </form> -->
    <!-- 
    <h3>Users List</h3>  -->

    <v-data-table
      :headers="headers"
      :items="usersArray"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Play with CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="openEditBox">New Item</v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <!-- re-using the same card for new user and existing user -->
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="user.fname"
                        label="First Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="user.lname"
                        label="Last Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="user.age"
                        label="Age"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>

                <v-btn
                  v-if="formTitle === 'New Item'"
                  color="blue darken-1"
                  @click="createDoc"
                  text
                >
                  Save
                </v-btn>
                <v-btn
                  v-if="formTitle === 'Edit Item'"
                  color="blue darken-1"
                  @click="updateDoc"
                  text
                >
                  Update
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { fstore } from "../firebase/firebase";

export default {
  data: () => ({
    // formTitle = '',
    loaded: false,
    dialog: false,
    dialogDelete: false,
    user: {
      fname: "",
      lname: "",
      age: 0,
    },
    usersArray: [], //users:[]
    activeUser: "",
    headers: [
      {
        text: "First Name",
        align: "start",
        value: "fname",
      },
      { text: "Last Name", value: "lname" },
      { text: "Age", value: "age" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    userIndex: null,

    defaultItem: {
      fname: "",
      lname: "",
      age: 0,
    },
  }),

  mounted() {
    // this.readData()
   // this.readAllUserInfo();
    this.observeRealTimeChanges();
  },

  computed: {
    /*eslint no-constant-condition: "error"*/
    formTitle() {
      return this.userIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
    // this.loaded = true;
  },

  methods: {
    openEditBox() {
      this.userIndex = -1; //in order to assisgn 'formTitle' = 'New Item'
      this.initialize();
      this.dialog = true;
    },
    initialize() {
      this.user = [
        {
          fname: "",
          lname: "",
          age: 0,
        },
      ];
    },

    editItem(item) {
      this.userIndex = item.id;
      // console.log(this.userIndex);
      var docRef = fstore.collection("userInfo").doc(this.userIndex);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.user.fname = doc.data().fname; //In the component, I'm reusing the 'user' variable
            this.user.lname = doc.data().lname;
            this.user.age = doc.data().age;
            this.dialog = true;
            // this.loaded = false;
            // this.updateDoc(item);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });

      // this.editedItem = Object.assign({}, item)
    },

    deleteItem(item) {
      this.userIndex = item.id;
      // this.editedItem = Object.assign({}, item);

      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      // this.users.splice(this.userIndex, 1);
      var docID = this.userIndex;
      // console.log(docID)
      fstore
        .collection("userInfo")
        .doc(docID)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          //  this.readData();
           this.usersArray.splice(docID, 1);
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.userIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.userIndex = -1;
      });
    },

    observeRealTimeChanges() {
      console.log("Changes between snapshots");
      fstore.collection("userInfo").onSnapshot((snapShot) => {
        snapShot.docChanges().forEach(
          (change) => {
            if (change.type === "added") {
              //some kind of metadata --> confirmation, what is being added:
              //  console.log("New city: ", change.doc.data());
              // this.usersArray.push(change.doc.data());
              // this.loaded;
              this.readAllUserInfo();
            }
            if (change.type === "modified") {
              this.readAllUserInfo();
            }
            if (change.type === "removed") {
              this.readAllUserInfo();
             
            //  console.log("Removed doc: ", change.doc.data());
            }
          },
          (error) => {
            console.log("Error in listening ", error);
          }
        );
      });
    },

    updateDoc() {
      console.log(this.user);
      fstore
        .collection("userInfo")
        .doc(this.userIndex)
        .update({
          fname: this.user.fname, //need to specify the fields to be updated, which matched firebase doc fields
          lname: this.user.lname,
          age: this.user.age,
        })
        .then(() => {
          console.log("Document successfully updated!");
          // this.readData();
          // this.$set(this.usersArray,this.userIndex,this.user);
          this.dialog = false;
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },

    createDoc() {
      const newDocRef = fstore.collection("userInfo").doc(); // this will create a new document with an autogenrated ID
      const docId = newDocRef.id;
      // set the document with data
      fstore
        .collection("userInfo")
        .doc(docId)
        .set({
          id: docId, // cannot access docID if we use .add()
          fname: this.user.fname,
          lname: this.user.lname,
          age: this.user.age,
        })
        .then(console.log("New document successfully created"))
        .catch((error) => {
          console.log(error.message);
        });
      this.close();
    },

    readAllUserInfo() {
      //real-time listener

     //  this.usersArray = []; is NOT reactive, need to use Vue.set() to make it reactive
    // this.$set(this.usersArray,[]);
    this.usersArray.splice(0, this.usersArray.length) // this also re-loades the page, not good
    // this.usersArray.$set(0,[]);
      fstore
        .collection("userInfo")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            this.usersArray.push(doc.data()); //this could be modified -- 
          });
        });
    },
  },
};
</script>

<style>
</style>