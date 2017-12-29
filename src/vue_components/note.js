var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

Vue.component("note-card", {
    props: ["cert_user_id", "noteData", "colors"],
    data: function() {
        return {
            moreMenuActive: false,
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
        },
        toggleMoreMenu: function(to) {
            console.log("Toggle more menu", to, this.moreMenuActive);
            if (typeof to === "boolean")
                this.moreMenuActive = to;
            else
                this.moreMenuActive = !this.moreMenuActive;
        }
    },
    template: `
        <div v-bind:class="'card color-grey-800 bg-color-' + (note.color ? note.color : 'grey-100')" v-bind:data-ticked="note.todoCheck ? 'true' : 'false'" v-on:focusout="toggleMoreMenu(false)">
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
            <div v-bind:class="'card-footer nohoverhide ' + (moreMenuActive ? 'active' : '') + ' bg-color-' + (note.color ? note.color : 'grey-100')">
                <button class="btn btn-action btn-link color-grey-900 tooltip tooltip-bottom" data-tooltip="Open editor" v-on:click.prevent="openEditor"><i class="mdi">mode_edit</i></button>
                <div class="popover">
                    <button class="btn btn-action btn-link color-grey-900 tooltip tooltip-bottom" data-tooltip="Color"><i class="mdi">color_lens</i></button>
                    <div class="popover-container">
                        <div class="card">
                            <div class="card-body">
                                <button v-for="(color) in colors"
                                v-bind:class="'btn btn-action m-5 tooltip tooltip-bottom circle bg-color-' + color"
                                style="width: 1.5rem; height: 1.5rem;"
                                v-bind:data-tooltip="color" v-on:click.prevent="colorChange(color)">
                                    <div v-if="(note.color ? note.color : 'grey-100') === color" class="icon icon-check color-grey-900"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-bind:class="'dropdown ' + (moreMenuActive ? 'active' : '')">
                    <button class="btn btn-action btn-link color-grey-900 dropdown-toggle" tabindex="0" v-on:focus="toggleMoreMenu(true)" v-on:mousedown="toggleMoreMenu" v-on:blur="toggleMoreMenu(false)">
                        <i class="mdi">more_vert</i>
                    </button>
                    <ul class="menu text-light">
                        <li class="menu-item">
                            <a href="#" v-on:click.prevent="">Share</a>
                        </li>
                        <li class="menu-item">
                            <a href="#" v-on:click.prevent="">Set up reminder</a>
                        </li>
                        <li class="menu-item">
                            <a href="#" v-on:click.prevent="">Encrypt</a>
                        </li>
                        <li class="menu-item divider"></li>
                        <li class="menu-item">
                            <a href="#" v-on:click.prevent="deleteNote">Delete</a>
                        </li>
                    </ul>
                </div>
                <!--<button class="btn btn-action btn-link color-grey-900 float-right tooltip tooltip-bottom" data-tooltip="Delete" v-on:click.prevent="deleteNote"><i class="mdi">delete_forever</i></button>-->
            </div>
        </div>
    `
});