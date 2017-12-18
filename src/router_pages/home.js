var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Home = {
    beforeMount: function() {
        this.getNoteList();
        console.log("Loaded home");
        console.log(this.noteList, this.noteList !== null, this.searchFor);
    },
    props: {
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
    methods: {
        goto: function(to) {
            Router.navigate(to);
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
            <div class="empty">
                <div class="empty-icon">
                    <i class="mdi">note</i>
                </div>
                <p class="empty-title h5">You have {{ this.noteList !== null ? this.noteList.length : 'no' }} notes</p>
                <p class="empty-subtitle">Add new notes and tick your completed tasks!</p>
                <div class="empty-action">
                    <button class="btn btn-primary" v-on:click.prevent="addNote">Add note</button>
                    <button class="btn btn-secondary" v-on:click.prevent="toggleHideChecked">{{ hideChecked ? 'Show checked' : 'Hide checked' }}</button>
                </div>
            </div>
            <note-list v-if="this.noteList !== null"
            v-bind:noteList="this.noteList" v-bind:hideChecked="hideChecked" v-bind:searchFor="this.searchFor"
            v-on:editNote="editNote" v-on:todoToggle="todoToggle" v-on:deleteNote="deleteNote"></note-list>
        </div>
    `
};

module.exports = Home;