/* eslint-disable func-names */
/* eslint-disable object-shorthand */
const app = new Vue({
  el: '#app',
  data: { // all the necessary attributes to make this thing hapen
    title:'Node Email Client',
    people: [],
    checkedNames: [],
    currentListType: 'Personal',
    subject: '',
    emailContent: '',
    showModal: false,
    loading: true,
    titles: [],
    modalTitle: '',
    nameToModify: {
      id: null,
      name: '',
      email: '',
      listType: 'Personal',
    }
  },
  methods: {
    doPostRequest: async function (url,body) {
      const response = await fetch(url, { // have some fun aside from the standard xhr
        method: 'post',
        headers: { // set the headers
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: body, // cannot forget the body
      })
        .catch((error) => { // whoops
          console.log('Request failed', error);
          return false;
        });
      // no json from a head response
      if (response.status === 204) return { res: 'Success',status: response.status };
      // send back the json
      const res = await response.json();
      return { res, status: response.status };
    },
    sendEmail: function (e) {
      // no reloading please
      e.preventDefault();
      // form the url and bind all of the emails together
      let url = `subject=${this.subject}&content=${this.emailContent}&to=`;
      this.checkedNames.forEach(element => {
        url += `${element.email}|`;
      });
      // remove the last \
      url = url.substring(0,url.length-1);
      // send it out
      this.doPostRequest('/sendEmail', url)
        .then( (request) => {
          // handle the return data
          // it worked
          if (request.status === 200) {
            const json = JSON.parse(request.res);
            this.displaySuccess(`Successfully emailed ${json.envelope.to} at ${new Date()}`,true);
          }
          else {
            // yeah nice try
            // 500 error
            this.displaySuccess('Something went wrong. Please try again later',false);
          }
        });
    },
    displaySuccess: function (msg,goodResult) {
      // old school grab the div
      const success = document.querySelector('#success');
      success.classList.remove('d-none');
      // are we naughty or nice
      success.classList.add( (goodResult) ? 'alert-success' : 'alert-danger' );
      // update the content
      success.textContent = msg;
    },
    displayModal: function (e) {
      // let the modal be seen
      e.preventDefault();
      // display it
      this.modalTitle = 'Add User';
      // clear the user object
      this.nameToModify = {
        id: null,
        name: '',
        email: '',
        listType: this.currentListType,
      };
      this.showModal = !this.showModal;
    },
    getUsers: function (url) {
      // standard get request protocol
      const xhr = new XMLHttpRequest();
      // open with the headers
      xhr.open('GET',url);
      xhr.setRequestHeader('Accept', 'application/json');
      // make sure we go to the right place
      if (url.includes('getUsers')) {
        xhr.onload= () => this.parseGetUser(xhr);
      }
      else if (url.includes('getTitles')) {
        xhr.onload= () => this.parseGetTitles(xhr);
      }
      // send it off
      this.loading = true;
      xhr.send();
    },
    parseGetUser: function (xhr) {
      // clear the previous people
      this.people = [];
      // parse the new folks
      const obj = JSON.parse(xhr.response);
      this.people = obj;
      // no need to load
      this.loading = false;
    },
    parseGetTitles: function (xhr) {
      // clear the old titles
      this.titles = [];
      const obj = JSON.parse(xhr.response);
      // put in new ones and cancel loading
      this.titles = obj;
      this.loading = false;
    },
    loadOtherUser: function () {
      // get the users of the current type
      this.getUsers(`/getUsers?contactListType=${this.currentListType}`);
    },
    addOrUpdateUser: function () {
      // make our url
      const url = `name=${this.nameToModify.name}&email=${this.nameToModify.email}&id=${this.nameToModify.id}&listType=${this.nameToModify.listType}`;
      // send it out  
      this.doPostRequest('/addOrUpdateUser', url)
        .then( (request) => {
          // oh look a successful insert
          if (request.status === 201) {
            this.displaySuccess(`Successfully added ${this.nameToModify.name} to the  ${this.nameToModify.listType} list`,true);
            this.getUsers(`/getUsers?contactListType=${this.nameToModify.listType}`);
          }
          else if (request.status === 204) {
            // hey at least we updated
            this.displaySuccess(`User ${this.nameToModify.name} has been successfully updated`,true);
            this.getUsers(`/getUsers?contactListType=${this.nameToModify.listType}`);
          }
          else if (request.status === 400) {
            // someone probably mistyoed an email
            this.displaySuccess('Guess those parameters need to be more accurate');
          } else {
            this.displaySuccess(request.res.message, false);
          }
          // reset back to normal
          this.showModal = !this.showModal;
          this.currentListType = this.nameToModify.listType;
          this.nameToModify = {
            id: null,
            name: '',
            email: '',
            listType: this.currentListType,
          };
        });
    },
    displayUpdateModal: function (e,person) {
      // abort abort
      e.preventDefault();
      // setting the properties when we want the modal to update
      this.nameToModify = person;
      this.nameToModify.listType = this.currentListType;
      this.modalTitle = `Updating ${person.name}`;
      this.showModal = !this.showModal;
    }
  },
  // end methods
  created() {
    // checking for local storage
    this.loadOtherUser();
    this.getUsers('/getTitles');
  },// end created
  computed: {

  },
});

