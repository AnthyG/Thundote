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
            this.$emit('getNoteList');
            console.log(this.noteList, this.noteList !== null, this.searchFor);
        }

        console.log("Loaded App (home)", this.userInfo);
    },
    props: {
        userInfo: Object,
        siteInfo: Object,
        getList: String,
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
        },
        curList: function() {
            var lists = ["l", "c"];
            var listsn = ["local", "synced"];
            return listsn[lists.indexOf(this.getList)];
        },
        p_noteList: function() {
            var dis = this;

            console.log("Filtering notes", this.hideChecked, this.searchFor);

            if (this.noteList !== null)
                return this.noteList.filter(function(a, b) {
                    if (dis.hideChecked && a.todoCheck) {
                        return false;
                    }

                    if (dis.searchFor) {
                        var s = new RegExp(dis.searchFor, "m");

                        if (!s.test(a.body) && !s.test(a.title)) {
                            return false;
                        }
                    }

                    return true;
                });
            else return [];
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
        addNote: function(e, note, sync, key) {
            var sync = sync === true ? true : (this.getList === "c" ? true : false);
            this.$emit('addNote', note, sync, key);
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
        },
        setGetList: function(to, forceget) {
            this.$emit('setGetList', to, forceget);
        }
    },
    template: `
        <div>
            <div v-if="isLoggedIn">
                <div class="empty">
                    <div class="empty-icon">
                        <i class="mdi">{{ this.getList === 'c' ? 'cloud' : 'cloud_off' }}</i>
                    </div>
                    <p class="empty-title h5">
                        You have {{ p_noteList !== null ? p_noteList.length : 'no' }} {{ curList }} note{{ p_noteList.length === 1 ? '' : 's' }}
                        <span v-if="searchFor"><i>containing</i> <mark>{{ searchFor }}</mark></span>
                    </p>
                    <p class="empty-subtitle">Add new notes and tick your completed tasks!</p>
                    <div class="empty-action">
                        <button class="btn btn-primary btn-action" v-on:click.prevent="setGetList(getList, true)"><i class="mdi">refresh</i></button>
                        <button class="btn btn-primary" v-on:click.prevent="setGetList(true)"><i class="mdi">{{ this.getList === 'c' ? 'cloud' : 'cloud_off' }}</i></button>
                        <button class="btn btn-primary" v-on:click.prevent="addNote"><i class="mdi">add</i></button>
                        <button class="btn btn-secondary" v-on:click.prevent="toggleHideChecked">{{ hideChecked ? 'Show ticked' : 'Hide ticked' }}</button>
                    </div>
                    <!--<h5 v-if="searchFor"><br>{{ p_noteList.length }} search-results for <mark>{{ searchFor }}</mark></h5>-->
                </div>
                <note-list v-if="p_noteList !== null"
                v-bind:noteList="p_noteList" v-bind:hideChecked="hideChecked" v-bind:searchFor="searchFor"
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