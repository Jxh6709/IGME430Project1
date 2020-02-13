const app = new Vue({
    el: '#app',
    data: {
        title:"Node Email Client",
        people: [],
        checkedNames: [],
        selectedTerm: 'Personal',
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
            listType: 'Personal'
        }
    },
    methods: {
        doPostRequest: async function(url,body) {
            let response = await fetch(url, {
                method: 'post',
                headers: {
                  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: body
              })
              .catch(function (error) {
                console.log('Request failed', error);
                return false;
                });
            //no json from a head response
            if (response.status === 204) return {res: 'Success',status: response.status};
            let res = await response.json();
            return {res: res, status: response.status};

        },
        sendEmail: function(e) {
            e.preventDefault();

            let url = `subject=${this.subject}&content=${this.emailContent}&to=`;
            this.checkedNames.forEach(element => {
               url += element.email + '|'; 
            });
            //remove the last \
            url = url.substring(0,url.length-1);

            this.doPostRequest('/sendEmail', url)
            .then( (request) => {
                const json = JSON.parse(request.res);
                this.displaySuccess(`Successfully emailed ${json.envelope.to} at ${new Date()}`,true);
            }); 
        },
        displaySuccess(msg,goodResult) {
            let success = document.querySelector("#success");
            success.classList.remove("d-none");
            success.classList.add( (goodResult) ? 'alert-success' : 'alert-danger' );
            success.textContent = msg;
        },
        displayModal: function(e) {
            e.preventDefault();
            this.modalTitle = "Add User"
            this.showModal = !this.showModal;
        },
        getUsers: function(url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET',url);
            xhr.setRequestHeader("Accept", "application/json");
            if (url.includes('getUsers')) {
                xhr.onload= () => this.parseGetUser(xhr);
            }
            else if (url.includes('getTitles')) {
                xhr.onload= () => this.parseGetTitles(xhr);
            }
            this.loading = true;
            xhr.send();
        },
        parseGetUser: function(xhr) {
            this.people = [];
            this.people.length = 0;
            const obj = JSON.parse(xhr.response);
            this.people = obj;
            this.loading = false;
        },
        parseGetTitles: function(xhr) {
            this.titles = [];
            const obj = JSON.parse(xhr.response);
            this.titles = obj;
            this.loading = false;
        },
        loadOtherUser: function() {
            this.getUsers(`/getUsers?contactListType=${this.selectedTerm}`);
        },
        addOrUpdateUser: function() {
            //make our url
            let url = `name=${this.nameToModify.name}&email=${this.nameToModify.email}&id=${this.nameToModify.id}&listType=${this.nameToModify.listType}`;
            
            this.doPostRequest('/addOrUpdateUser', url) 
            .then( (request) => {
                //const json = JSON.parse(request.res);
                if (request.status === 201) {
                    this.displaySuccess(`Successfully added ${this.nameToModify.name} to the  ${this.nameToModify.listType} list`,true);
                    this.getUsers(`/getUsers?contactListType=${this.nameToModify.listType}`);
                }
                else if (request.status === 204) {
                    this.displaySuccess(`User ${this.nameToModify.name} has been successfully updated`,true);
                    this.getUsers(`/getUsers?contactListType=${this.nameToModify.listType}`);
                }
                else if (request.status === 400) {
                    this.displaySuccess(`Guess those parameters need to be more accurate`);
                }
                
                this.showModal = !this.showModal;
                this.selectedTerm = this.nameToModify.listType;
            }); 
        },
        displayUpdateModal: function(e,person) {
            e.preventDefault();
            //setting the properties when we want the modal to update
            this.nameToModify = person;
            this.nameToModify.listType = this.selectedTerm;
            this.modalTitle = `Updating ${person.name}`;
            this.showModal = !this.showModal;
        }
    },
    // end methods
    created() {
        //checking for local storage
        this.loadOtherUser();
        this.getUsers('/getTitles');

    },//end created
    computed: {

    },
});

