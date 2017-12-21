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
        goto: function(to) {
            Router.navigate(to);
        },
        todoToggle: function() {
            console.log("Todo-Toggle", this.note);
            this.$emit('todoToggle', this.note);
        },
        editNote: function() {
            console.log("Edit note", this.note);
            this.$emit('editNote', this.note);
        },
        openEditor: function() {
            console.log("Open editor", this.note);
            this.goto('/note/' + this.note.uuid);
        },
        deleteNote: function() {
            console.log("Delete note", this.note);
            this.$emit('deleteNote', this.note);
        },
        moment: moment2
    },
    template: `
        <div class="card light">
            <div class="card-header">
                <button class="btn btn-action btn-link btn-sm float-right tooltip tooltip-bottom" v-bind:data-tooltip="note.todoCheck ? 'Un-tick!' : 'Tick!'" v-on:click.prevent="todoToggle">
                    <i v-bind:class="'icon icon-' + (note.todoCheck ? 'check' : 'plus')"></i>
                </button>
                <div v-bind:class="'card-title h5 ' + (note.todoCheck ? 'text-gray' : '')" v-on:click.prevent="openEditor">{{ note.title }}</div>
                <div class="card-subtitle text-gray">{{ moment(note.lastedited, "x").format("MMMM Do, YYYY - HH:mm:ss") }}</div>
            </div>
            <div v-bind:class="'card-body ' + (note.todoCheck ? 'text-gray' : '')" v-on:click.prevent="openEditor">
                {{ note.body }}
            </div>
            <div class="card-footer">
                <button class="btn btn-action btn-link tooltip tooltip-bottom" data-tooltip="Share"><i class="mdi">share</i></button>
                <button class="btn btn-action btn-link tooltip tooltip-bottom" data-tooltip="Open editor"><i class="mdi" v-on:click.prevent="openEditor">mode_edit</i></button>
                <button class="btn btn-action btn-link tooltip tooltip-bottom" data-tooltip="Encrypt"><i class="mdi">lock_outline</i></button>
                <button class="btn btn-action btn-link float-right tooltip tooltip-bottom" data-tooltip="Delete" v-on:click.prevent="deleteNote"><i class="mdi">delete_forever</i></button>
            </div>
        </div>
    `
});