var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

Vue.component("note-card", {
    props: ["cert_user_id", "noteData", "colors"],
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
        todoToggle: function(to) {
            console.log("Todo-Toggle", this.note, to);
            this.$emit('todoToggle', this.note, to);
        },
        colorChange: function(to) {
            console.log("Color-Change", this.note, to);
            this.$emit('colorChange', this.note, to);
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
        }
    },
    template: `
        <div v-bind:class="'card color-grey-800 bg-color-' + (note.color ? note.color : 'grey-100')" v-bind:data-ticked="note.todoCheck ? 'true' : 'false'">
            <div class="card-header">
                <button class="btn btn-action btn-link color-grey-900 btn-sm nohoverhide float-right tooltip tooltip-bottom" v-bind:data-tooltip="note.todoCheck ? 'Un-tick!' : 'Tick!'" v-on:click.prevent="todoToggle">
                    <i v-bind:class="'icon icon-' + (note.todoCheck ? 'check' : 'plus')"></i>
                </button>
                <div v-bind:class="'card-title h5 text-break text-ellipsis ' + (note.todoCheck ? 'color-grey-600' : '')" v-on:click.prevent="openEditor">{{ note.title }}</div>
                <small class="card-subtitle color-grey-600 nohoverhide" v-on:click.prevent="openEditor">{{ moment(note.lastedited, "x").format("MMMM Do, YYYY - HH:mm:ss") }}</small>
            </div>
            <div v-bind:class="'card-body text-break text-ellipsis ' + (note.todoCheck ? 'color-grey-600' : '')"
            style="white-space: pre-line;"
            v-on:click.prevent="openEditor">{{ note.body }}</div>
            <div v-bind:class="'card-footer nohoverhide bg-color-' + (note.color ? note.color : 'grey-100')">
                <button class="btn btn-action btn-link color-grey-900 tooltip tooltip-bottom" data-tooltip="Share"><i class="mdi">share</i></button>
                <button class="btn btn-action btn-link color-grey-900 tooltip tooltip-bottom" data-tooltip="Open editor"><i class="mdi" v-on:click.prevent="openEditor">mode_edit</i></button>
                <button class="btn btn-action btn-link color-grey-900 tooltip tooltip-bottom" data-tooltip="Encrypt"><i class="mdi">lock_outline</i></button>
                <div class="popover">
                    <button class="btn btn-action btn-link color-grey-900 tooltip tooltip-bottom" data-tooltip="Color"><i class="mdi">color_lens</i></button>
                    <div class="popover-container">
                        <div class="card">
                            <div class="card-body">
                                <button v-for="(color) in colors"
                                v-bind:class="'btn btn-action mr-10 mb-10 tooltip tooltip-bottom circle bg-color-' + color"
                                style="width: 1.5rem; height: 1.5rem;"
                                v-bind:data-tooltip="color" v-on:click.prevent="colorChange(color)"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<div class="dropdown">
                    <a href="#" class="btn btn-link color-grey-900 dropdown-toggle" tabindex="0">
                        <i class="mdi">more_vert</i>
                    </a>
                    <ul class="menu">
                        <li class="menu-item"></li>
                    </ul>
                </div>-->
                <button class="btn btn-action btn-link color-grey-900 float-right tooltip tooltip-bottom" data-tooltip="Delete" v-on:click.prevent="deleteNote"><i class="mdi">delete_forever</i></button>
            </div>
        </div>
    `
});