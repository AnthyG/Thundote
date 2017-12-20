var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Home = {
    beforeMount: function() {
        // this.$emit('getUserInfo');
        if (this.userInfo == null || this.userInfo.cert_user_id == null) {
            Router.navigate('');
            console.log("Redirected to LP", this.userInfo);
        } else {
            Router.navigate('/app');
            this.getNoteList();
            console.log(this.noteList, this.noteList !== null, this.searchFor);
        }

        console.log("Loaded App (home)", this.userInfo);

        // this.getNoteList();
        // console.log("Loaded App (home)", this.userInfo);
        // console.log(this.noteList, this.noteList !== null, this.searchFor);
    },
    props: {
        userInfo: Object,
        siteInfo: Object,
        getNoteList: Function,
        noteList: {
            type: Array,
            default: function() {
                return [];
            }
        },
        searchFor: String
    },
    data: function() {
        return {
            hideChecked: false
        }
    },
    computed: {
        isLoggedIn: function() {
            if (this.userInfo == null) return false;
            return this.userInfo.cert_user_id != null;
        }
    },
    methods: {
        logIn: function() {
            this.$emit('logIn');
        },
        logOut: function() {
            this.$emit('logOut');
        },
        goto: function(to) {
            Router.navigate(to);
        },
        setSearch: function(s) {
            this.searchFor = s;
            console.log("Searching", s);
            this.$emit('setSearch', s);
        },
        addNote: function() {
            this.$emit('addNote');
        },
        todoToggle: function(note) {
            this.$emit('todoToggle', note);
        },
        editNote: function(note) {
            this.$emit('editNote', note);
        },
        deleteNote: function(note) {
            this.$emit('deleteNote', note);
        },
        toggleHideChecked: function(to) {
            this.hideChecked = typeof to === "boolean" ? to : !this.hideChecked;
        }
    },
    template: `
        <div>
            <div v-if="isLoggedIn">
                <div class="empty">
                    <div class="empty-icon">
                        <i class="mdi">note</i>
                    </div>
                    <p class="empty-title h5">You have {{ noteList !== null ? noteList.length : 'no' }} notes</p>
                    <p class="empty-subtitle">Add new notes and tick your completed tasks!</p>
                    <div class="empty-action">
                        <button class="btn btn-primary" v-on:click.prevent="addNote">Add note</button>
                        <button class="btn btn-secondary" v-on:click.prevent="toggleHideChecked">{{ hideChecked ? 'Show ticked' : 'Hide ticked' }}</button>
                    </div>
                </div>
                <note-list v-if="noteList !== null"
                v-bind:noteList="noteList" v-bind:hideChecked="hideChecked" v-bind:searchFor="searchFor"
                v-on:editNote="editNote" v-on:todoToggle="todoToggle" v-on:deleteNote="deleteNote"></note-list>
            </div>
            <div v-else>
                <h1>Thundote</h1>
                <h4>Please <a href="#" v-on:click.prevent="logIn">log in</a> to use Thundote!</h4>
            </div>
        </div>
    `
};

module.exports = Home;