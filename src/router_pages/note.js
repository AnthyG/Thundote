var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var moment2 = require("moment");

var Note = {
    beforeMount: function() {
        this.$emit('getNoteList');
        console.log("Opened note", Router.currentParams.uuid, this.getList, this.noteList, this.searchFor);
    },
    props: {
        userInfo: Object,
        siteInfo: Object,
        getList: String,
        colors: Array,
        noteList: {
            type: Array,
            default: function() {
                return [];
            }
        },
        searchFor: String
    },
    computed: {
        note: function() {
            var uuid = Router.currentParams.uuid;
            var nid;

            if (this.noteList === null) return {
                "uuid": uuid,
                "title": "",
                "body": "",
                "todoCheck": "",
                "lastedited": "",
                "encrypted": false
            };

            var editableNotes = this.noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });
            if (editableNotes.length !== 1) return false;

            return editableNotes[0];
        },
        isLoggedIn: function() {
            if (this.userInfo == null) return false;
            return this.userInfo.cert_user_id != null;
        },
        curList: function() {
            var lists = ["l", "c"];
            var listsn = ["local", "synced"];
            return listsn[lists.indexOf(this.getList)];
        }
    },
    methods: {
        goto: function(to) {
            Router.navigate(to);
        },
        setSearch: function(s) {
            this.searchFor = s;
            console.log("Searching", s);
            this.$emit('setSearch', s);
        },
        todoToggle: function(to) {
            this.$emit('todoToggle', this.note, to);
        },
        colorChange: function(to) {
            this.$emit('colorChange', this.note, to);
        },
        editNote: function() {
            this.$emit('editNote', this.note);
        },
        deleteNote: function() {
            this.$emit('deleteNote', this.note);
            this.goto('/app');
        },
        moment: moment2
    },
    template: `
        <div class="modal-lg modal active">
            <div v-bind:class="'modal-overlay bg-color-i-' + (note.color ? note.color : 'grey-100')" v-on:click.prevent="goto('/app')"></div>
            <div v-bind:class="'modal-container bg-color-' + (note.color ? note.color : 'grey-100')">
                <div class="modal-header">
                    <button class="btn btn-action btn-link color-grey-900 float-right tooltip tooltip-bottom" data-tooltip="Close editor" v-on:click.prevent="goto('/app')">
                        <i class="icon icon-cross"></i>
                    </button>
                    <div class="modal-title h5">
                        <div class="input-group">
                            <input type="text" v-bind:class="'form-input color-grey-800 bg-color-' + (note.color ? note.color : 'grey-100')" placeholder="Title" v-model="note.title" v-on:change="editNote" />
                            <button v-bind:class="'btn btn-action color-grey-900 input-group-btn tooltip tooltip-bottom bg-color-' + (note.color ? note.color : 'grey-100')" v-bind:data-tooltip="note.todoCheck ? 'Un-tick!' : 'Tick!'" v-on:click.prevent="todoToggle">
                                <i v-bind:class="'icon icon-' + (note.todoCheck ? 'check' : 'plus')"></i>
                            </button>
                        </div>
                    </div>
                    <div class="modal-subtitle text-gray">{{ moment(note.lastedited, "x").format("MMMM Do, YYYY - HH:mm:ss") }}</div>
                </div>
                <div class="modal-body" style="height: 50vh;">
                    <div class="content" style="height: 100%;">
                        <div class="col-12" style="height: 100%;">
                            <textarea style="height: 100%; resize: none;" v-bind:class="'form-input color-grey-800 bg-color-' + (note.color ? note.color : 'grey-100')" placeholder="Content" v-model="note.body" v-on:change="editNote"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="text-align: left;">
                    <button class="btn btn-action btn-link color-grey-900 tooltip tooltip-bottom" data-tooltip="Share"><i class="mdi">share</i></button>
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
        </div>
    `
};

module.exports = Note;