var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var moment2 = require("moment");

Vue.component("note-card", {
    props: ["cert_user_id", "noteData"],
    data: function() {
        return {
            note: this.noteData
        }
    },
    computed: {},
    methods: {
        todoToggle: function() {
            this.$emit('todoToggle', this.note);
        },
        editNote: function() {
            this.$emit('editNote', this.note);
        },
        deleteNote: function() {
            this.$emit('deleteNote', this.note);
        },
        moment: moment2
    },
    template: `
        <div class="card">
            <div class="card-header">
                <button class="btn btn-action btn-link btn-sm float-right" v-on:click.prevent="todoToggle"><i v-bind:class="'icon icon-' + (note.todoCheck ? 'check' : 'plus')"></i></button>
                <div v-bind:class="'card-title h5 ' + (note.todoCheck ? 'text-gray' : '')">{{ note.title }}</div>
                <div class="card-subtitle text-gray">{{ moment(note.lastedited, "x").format("MMMM Do, YYYY - HH:mm:ss") }}</div>
            </div>
            <div v-bind:class="'card-body ' + (note.todoCheck ? 'text-gray' : '')">
                {{ note.body }}
            </div>
            <div class="card-footer">
                <button class="btn btn-primary">Share</button>
                <button class="btn btn-link">Encrypt</button>
                <button class="btn btn-action btn-warning float-right" v-on:click.prevent="deleteNote"><i class="icon icon-delete"></i></button>
            </div>
        </div>
    `
});