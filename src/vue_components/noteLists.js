var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var moment2 = require("moment");

Vue.component('note-list', {
    props: {
        hideChecked: {
            type: Boolean,
            default: false
        },
        searchFor: {
            type: String,
            default: ''
        },
        noteList: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data: function() {
        return {
            order: "",
            hideChecked: this.hideChecked || false,
            noteList: this.noteList || []
        }
    },
    computed: {
        r_noteList: function() {
            return this.noteList.slice(0).reverse();
        }
    },
    methods: {
        todoToggle: function(note) {
            this.$emit('todoToggle', note);
        },
        editNote: function(note) {
            this.$emit('editNote', note);
        },
        deleteNote: function(note) {
            this.$emit('deleteNote', note);
        },
        moment: moment2
    },
    template: `
        <div v-if="noteList !== null" class="container">
            <div class="columns" v-for="(note, i) in r_noteList">
                <note-card class="col-12 light" v-bind:index="i" v-bind:key="note.uuid" v-bind:noteData="note"
                v-on:editNote="editNote" v-on:todoToggle="todoToggle" v-on:deleteNote="deleteNote"></note-card>
            </div>
        </div>
    `
});