var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Home = {
    beforeMount: function() {
        // this.$emit('getUserInfo');
        if (this.userInfo == null || this.userInfo.cert_user_id == null) {
            Router.navigate('');
            console.log("Redirected to LP", this.userInfo);
        } else {
            var lists = this.getLists;
            var listsn = this.getListsN;

            console.log("Lists", lists, listsn);

            if (!Router.currentParams.hasOwnProperty("list") || Router.currentParams.list == "") {
                this.$emit('setGetList', "local");
                Router.navigate('/app/local');
            } else if (Router.currentParams.hasOwnProperty("list")) {
                var trycurlist = Router.currentParams.list;
                var trycurlistI = listsn.indexOf(trycurlist);
                if (trycurlistI !== -1) {
                    this.$emit('setGetList', lists[trycurlistI]);
                    Router.navigate('/app/' + trycurlist);
                } else {
                    this.$emit('setGetList', "local");
                    Router.navigate('/app/local');
                }
            } else {
                this.$emit('getNoteList');
            }

            if (Router.currentParams.hasOwnProperty("search") && Router.currentParams.search != "") {
                this.searchFor = Router.currentParams.search;
                console.log("Searching", s);
                this.$emit('setSearch', s);
            }

            console.log("Staying on Home", Router.currentParams, this.noteList, this.noteList !== null, this.searchFor);
        }

        console.log("Loaded App (home)", this.userInfo);
    },
    props: {
        userInfo: Object,
        siteInfo: Object,
        getList: String,
        getLists: Array,
        getListsN: Array,
        noteList: {
            type: Array,
            default: function() {
                return [];
            }
        },
        searchFor: String,
        colors: Array
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
            var lists = this.getLists;
            var listsn = this.getListsN;
            return listsn[lists.indexOf(this.getList)];
        },
        listIcon: function() {
            return this.getList === 'l' ? 'cloud_off' :
                (this.getList === 's' ? 'cloud' :
                    (this.getList === 'sh' ? 'cloud_upload' :
                        (this.getList === 'osh' ? 'cloud_download' :
                            'error')));
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
                        var s = new RegExp(dis.searchFor, "mi");

                        if (!s.test(a.body) && !s.test(a.title)) {
                            return false;
                        }
                    }

                    return true;
                });
            else return [];
        }
    },
    watch: {
        getList: function() {
            console.log("Watching getList", this.getList);

            this.naviList();

            return this.getList;
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
            var sync = sync === true ? true : (this.getList === "s" ? true : false);
            // var key = key != "" ? key : (this.addNoteKey != "" ? this.addNoteKey : undefined);
            this.$emit('addNote', note, sync, key);
        },
        todoToggle: function(note, to) {
            this.$emit('todoToggle', note, to);
        },
        colorChange: function(note, to) {
            this.$emit('colorChange', note, to);
        },
        editNote: function(note) {
            this.$emit('editNote', note);
        },
        orderNotes: function(e) {
            this.$emit('orderNotes', e);
        },
        deleteNote: function(note) {
            this.$emit('deleteNote', note);
        },
        toggleHideChecked: function(to) {
            this.hideChecked = typeof to === "boolean" ? to : !this.hideChecked;
        },
        setGetList: function(to, forceget) {
            this.$emit('setGetList', to, forceget);
        },
        naviList: function() {
            var lists = this.getLists;
            var listsn = this.getListsN;

            var getList = this.getList;

            var getListI = lists.indexOf(getList);

            console.log("Navigating list", getList, getListI);

            if (getListI !== -1) {
                this.$emit('setGetList', getList);

                var path = '/app/' + listsn[getListI];

                Router.navigate(path);
            } else {
                this.$emit('setGetList', "local");

                var path = '/app/local';

                Router.navigate(path);
            }

            return path;
        }
    },
    template: `
        <div>
            <div v-if="isLoggedIn">
                <div class="empty">
                    <div class="empty-icon">
                        <i class="mdi">{{ listIcon }}</i>
                    </div>
                    <p class="empty-title h5">
                        You have {{ p_noteList !== null ? p_noteList.length : 'no' }} {{ curList }} {{ hideChecked ? 'ticked ' : '' }} note{{ p_noteList.length === 1 ? '' : 's' }}
                        <span v-if="searchFor"><i>containing</i> <mark>{{ searchFor }}</mark></span>
                    </p>
                    <p class="empty-subtitle">Add new notes and tick your completed tasks!</p>
                    <div class="empty-action">
                        <button class="btn btn-primary btn-action" v-on:click.prevent="setGetList(getList, true)"><i class="mdi">refresh</i></button>
                        <button class="btn btn-primary btn-action"
                        v-on:click.prevent="setGetList(getList === 'l' ? 's' : (getList === 's' ? 'l' : (getList === 'sh' ? 'osh' : (getList === 'osh' ? 'sh' : 'l'))))">
                            <i class="mdi">{{ listIcon }}</i>
                        </button>
                        <button class="btn btn-primary btn-action" v-on:click.prevent="addNote"><i class="mdi">add</i></button>
                        <button class="btn btn-secondary" v-on:click.prevent="toggleHideChecked">{{ hideChecked ? 'Show ticked' : 'Hide ticked' }}</button>
                    </div>
                    <!--<h5 v-if="searchFor"><br>{{ p_noteList.length }} search-results for <mark>{{ searchFor }}</mark></h5>-->
                </div>
                <note-list v-if="p_noteList !== null && p_noteList.length > 0"
                v-bind:noteList="p_noteList" v-bind:hideChecked="hideChecked" v-bind:searchFor="searchFor"
                v-bind:colors="colors"
                v-on:editNote="editNote" v-on:todoToggle="todoToggle" v-on:colorChange="colorChange" v-on:orderNotes="orderNotes"
                v-on:deleteNote="deleteNote"></note-list>
            </div>
            <div v-else>
                <h1>Thundote</h1>
                <h4>Please <a href="#" v-on:click.prevent="logIn">log in</a> to use Thundote!</h4>
            </div>
        </div>
    `
};

module.exports = Home;